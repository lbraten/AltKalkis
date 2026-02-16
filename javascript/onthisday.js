(() => {
  const TARGET_ID = "dagens";

  // Velg språk: 'nb' (norsk bokmål). Fallback til 'en' om noe feiler.
  const PRIMARY_LANG = "en";
  const FALLBACK_LANG = "en";

  // Hvor mange punkter vil du vise?
  const MAX_ITEMS = 5;

  // Enkel cache i localStorage (sparer requests)
  const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 timer

  const pad2 = (n) => String(n).padStart(2, "0");

  function getTodayMMDD() {
    const d = new Date(); // lokal dato (Oslo)
    return { mm: pad2(d.getMonth() + 1), dd: pad2(d.getDate()) };
  }

  function cacheKey(lang, mm, dd, type) {
    return `otd:${lang}:${type}:${mm}${dd}`;
  }

  function loadCache(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj?.ts || !obj?.data) return null;
      if (Date.now() - obj.ts > CACHE_TTL_MS) return null;
      return obj.data;
    } catch {
      return null;
    }
  }

  function saveCache(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
    } catch {
      // ignore (storage full / blocked)
    }
  }

  function wikiUrlFromPage(lang, page) {
    // Feed API pleier å ha content_urls.desktop.page i page-objektet.
    const direct = page?.content_urls?.desktop?.page;
    if (direct) return direct;

    // fallback: bygg URL fra tittel
    const title = page?.title || "";
    const slug = encodeURIComponent(title.replace(/ /g, "_"));
    return `https://${lang}.wikipedia.org/wiki/${slug}`;
  }

  function pickItems(data) {
    // Prioriter "selected" (kuraterte), ellers "events".
    const list =
      (Array.isArray(data?.selected) && data.selected) ||
      (Array.isArray(data?.events) && data.events) ||
      [];

    return list.slice(0, MAX_ITEMS);
  }

  function render(container, lang, mm, dd, data) {
    const items = pickItems(data);

    if (!items.length) {
      container.textContent = "Fant ingen historiske punkter for i dag.";
      return;
    }

    const niceDate = `${dd}.${mm}`;
    const ul = document.createElement("ul");
    ul.className = "otd-list";

    for (const item of items) {
      const li = document.createElement("li");
      li.className = "otd-item";

      const year = item?.year ? String(item.year) : "";
      const text = item?.text || "Ukjent hendelse";

      // Velg første relaterte side som link (om den finnes)
      const page = Array.isArray(item?.pages) ? item.pages[0] : null;
      const url = page ? wikiUrlFromPage(lang, page) : null;

      const yearSpan = document.createElement("span");
      yearSpan.className = "otd-year";
      yearSpan.textContent = year ? `${year}: ` : "";

      const textSpan = document.createElement("span");
      textSpan.className = "otd-text";

      if (url) {
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = text;
        textSpan.appendChild(a);
      } else {
        textSpan.textContent = text;
      }

      li.appendChild(yearSpan);
      li.appendChild(textSpan);
      ul.appendChild(li);
    }

    container.innerHTML = "";
    const header = document.createElement("div");
    header.className = "otd-header";
    header.innerHTML = `<strong>På denne dagen (${niceDate})</strong>`;

    const source = document.createElement("div");
    source.className = "otd-source";
    source.innerHTML = `Kilde: https://${lang}.wikipedia.org/Wikipedia</a>`;

    container.appendChild(header);
    container.appendChild(ul);
    container.appendChild(source);
  }

  async function fetchOnThisDay(lang, type, mm, dd) {
    const url = `https://api.wikimedia.org/feed/v1/wikipedia/${lang}/onthisday/${type}/${mm}/${dd}`;
    // Endepunkt + parametre er dokumentert av Wikimedia Feed API. [1](https://api.wikimedia.org/wiki/Feed_API/Reference/On_this_day)

    const res = await fetch(url, {
      headers: {
        "Accept": "application/json",
        // Wikimedia ber om at klienter identifiserer seg med User-Agent/Api-User-Agent. [2](https://www.mediawiki.org/wiki/Wikimedia_REST_API)
        "Api-User-Agent": "AltKalkis/1.0 (https://ditt-domene.no; kontakt@ditt-domene.no)"
      },
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
  }

  async function init() {
    const container = document.getElementById(TARGET_ID);
    if (!container) return;

    const { mm, dd } = getTodayMMDD();
    const type = "all"; // kan endres til events/births/deaths/holidays [1](https://api.wikimedia.org/wiki/Feed_API/Reference/On_this_day)

    // 1) prøv cache
    const key1 = cacheKey(PRIMARY_LANG, mm, dd, type);
    const cached1 = loadCache(key1);
    if (cached1) {
      render(container, PRIMARY_LANG, mm, dd, cached1);
      return;
    }

    container.textContent = "Laster historiske hendelser…";

    try {
      const data = await fetchOnThisDay(PRIMARY_LANG, type, mm, dd);
      saveCache(key1, data);
      render(container, PRIMARY_LANG, mm, dd, data);
    } catch (e1) {
      // fallback: engelsk
      try {
        const key2 = cacheKey(FALLBACK_LANG, mm, dd, type);
        const cached2 = loadCache(key2);
        if (cached2) {
          render(container, FALLBACK_LANG, mm, dd, cached2);
          return;
        }

        const data2 = await fetchOnThisDay(FALLBACK_LANG, type, mm, dd);
        saveCache(key2, data2);
        render(container, FALLBACK_LANG, mm, dd, data2);
      } catch (e2) {
        container.textContent =
          "Kunne ikke hente 'On this day' akkurat nå (nettverk / API-feil).";
        console.error("OnThisDay error:", e1, e2);
      }
    }
  }

  // Kjør når DOM er klar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
       init();
  }
})();