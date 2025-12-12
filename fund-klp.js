
// =====================
// KONFIG
// =====================

// KLP AksjeGlobal Indeks N
const ISIN = "NO0012445404"; // [1](https://www.skagenfondene.no/fond/aksjefond/klp-aksjeglobal-indeks-n/)[2](https://api.fund.storebrand.no/open/funddata/document?documentType=FUND_PROFILE&isin=NO0012445404&languageCode=no&market=NOR)

// Leeway API (historiske kurser + ISIN-søk) [3](https://www.leeway.tech/data-api/live/en)
const LEEWAY_TOKEN = "DIN_LEEWAY_TOKEN_HER";
const LEEWAY_BASE = "https://api.leeway.tech/api/v1/public";

// Cache for å spare API-kall (gratisnivået er begrenset) [3](https://www.leeway.tech/data-api/live/en)
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 timer

// =====================
// UI helpers
// =====================
function setStatus({ pctText = "—", cls = "flat", meta = "", error = "" }) {
  const pctEl = document.getElementById("pct");
  const metaEl = document.getElementById("meta");
  const errEl = document.getElementById("error");

  pctEl.textContent = pctText;
  pctEl.classList.remove("up", "down", "flat");
  pctEl.classList.add(cls);

  metaEl.textContent = meta;

  if (error) {
    errEl.hidden = false;
    errEl.textContent = error;
  } else {
    errEl.hidden = true;
    errEl.textContent = "";
  }
}

function formatPct(x) {
  const sign = x > 0 ? "+" : "";
  return `${sign}${x.toFixed(2)}%`;
}

function cacheGet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj?.ts || obj?.data == null) return null;
    if (Date.now() - obj.ts > CACHE_TTL_MS) return null;
    return obj.data;
  } catch {
    return null;
  }
}

function cacheSet(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch { /* ignore */ }
}

// =====================
// API calls
// =====================


async function resolveSymbolByIsin_OpenFIGI(isin) {
  const OPENFIGI_KEY = "DIN_OPENFIGI_API_KEY"; // gratis å få
  const url = "https://api.openfigi.com/v3/mapping";
  const body = [{
    idType: "ID_ISIN",
    idValue: isin,
    // Tips: snevre inn på børs hvis du vet den:
    // exchCode: "OSE", // Oslo Børs
  }];

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-OPENFIGI-APIKEY": OPENFIGI_KEY
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`OpenFIGI (HTTP ${res.status})`);

  const json = await res.json();
  // Finn første treff med ticker
  const data = json?.[0]?.data || [];
  if (!data.length) throw new Error(`Fant ikke symbol for ISIN ${isin} via OpenFIGI.`);
  const withTicker = data.find(x => x.ticker) || data[0];
  return withTicker.ticker || withTicker.name || isin;
}

async function fetchHistoricalQuotes(symbol) {
  const cacheKey = `leeway_hist_${symbol}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  // Leeway: historiske kurser via /historicalquotes/{SYMBOL.EXCHANGE} [3](https://www.leeway.tech/data-api/live/en)
  const url = `${LEEWAY_BASE}/historicalquotes/${encodeURIComponent(symbol)}?apitoken=${encodeURIComponent(LEEWAY_TOKEN)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Historikk feilet (HTTP ${res.status})`);

  const json = await res.json();

  const rows = Array.isArray(json) ? json : (json.data || json.results || json.quotes || []);
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("Ingen historiske data i responsen.");
  }

  cacheSet(cacheKey, rows);
  return rows;
}

// =====================
// Data-behandling
// =====================

function normalizeRows(rows) {
  // Vi forventer felter som o/h/l/c/v/date (Leeway beskriver dette for historikk) [3](https://www.leeway.tech/data-api/live/en)
  const out = rows
    .map(r => {
      const dateStr = r.date || r.datetime || r.day || null;
      const ts = r.timestamp ? Number(r.timestamp) : null;

      // Finn dato
      let iso;
      if (dateStr) {
        // ofte "YYYY-MM-DD"
        iso = String(dateStr).slice(0, 10);
      } else if (Number.isFinite(ts)) {
        iso = new Date(ts * 1000).toISOString().slice(0, 10);
      } else {
        return null;
      }

      // close
      const close = Number(r.c ?? r.close ?? r.price ?? r.nav);
      if (!Number.isFinite(close)) return null;

      return { date: iso, close };
    })
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date)); // asc

  return out;
}

function findClosestOnOrBefore(rowsAsc, isoDate) {
  // Binærsøk: finn siste rad der date <= isoDate
  let lo = 0, hi = rowsAsc.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (rowsAsc[mid].date <= isoDate) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans >= 0 ? rowsAsc[ans] : null;
}

// =====================
// Main
// =====================

async function calculate() {
  const startDate = document.getElementById("startDate").value;
  if (!startDate) {
    setStatus({ error: "Velg en startdato." });
    return;
  }

  setStatus({ pctText: "Henter…", cls: "flat", meta: "" });

  try {
    const symbol = await resolveSymbolByIsin(ISIN);
    const raw = await fetchHistoricalQuotes(symbol);
    const rows = normalizeRows(raw);

    if (rows.length < 2) {
      setStatus({ error: "For få datapunkter til å beregne endring." });
      return;
    }

    const latest = rows[rows.length - 1];
    const start = findClosestOnOrBefore(rows, startDate);

    if (!start) {
      setStatus({ error: `Fant ingen kurs på eller før ${startDate}.` });
      return;
    }

    const pct = ((latest.close - start.close) / start.close) * 100;
    const cls = pct > 0.00001 ? "up" : pct < -0.00001 ? "down" : "flat";

    setStatus({
      pctText: formatPct(pct),
      cls,
      meta: `${symbol} | ${start.date} → ${latest.date} | ${start.close.toFixed(2)} → ${latest.close.toFixed(2)}`
    });

  } catch (e) {
    setStatus({
      error: `Klarte ikke å beregne. ${e?.message ? "Detaljer: " + e.message : ""}`
    });
  }
}

document.getElementById("calcBtn").addEventListener("click", calculate);
calculate(); // auto på load
