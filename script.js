document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM er lastet");

    const menuBtn = document.querySelector(".topbar__menu");
    const sidebar = document.getElementById("sidebarDrawer");
    const backdrop = document.querySelector("[data-drawer-backdrop]");
    const setDrawerOpen = (open) => {
        if (!menuBtn || !sidebar || !backdrop) return;
        sidebar.classList.toggle("is-open", open);
        backdrop.classList.toggle("is-open", open);
        menuBtn.classList.toggle("is-open", open);
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    };

    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            const isOpen = sidebar?.classList.contains("is-open");
            setDrawerOpen(!isOpen);
        });
    }

    if (backdrop) {
        backdrop.addEventListener("click", () => setDrawerOpen(false));
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setDrawerOpen(false);
    });

    //prosentkalkulator
    const percentValueInput = document.getElementById("percentValue");
    const percentPercentInput = document.getElementById("percentPercent");
    const percentResultEl = document.getElementById("percentResult");
    const updatePercent = () => {
        if (!percentValueInput || !percentPercentInput || !percentResultEl) return;
        const valueStr = percentValueInput.value;
        const percentStr = percentPercentInput.value;
        if (!valueStr && !percentStr) {
            percentResultEl.textContent = "Resultat:";
            return;
        }
        const value = parseFloat(valueStr);
        const percent = parseFloat(percentStr);
        if (!isNaN(value) && !isNaN(percent)) {
            const result = (value * percent / 100).toFixed(2);
            percentResultEl.textContent = `Resultat: ${result}`;
        } else {
            percentResultEl.innerText = "Skriv inn gyldige tall.";
        }
    };
    if (percentValueInput) percentValueInput.addEventListener("input", updatePercent);
    if (percentPercentInput) percentPercentInput.addEventListener("input", updatePercent);
    updatePercent();

    //timeslønn
    const monthlySalaryInput = document.getElementById("monthlySalary");
    const hoursPerWeekInput = document.getElementById("hoursPerWeek");
    const hourlyResultEl = document.getElementById("hourlyResult");
    const updateHourly = () => {
        if (!monthlySalaryInput || !hoursPerWeekInput || !hourlyResultEl) return;
        const salaryStr = monthlySalaryInput.value;
        const hoursStr = hoursPerWeekInput.value;
        if (!salaryStr && !hoursStr) {
            hourlyResultEl.innerText = "Timeslønn:";
            return;
        }
        const salary = parseFloat(salaryStr);
        const hours = parseFloat(hoursStr);
        if (isNaN(salary) || isNaN(hours) || hours <= 0) {
            hourlyResultEl.innerText = "Skriv inn gyldige verdier.";
            return;
        }
        const yearlyHours = hours * 52;
        const hourly = (salary * 12 / yearlyHours).toFixed(2);
        hourlyResultEl.innerText = `Timeslønn: ${hourly} kr/t`;
    };
    if (monthlySalaryInput) monthlySalaryInput.addEventListener("input", updateHourly);
    if (hoursPerWeekInput) hoursPerWeekInput.addEventListener("input", updateHourly);
    updateHourly();

    //alderskalkulator
    const birthDateInput = document.getElementById("birthDate");
    const ageResultEl = document.getElementById("ageResult");
    const updateAge = () => {
        if (!birthDateInput || !ageResultEl) return;
        const birthStr = birthDateInput.value;
        if (!birthStr) {
            ageResultEl.innerText = "Omtrent ...";
            return;
        }
        const birth = new Date(birthStr);
        const now = new Date();
        const diffMs = now - birth;
        const ageInYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
        const ageRounded = Math.floor(ageInYears * 10) / 10;
        const years = Math.floor(ageInYears);
        const months = Math.floor((ageInYears - years) * 12);
        if (years === 0 && months === 0) {
            const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const weeks = Math.floor(totalDays / 7);
            const days = totalDays % 7;
            ageResultEl.innerText = `Omtrent ${ageRounded} år (${weeks} uker og ${days} dager).`;
            return;
        }
        ageResultEl.innerText = `Omtrent ${ageRounded} år (${years} år og ${months} måneder).`;
    };
    if (birthDateInput) birthDateInput.addEventListener("input", updateAge);
    updateAge();

    //dato-diff
    const date1Input = document.getElementById("date1");
    const date2Input = document.getElementById("date2");
    const dateDiffResultEl = document.getElementById("dateDiffResult");
    const updateDateDiff = () => {
        if (!date1Input || !date2Input || !dateDiffResultEl) return;
        const d1Str = date1Input.value;
        const d2Str = date2Input.value;
        if (!d1Str && !d2Str) {
            dateDiffResultEl.innerText = "";
            return;
        }
        if (!d1Str || !d2Str) {
            dateDiffResultEl.innerText = "Velg to gyldige datoer.";
            return;
        }
        const d1 = new Date(d1Str);
        const d2 = new Date(d2Str);
        if (isNaN(d1) || isNaN(d2)) {
            dateDiffResultEl.innerText = "Velg to gyldige datoer.";
            return;
        }
        const diffMs = Math.abs(d2 - d1);
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        let years = d2.getFullYear() - d1.getFullYear();
        let months = d2.getMonth() - d1.getMonth();
        if (months < 0) { years--; months += 12; }
        dateDiffResultEl.innerHTML = `Forskjell: ${diffDays} dager<br>(${years} år og ${months} måneder)`;
    };
    if (date1Input) date1Input.addEventListener("input", updateDateDiff);
    if (date2Input) date2Input.addEventListener("input", updateDateDiff);
    updateDateDiff();

    //tid-diff
    const time1Input = document.getElementById("time1");
    const time2Input = document.getElementById("time2");
    const timeDiffResultEl = document.getElementById("timeDiffResult");

    //første input til nåværende tid
    if (time1Input) {
        const now = new Date();
        const pad = n => n.toString().padStart(2, '0');
        const currentTime = pad(now.getHours()) + ":" + pad(now.getMinutes());
        time1Input.value = currentTime;
    }
    if (time2Input) {
        time2Input.value = "";
    }

    const updateTimeDiff = () => {
        if (!time1Input || !time2Input || !timeDiffResultEl) return;
        const t1 = time1Input.value;
        const t2 = time2Input.value;
        if (!t1 && !t2) {
            timeDiffResultEl.innerText = "";
            return;
        }
        if (!t1 || !t2) {
            timeDiffResultEl.innerText = "Fyll inn begge klokkeslett.";
            return;
        }
        const [h1, m1] = t1.split(":").map(Number);
        const [h2, m2] = t2.split(":").map(Number);
        const total1 = h1 * 60 + m1;
        const total2 = h2 * 60 + m2;
        const diffMinutes = Math.abs(total2 - total1);
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        timeDiffResultEl.innerText = `Forskjell: ${hours} timer og ${minutes} minutter`;
    };
    if (time1Input) time1Input.addEventListener("input", updateTimeDiff);
    if (time2Input) time2Input.addEventListener("input", updateTimeDiff);
    updateTimeDiff();

    //tidssoner
    const tzBtn = document.getElementById("timezoneButton");
    if (tzBtn) {
        tzBtn.addEventListener("click", () => {
            const tzSelect = document.getElementById("timezoneSelect");
            const tzId = tzSelect.value;
            const tzLabel = tzSelect.options[tzSelect.selectedIndex].text;
            const el = document.getElementById("timezoneResult");
            try {
                const now = new Date().toLocaleString("nb-NO", { timeZone: tzId });
                if (el) el.innerText = `Tid i ${tzLabel}: ${now}`;
            } catch {
                if (el) el.innerText = `Ugyldig tidssone`;
            }
        });
    }

    //kalkulator
    const calcDisplay = document.getElementById("calcDisplay");
    const buttons = document.querySelectorAll(".calc-btn");
    let currentInput = "";
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const value = button.textContent;
            if (button.id === "clear") {
                currentInput = ""; calcDisplay.value = "";
            } else if (button.id === "equals") {
                try {
                    currentInput = eval(currentInput).toString();
                    calcDisplay.value = currentInput;
                } catch {
                    calcDisplay.value = "Error"; currentInput = "";
                }
            } else {
                currentInput += value; calcDisplay.value = currentInput;
            }
        });
    });

    //valutakalkulator
    const amountInput = document.getElementById("amount");
    const fromCurrencySelect = document.getElementById("fromCurrency");
    const currencySelect = document.getElementById("currency");
    const resEl = document.getElementById("result");
    const convertCurrency = async () => {
        if (!amountInput || !fromCurrencySelect || !currencySelect || !resEl) return;
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = currencySelect.value;
        if (!amountInput.value || isNaN(amount) || amount <= 0) {
            resEl.innerText = "Skriv inn et gyldig beløp!";
            return;
        }
        if (fromCurrency === toCurrency) {
            resEl.innerText = `${amount} ${fromCurrency} = ${amount.toFixed(2)} ${toCurrency}`;
            return;
        }
        try {
            const res = await fetch(`https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toCurrency}`);
            const data = await res.json();
            const rate = data.rates[toCurrency];
            if (!rate) {
                resEl.innerText = "Kunne ikke hente valutakurs";
                return;
            }
            const converted = (amount * rate).toFixed(2);
            resEl.innerText = `${amount} ${fromCurrency} = ${converted} ${toCurrency}`;
        } catch (error) {
            console.error("❌ API-feil:", error);
            resEl.innerText = "Kunne ikke hente valutakurs";
        }
    };
    if (amountInput) amountInput.addEventListener("input", convertCurrency);
    if (fromCurrencySelect) fromCurrencySelect.addEventListener("change", convertCurrency);
    if (currencySelect) currencySelect.addEventListener("change", convertCurrency);

    //entur ruter
    const enturBtn = document.getElementById("enturSearchBtn");
    const enturFromInput = document.getElementById("enturFrom");
    const enturToInput = document.getElementById("enturTo");
    const enturDateInput = document.getElementById("enturDate");
    const enturTimeInput = document.getElementById("enturTime");
    const enturStatusEl = document.getElementById("enturStatus");
    const enturResultsEl = document.getElementById("enturResults");

    const setEnturDefaults = () => {
        if (!enturDateInput || !enturTimeInput) return;
        const now = new Date();
        if (!enturDateInput.value) enturDateInput.value = now.toISOString().slice(0, 10);
        if (!enturTimeInput.value) enturTimeInput.value = now.toTimeString().slice(0, 5);
    };

    const formatEnturTime = (iso) => {
        if (!iso) return "";
        const date = new Date(iso);
        return date.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
    };

    const formatEnturDuration = (seconds) => {
        if (typeof seconds !== "number") return "";
        const mins = Math.round(seconds / 60);
        const hours = Math.floor(mins / 60);
        const rest = mins % 60;
        return hours > 0 ? `${hours} t ${rest} min` : `${rest} min`;
    };

    const renderEnturResults = (trips = []) => {
        if (!enturResultsEl) return;
        enturResultsEl.innerHTML = "";

        if (!trips.length) {
            enturResultsEl.innerHTML = "<p>Ingen ruter funnet.</p>";
            return;
        }

        trips.forEach((trip) => {
            const card = document.createElement("div");
            card.className = "route-card";

            const meta = document.createElement("div");
            meta.className = "route-card__meta";
            meta.textContent = `Varighet: ${formatEnturDuration(trip.duration)} · ${formatEnturTime(trip.departure)}–${formatEnturTime(trip.arrival)}`;

            const legs = document.createElement("div");
            legs.className = "route-legs";

            (trip.legs || []).forEach((leg) => {
                const legEl = document.createElement("div");
                legEl.className = "route-leg";

                const mode = document.createElement("span");
                mode.className = "route-leg__mode";
                mode.textContent = leg.modeLabel || leg.mode || "Ukjent";

                const info = document.createElement("span");
                const line = leg.line ? ` (${leg.line})` : "";
                info.textContent = `${leg.from} → ${leg.to}${line}`;

                legEl.append(mode, info);
                legs.appendChild(legEl);
            });

            card.append(meta, legs);
            enturResultsEl.appendChild(card);
        });
    };

    const fetchEnturRoutes = async () => {
        if (!enturFromInput || !enturToInput || !enturDateInput || !enturTimeInput || !enturStatusEl) return;
        const from = enturFromInput.value.trim();
        const to = enturToInput.value.trim();
        const date = enturDateInput.value;
        const time = enturTimeInput.value;

        if (!from || !to) {
            enturStatusEl.textContent = "Skriv inn både Fra og Til.";
            renderEnturResults([]);
            return;
        }

        enturStatusEl.textContent = "Henter ruter…";
        renderEnturResults([]);

        try {
            const params = new URLSearchParams({ from, to, date, time });
            const res = await fetch(`/.netlify/functions/entur-routes?${params.toString()}`);
            const contentType = res.headers.get("content-type") || "";
            let data = null;
            if (contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                throw new Error(`Uventet svar: ${text.slice(0, 120)}`);
            }
            if (!res.ok) {
                throw new Error(data?.error || `HTTP ${res.status}`);
            }
            enturStatusEl.textContent = data?.message || "";
            renderEnturResults(data?.trips || []);
        } catch (err) {
            console.error("Entur-feil:", err);
            enturStatusEl.textContent = "Kunne ikke hente ruter.";
        }
    };

    if (enturBtn) enturBtn.addEventListener("click", fetchEnturRoutes);
    [enturFromInput, enturToInput, enturDateInput, enturTimeInput].forEach((input) => {
        if (!input) return;
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") fetchEnturRoutes();
        });
    });
    setEnturDefaults();


    //sitat fra lokal JSON-liste (random per dag)
    async function getDailyQuote() {
    const el = document.getElementById("quoteResult");

    try {
        const res = await fetch("data/quote.json", {
            headers: { "Accept": "application/json" },
        });

        if (!res.ok) throw new Error(`Quote-fil-feil: ${res.status}`);

        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        if (!list.length) {
            el.innerText = "Ingen sitat tilgjengelig.";
            return;
        }

        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const dayOfYear = Math.floor((now - start) / 86400000);
        const q = list[dayOfYear % list.length];

        const quote = q?.text || q?.quote || q?.content;
        const author = q?.author || "Ukjent";

        if (quote && author) {
        el.innerText = `"${quote}" - ${author}`;
        } else {
        el.innerText = "Ingen sitat tilgjengelig.";
        }
    } catch (err) {
        console.error(err);
        el.innerText = "Klarte ikke hente sitat";
    }
    }

    getDailyQuote();

    //nrk nyheter (rss)
    const nrkStatusEl = document.getElementById("nrkNewsStatus");
    const nrkListEl = document.getElementById("nrkNewsList");

    const stripHtml = (value) => {
        if (!value) return "";
        return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    };

    const formatNrkTime = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) return "";
        return date.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
    };

    const renderNrkNews = (items) => {
        if (!nrkListEl) return;
        nrkListEl.innerHTML = "";

        items.forEach((item) => {
            const link = item.link || "https://www.nrk.no/nyheter/";
            const card = document.createElement("a");
            card.className = "nrk-news-item";
            card.href = link;
            card.target = "_blank";
            card.rel = "noopener";

            const time = document.createElement("div");
            time.className = "nrk-news-time";
            time.textContent = item.time || "";

            const category = document.createElement("div");
            category.className = "nrk-news-category";
            category.textContent = item.category || "NRK Nyheter";

            const title = document.createElement("div");
            title.className = "nrk-news-title";
            title.textContent = item.title || "";

            card.append(time, category, title);
            nrkListEl.appendChild(card);
        });
    };

    const NRK_CACHE_KEY = "nrkNewsCache";
    const NRK_CACHE_TTL = 1000 * 60 * 15; //15 min

    const formatNrkUpdatedAt = (timestamp) => {
        if (!Number.isFinite(timestamp)) return "";
        const date = new Date(timestamp);
        if (Number.isNaN(date.getTime())) return "";

        const now = new Date();
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diffDays = Math.round((dateOnly - nowOnly) / 86400000);
        const timePart = date.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });

        if (diffDays === 0) return `Sist oppdatert i dag kl. ${timePart}`;
        if (diffDays === -1) return `Sist oppdatert i går kl. ${timePart}`;
        const datePart = date.toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric" });
        return `Sist oppdatert ${datePart} kl. ${timePart}`;
    };

    const loadNrkCache = () => {
        try {
            const raw = localStorage.getItem(NRK_CACHE_KEY);
            if (!raw) return null;
            const cached = JSON.parse(raw);
            if (!cached || !Array.isArray(cached.items)) return null;
            return cached;
        } catch {
            return null;
        }
    };

    const saveNrkCache = (items) => {
        try {
            localStorage.setItem(
                NRK_CACHE_KEY,
                JSON.stringify({ timestamp: Date.now(), items })
            );
        } catch {
            //ignore quota/storage errors
        }
    };

    const fetchWithTimeout = async (url, timeoutMs = 6500) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const res = await fetch(url, { cache: "no-store", signal: controller.signal });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.text();
        } finally {
            clearTimeout(timeoutId);
        }
    };

    const fetchTextWithFallback = async (urls) => {
        const attempts = urls.map((url) => fetchWithTimeout(url));
        try {
            return await Promise.any(attempts);
        } catch (err) {
            let lastError = err;
            for (const url of urls) {
                try {
                    return await fetchWithTimeout(url, 9000);
                } catch (innerErr) {
                    lastError = innerErr;
                }
            }
            throw lastError || new Error("Ukjent feil");
        }
    };

    const fetchNrkNews = async () => {
        if (!nrkStatusEl || !nrkListEl) return;
        const cached = loadNrkCache();
        const isFresh = cached && Date.now() - cached.timestamp < NRK_CACHE_TTL;

        if (cached?.items?.length) {
            renderNrkNews(cached.items);
            const updatedText = formatNrkUpdatedAt(cached.timestamp);
            nrkStatusEl.textContent = isFresh
                ? `Oppdaterer NRK Nyheter... ${updatedText}`.trim()
                : `Oppdaterer (lagret versjon kan være eldre)... ${updatedText}`.trim();
        } else {
            nrkStatusEl.textContent = "Laster NRK Nyheter...";
        }

        const feedUrl = "https://www.nrk.no/nyheter/siste.rss";
        const proxyUrls = [
            `https://r.jina.ai/http://www.nrk.no/nyheter/siste.rss`,
        ];

        try {
            const xmlText = await fetchTextWithFallback(proxyUrls);
            const doc = new DOMParser().parseFromString(xmlText, "text/xml");
            const items = Array.from(doc.querySelectorAll("item"));

            const parsed = items.slice(0, 4).map((item) => {
                const title = stripHtml(item.querySelector("title")?.textContent || "");
                const pubDate = item.querySelector("pubDate")?.textContent || "";
                const category = stripHtml(item.querySelector("category")?.textContent || "");
                const link = item.querySelector("link")?.textContent || "";

                return {
                    title,
                    time: formatNrkTime(pubDate),
                    category,
                    link,
                };
            });

            if (!parsed.length) {
                nrkStatusEl.textContent = "Fant ingen nyheter.";
                return;
            }

            const updatedAt = Date.now();
            renderNrkNews(parsed);
            saveNrkCache(parsed);
            nrkStatusEl.textContent = formatNrkUpdatedAt(updatedAt);
        } catch (err) {
            console.error("NRK RSS-feil:", err);
            if (cached?.items?.length) {
                renderNrkNews(cached.items);
                const updatedText = formatNrkUpdatedAt(cached.timestamp);
                nrkStatusEl.textContent = `Viser lagrede nyheter. Kunne ikke oppdatere nå. ${updatedText}`.trim();
            } else {
                nrkStatusEl.textContent = "Kunne ikke hente NRK Nyheter.";
            }
        }
    };

    fetchNrkNews();

    //temperatur siste 30 dager (open-meteo)
    function drawTemperatureLineChart(canvas, labels, points, options = {}) {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rootStyles = getComputedStyle(document.documentElement);
        const accent = rootStyles.getPropertyValue("--color").trim() || "189, 150, 255";
        const humidityAccent = rootStyles.getPropertyValue("--color-humidity").trim() || "88, 196, 255";
        const uvAccent = rootStyles.getPropertyValue("--color-uv").trim() || "246, 198, 82";
        const aqiAccent = rootStyles.getPropertyValue("--color-aqi").trim() || "255, 110, 130";
        const successAccent = rootStyles.getPropertyValue("--color-success").trim() || "88, 214, 141";
        const bgElevated = rootStyles.getPropertyValue("--color-bg-elevated").trim() || "8, 14, 24";
        const textBase = rootStyles.getPropertyValue("--color-text-base").trim() || "243, 243, 246";

        const parseRgbTriplet = (value, fallback) => {
            const parts = String(value || "")
                .split(",")
                .map((part) => Number.parseFloat(part.trim()));
            if (parts.length === 3 && parts.every((part) => Number.isFinite(part))) {
                return parts.map((part) => Math.max(0, Math.min(255, Math.round(part))));
            }
            return fallback;
        };
        const blendRgb = (from, to, t) => from.map((channel, idx) => Math.round(channel + (to[idx] - channel) * t));
        const smoothStep = (edge0, edge1, x) => {
            if (edge0 === edge1) return x < edge0 ? 0 : 1;
            const normalized = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
            return normalized * normalized * (3 - 2 * normalized);
        };
        const rgbToCss = (rgb, alpha = 1) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;

        const uvGreen = parseRgbTriplet(successAccent, [48, 214, 111]);
        const uvYellow = parseRgbTriplet(uvAccent, [255, 220, 60]);
        const uvRed = parseRgbTriplet(aqiAccent, [255, 40, 40]);
        const uvPurple = parseRgbTriplet(accent, [255, 100, 255]);
        const uvOrange = blendRgb(uvYellow, uvRed, 0.45);

        const uvBoundaryLow = 2.45;
        const uvBoundaryMid = 5.5;
        const uvBoundaryHigh = 7.5;
        const uvBoundaryExtreme = 10.5;
        const uvTransition = 0.35;

        const getUvRgb = (uvValue) => {
            if (!Number.isFinite(uvValue)) return uvYellow;

            if (uvValue <= uvBoundaryLow - uvTransition) return uvGreen;
            if (uvValue < uvBoundaryLow + uvTransition) {
                const t = smoothStep(uvBoundaryLow - uvTransition, uvBoundaryLow + uvTransition, uvValue);
                return blendRgb(uvGreen, uvYellow, t);
            }

            if (uvValue <= uvBoundaryMid - uvTransition) return uvYellow;
            if (uvValue < uvBoundaryMid + uvTransition) {
                const t = smoothStep(uvBoundaryMid - uvTransition, uvBoundaryMid + uvTransition, uvValue);
                return blendRgb(uvYellow, uvOrange, t);
            }

            if (uvValue <= uvBoundaryHigh - uvTransition) return uvOrange;
            if (uvValue < uvBoundaryHigh + uvTransition) {
                const t = smoothStep(uvBoundaryHigh - uvTransition, uvBoundaryHigh + uvTransition, uvValue);
                return blendRgb(uvOrange, uvRed, t);
            }

            if (uvValue <= uvBoundaryExtreme - uvTransition) return uvRed;
            if (uvValue < uvBoundaryExtreme + uvTransition) {
                const t = smoothStep(uvBoundaryExtreme - uvTransition, uvBoundaryExtreme + uvTransition, uvValue);
                return blendRgb(uvRed, uvPurple, t);
            }

            return uvPurple;
        };

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(240, rect.width);
        const height = Math.max(140, rect.height);
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        const safePoints = Array.isArray(points) ? points : [];
        const safeHumidityPoints = Array.isArray(options.humidityPoints) ? options.humidityPoints : null;
        const safeUvPoints = Array.isArray(options.uvPoints) ? options.uvPoints : null;
        const safeAqiPoints = Array.isArray(options.aqiPoints) ? options.aqiPoints : null;
        const humidityActive = options.humidityActive === true;
        const uvActive = options.uvActive === true;
        const aqiActive = options.aqiActive === true;
        const gradientAllowed = options.gradientAllowed !== false;
        const animateGradient = options.animateGradient === true;
        const animateTemp = options.animateTemp !== false;
        const animateHumidity = options.animateHumidity !== false;
        const animateUv = options.animateUv !== false;
        const animateAqi = options.animateAqi !== false;
        const animateOutTemp = options.animateOutTemp === true;
        const animateOutHumidity = options.animateOutHumidity === true;
        const animateOutUv = options.animateOutUv === true;
        const animateOutAqi = options.animateOutAqi === true;
        const onComplete = typeof options.onComplete === "function" ? options.onComplete : null;
        const safeLabels = Array.isArray(labels) ? labels : [];
        const tempFormatter = new Intl.NumberFormat("no-NO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
        });
        const primaryLabel = options.primaryLabel || "Temperatur";
        const primarySuffix = typeof options.primarySuffix === "string" ? options.primarySuffix : "°C";
        const primaryFormatter = options.primaryFormatter || tempFormatter;
        const humidityFormatter = new Intl.NumberFormat("no-NO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        const uvFormatter = new Intl.NumberFormat("no-NO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
        });
        const aqiFormatter = new Intl.NumberFormat("no-NO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });

        const computeScale = (values, pad = 4) => {
            const finite = Array.isArray(values) ? values.filter((v) => Number.isFinite(v)) : [];
            const maxVal = (finite.length ? Math.max(...finite) : 0) + pad;
            const minVal = (finite.length ? Math.min(...finite) : 0) - pad;
            return { minVal, maxVal };
        };

        const normalizeSeries = (values) => {
            if (!Array.isArray(values)) return [];
            const normalized = values.slice();
            let last = null;
            for (let i = 0; i < normalized.length; i++) {
                if (Number.isFinite(normalized[i])) {
                    last = normalized[i];
                } else if (Number.isFinite(last)) {
                    normalized[i] = last;
                }
            }
            for (let i = normalized.length - 1; i >= 0; i--) {
                if (Number.isFinite(normalized[i])) break;
                for (let j = i - 1; j >= 0; j--) {
                    if (Number.isFinite(normalized[j])) {
                        normalized[i] = normalized[j];
                        break;
                    }
                }
            }
            return normalized;
        };

        const splitFiniteSegments = (pointsArray) => {
            if (!Array.isArray(pointsArray) || !pointsArray.length) return [];
            const segments = [];
            let current = [];

            pointsArray.forEach((point) => {
                const isFinitePoint = point
                    && Number.isFinite(point.x)
                    && Number.isFinite(point.y);

                if (isFinitePoint) {
                    current.push(point);
                    return;
                }

                if (current.length >= 2) segments.push(current);
                current = [];
            });

            if (current.length >= 2) segments.push(current);
            return segments;
        };

        const tempScale = computeScale(safePoints, 4);
        const humidityScale = safeHumidityPoints ? computeScale(safeHumidityPoints, 5) : null;
        const uvScale = safeUvPoints ? computeScale(safeUvPoints, 1) : null;
        const aqiScale = safeAqiPoints ? computeScale(safeAqiPoints, 8) : null;
        const padX = 10;
        const padY = 12;
        const usableW = width - padX * 2;
        const usableH = height - padY * 2;

        const denom = Math.max(1, safeLabels.length - 1);
        const toCoords = (values, scale) =>
            values.map((v, i) => {
                if (!Number.isFinite(v)) return null;
                const x = padX + (usableW * i) / denom;
                const t = (v - scale.minVal) / (scale.maxVal - scale.minVal);
                const y = height - padY - t * usableH;
                return { x, y };
            });

        const coords = toCoords(safePoints, tempScale);
        const humidityCoords = safeHumidityPoints && humidityScale ? toCoords(normalizeSeries(safeHumidityPoints), humidityScale) : null;
        const uvCoords = safeUvPoints && uvScale ? toCoords(safeUvPoints, uvScale) : null;
        const aqiCoords = safeAqiPoints && aqiScale ? toCoords(safeAqiPoints, aqiScale) : null;

        const buildUvStroke = () => {
            if (!Array.isArray(uvCoords) || !uvCoords.length || !usableW) {
                return `rgb(${uvAccent})`;
            }

            const stops = uvCoords
                .map((point, index) => {
                    const value = safeUvPoints[index];
                    if (!point || !Number.isFinite(point.x) || !Number.isFinite(value)) return null;
                    const offset = Math.max(0, Math.min(1, (point.x - padX) / usableW));
                    return { offset, color: getUvRgb(value) };
                })
                .filter(Boolean);

            if (!stops.length) return `rgb(${uvAccent})`;

            if (stops.length === 1) {
                const singleColor = rgbToCss(stops[0].color, 1);
                const singleGradient = ctx.createLinearGradient(padX, 0, width - padX, 0);
                singleGradient.addColorStop(0, singleColor);
                singleGradient.addColorStop(1, singleColor);
                return singleGradient;
            }

            const gradient = ctx.createLinearGradient(padX, 0, width - padX, 0);
            const firstColor = rgbToCss(stops[0].color, 1);
            const lastColor = rgbToCss(stops[stops.length - 1].color, 1);

            if (stops[0].offset > 0) gradient.addColorStop(0, firstColor);
            stops.forEach((stop) => {
                gradient.addColorStop(stop.offset, rgbToCss(stop.color, 1));
            });
            if (stops[stops.length - 1].offset < 1) gradient.addColorStop(1, lastColor);

            return gradient;
        };

        const hasFinite = (values) => Array.isArray(values) && values.some((v) => Number.isFinite(v));
        const hasLineSegments = (coordsArray) => splitFiniteSegments(coordsArray).length > 0;
        const hasTemp = hasFinite(safePoints) && Array.isArray(coords) && hasLineSegments(coords);
        const hasHumidity = hasFinite(safeHumidityPoints) && Array.isArray(humidityCoords) && hasLineSegments(humidityCoords);
        const hasUv = hasFinite(safeUvPoints) && Array.isArray(uvCoords) && hasLineSegments(uvCoords);
        const hasAqi = hasFinite(safeAqiPoints) && Array.isArray(aqiCoords) && hasLineSegments(aqiCoords);
        const baseCoords = hasTemp
            ? coords
            : hasHumidity
                ? humidityCoords
                : hasUv
                    ? uvCoords
                    : hasAqi
                        ? aqiCoords
                        : null;

        function drawBase() {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            //background
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = `rgba(${bgElevated}, 0.55)`;
            ctx.fillRect(0, 0, width, height);

            //grid
            ctx.strokeStyle = `rgba(${textBase}, 0.06)`;
            ctx.lineWidth = 1;
            const gridRows = 4;
            const gridCols = 6;
            for (let r = 1; r < gridRows; r++) {
                const y = (height / gridRows) * r;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
            for (let c = 1; c < gridCols; c++) {
                const x = (width / gridCols) * c;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
        }

        let hoverIndex = -1;
        let hoverPos = null;
        let interactiveReady = false;
        const hitRadius = 10;

        function drawSmoothPath(pointsArray) {
            if (!pointsArray || pointsArray.length < 2) return;
            const segments = splitFiniteSegments(pointsArray);
            if (!segments.length) return;
            const tension = 0.5;
            segments.forEach((segment) => {
                ctx.beginPath();
                ctx.moveTo(segment[0].x, segment[0].y);
                for (let i = 0; i < segment.length - 1; i++) {
                    const p0 = segment[i - 1] || segment[i];
                    const p1 = segment[i];
                    const p2 = segment[i + 1];
                    const p3 = segment[i + 2] || p2;

                    const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
                    const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;
                    const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
                    const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;

                    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
                }
                ctx.stroke();
            });
        }

        function drawTooltip(pos, label, value, humidityValue, uvValue, aqiValue) {
            if (!pos) return;
            const paddingX = 10;
            const paddingY = 8;
            const lineHeight = 16;
            const lines = [label];
            if (Number.isFinite(value)) {
                const formatted = primaryFormatter.format(value);
                const suffix = primarySuffix ? `${primarySuffix}` : "";
                lines.push(`${primaryLabel}: ${formatted}${suffix}`);
            }
            if (Number.isFinite(humidityValue)) {
                lines.push(`Fuktighet: ${humidityFormatter.format(humidityValue)}%`);
            }
            if (Number.isFinite(uvValue)) {
                lines.push(`UV-indeks: ${uvFormatter.format(uvValue)}`);
            }
            if (Number.isFinite(aqiValue)) {
                lines.push(`Luftkvalitet (AQI): ${aqiFormatter.format(aqiValue)}`);
            }

            ctx.font = "12px system-ui, -apple-system, Segoe UI, sans-serif";
            const widths = lines.map((line) => ctx.measureText(line).width);
            const boxW = Math.max(...widths) + paddingX * 2;
            const boxH = paddingY * 2 + lineHeight * lines.length;

            let x = pos.x + 12;
            let y = pos.y - boxH - 12;
            if (x + boxW > width) x = width - boxW - 6;
            if (y < 6) y = pos.y + 12;

            const radius = 8;
            ctx.fillStyle = `rgba(${bgElevated}, 0.92)`;
            ctx.strokeStyle = `rgba(${textBase}, 0.12)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + boxW - radius, y);
            ctx.quadraticCurveTo(x + boxW, y, x + boxW, y + radius);
            ctx.lineTo(x + boxW, y + boxH - radius);
            ctx.quadraticCurveTo(x + boxW, y + boxH, x + boxW - radius, y + boxH);
            ctx.lineTo(x + radius, y + boxH);
            ctx.quadraticCurveTo(x, y + boxH, x, y + boxH - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = `rgba(${textBase}, 0.92)`;
            lines.forEach((line, idx) => {
                ctx.fillText(line, x + paddingX, y + paddingY + lineHeight * (idx + 1) - 3);
            });
        }

        function render(progress) {
            drawBase();

            if (!baseCoords || baseCoords.length < 2) {
                return;
            }

            const tempProgress = animateOutTemp ? 1 - progress : animateTemp ? progress : 1;
            const humidityProgress = animateOutHumidity ? 1 - progress : animateHumidity ? progress : 1;
            const uvProgress = animateOutUv ? 1 - progress : animateUv ? progress : 1;
            const aqiProgress = animateOutAqi ? 1 - progress : animateAqi ? progress : 1;
            const gradientOpacity = gradientAllowed
                ? animateGradient
                    ? progress
                    : 1
                : animateGradient
                    ? 1 - progress
                    : 0;

            const totalSegments = baseCoords.length - 1;
            const progressSegments = totalSegments * progress;
            const lastIndex = Math.floor(progressSegments);
            const t = progressSegments - lastIndex;

            //gradient fill under line
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, width * tempProgress, height);
            ctx.clip();
            if (hasTemp && gradientOpacity > 0) {
                ctx.beginPath();
                drawSmoothPath(coords);
                ctx.lineTo(coords[coords.length - 1].x, height - padY);
                ctx.lineTo(coords[0].x, height - padY);
                ctx.closePath();
                const fillGradient = ctx.createLinearGradient(0, padY, 0, height - padY);
                fillGradient.addColorStop(0, `rgba(${accent}, ${1 * gradientOpacity})`);
                fillGradient.addColorStop(1, `rgba(${accent}, 0.0)`);
                ctx.fillStyle = fillGradient;
                ctx.fill();
            }
            ctx.restore();

            //smooth line
            if (hasTemp) {
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, 0, width * tempProgress, height);
                ctx.clip();
                ctx.strokeStyle = `rgb(${accent})`;
                ctx.lineWidth = 2.5;
                drawSmoothPath(coords);
                ctx.restore();
            }

            if (hasHumidity) {
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, 0, width * humidityProgress, height);
                ctx.clip();
                if (gradientOpacity > 0) {
                    ctx.beginPath();
                    drawSmoothPath(humidityCoords);
                    ctx.lineTo(humidityCoords[humidityCoords.length - 1].x, height - padY);
                    ctx.lineTo(humidityCoords[0].x, height - padY);
                    ctx.closePath();
                    const humidityFill = ctx.createLinearGradient(0, padY, 0, height - padY);
                    humidityFill.addColorStop(0, `rgba(${humidityAccent}, ${0.22 * gradientOpacity})`);
                    humidityFill.addColorStop(1, `rgba(${humidityAccent}, 0.0)`);
                    ctx.fillStyle = humidityFill;
                    ctx.fill();
                }
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.rect(0, 0, width * humidityProgress, height);
                ctx.clip();
                ctx.strokeStyle = `rgb(${humidityAccent})`;
                ctx.lineWidth = 2;
                drawSmoothPath(humidityCoords);
                ctx.restore();
            }

            if (hasUv) {
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, 0, width * uvProgress, height);
                ctx.clip();
                ctx.strokeStyle = buildUvStroke();
                ctx.lineWidth = 2;
                drawSmoothPath(uvCoords);
                ctx.restore();
            }

            if (hasAqi) {
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, 0, width * aqiProgress, height);
                ctx.clip();
                ctx.strokeStyle = `rgb(${aqiAccent})`;
                ctx.setLineDash([6, 6]);
                ctx.lineWidth = 2;
                drawSmoothPath(aqiCoords);
                ctx.setLineDash([]);
                ctx.restore();
            }

            //hover point + tooltip
            if (hoverIndex >= 0 && interactiveReady && baseCoords) {
                const p = baseCoords[hoverIndex];
                if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y)) return;
                ctx.save();
                ctx.strokeStyle = `rgba(${textBase}, 0.22)`;
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 6]);
                ctx.beginPath();
                ctx.moveTo(p.x, padY);
                ctx.lineTo(p.x, height - padY);
                ctx.stroke();
                ctx.restore();

                if (hasTemp) {
                    const tp = coords[hoverIndex];
                    if (tp && Number.isFinite(tp.x) && Number.isFinite(tp.y)) {
                        ctx.fillStyle = `rgba(${accent}, 0.95)`;
                        ctx.beginPath();
                        ctx.arc(tp.x, tp.y, 4, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.strokeStyle = `rgba(${textBase}, 0.25)`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.arc(tp.x, tp.y, 7, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }

                if (hasHumidity) {
                    const hp = humidityCoords[hoverIndex];
                    if (hp && Number.isFinite(hp.x) && Number.isFinite(hp.y)) {
                        ctx.fillStyle = `rgba(${humidityAccent}, 0.95)`;
                        ctx.beginPath();
                        ctx.arc(hp.x, hp.y, 3.5, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.strokeStyle = `rgba(${textBase}, 0.25)`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.arc(hp.x, hp.y, 6.5, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }

                if (hasUv) {
                    const up = uvCoords[hoverIndex];
                    if (up && Number.isFinite(up.x) && Number.isFinite(up.y)) {
                        const uvColor = getUvRgb(safeUvPoints[hoverIndex]);
                        ctx.fillStyle = rgbToCss(uvColor, 1);
                        ctx.beginPath();
                        ctx.arc(up.x, up.y, 3.5, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.strokeStyle = `rgba(${textBase}, 0.25)`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.arc(up.x, up.y, 6.5, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }

                if (hasAqi) {
                    const ap = aqiCoords[hoverIndex];
                    if (ap && Number.isFinite(ap.x) && Number.isFinite(ap.y)) {
                        ctx.fillStyle = `rgba(${aqiAccent}, 0.95)`;
                        ctx.beginPath();
                        ctx.arc(ap.x, ap.y, 3.5, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.strokeStyle = `rgba(${textBase}, 0.25)`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.arc(ap.x, ap.y, 6.5, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }

                const tempValue = hasTemp ? safePoints[hoverIndex] : null;
                const humidityValue = hasHumidity ? safeHumidityPoints[hoverIndex] : null;
                const uvValue = hasUv ? safeUvPoints[hoverIndex] : null;
                const aqiValue = hasAqi ? safeAqiPoints[hoverIndex] : null;
                drawTooltip(hoverPos, safeLabels[hoverIndex], tempValue, humidityValue, uvValue, aqiValue);
            }
        }

        const duration = 900;
        const start = performance.now();
        function animate(now) {
            const progress = Math.min(1, (now - start) / duration);
            render(progress);
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                interactiveReady = true;
                if (onComplete) onComplete();
            }
        }
        requestAnimationFrame(animate);

        function getMousePos(evt) {
            const box = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - box.left,
                y: evt.clientY - box.top,
            };
        }

        function findNearestPoint(pos) {
            let nearest = -1;
            let minDist = Infinity;
            const targets = baseCoords || [];
            for (let i = 0; i < targets.length; i++) {
                const point = targets[i];
                if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) continue;
                const dx = Math.abs(pos.x - point.x);
                if (dx < minDist) {
                    minDist = dx;
                    nearest = i;
                }
            }
            return nearest;
        }

        canvas.addEventListener("mousemove", (evt) => {
            if (!interactiveReady) return;
            const pos = getMousePos(evt);
            const idx = findNearestPoint(pos);
            hoverIndex = idx;
            hoverPos = idx >= 0 ? pos : null;
            render(1);
        });

        canvas.addEventListener("mouseleave", () => {
            if (!interactiveReady) return;
            hoverIndex = -1;
            hoverPos = null;
            render(1);
        });
    }

    function replaceAndDrawTrendChart(labels, points, options = {}) {
        const current = document.getElementById("trendChart");
        if (!current || !current.parentNode) return;
        const fresh = current.cloneNode(true);
        current.parentNode.replaceChild(fresh, current);
        drawTemperatureLineChart(fresh, labels, points, options);
    }

    const dayFormatter = new Intl.DateTimeFormat("no-NO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    function formatDateYmd(d) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function getLastDaysRange(days = 30) {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - (days - 1));
        return { start, end };
    }

    function getRangeForKey(rangeKey) {
        const today = new Date();
        if (rangeKey === "1y") {
            return getLastDaysRange(365);
        }
        if (rangeKey === "ytd") {
            return { start: new Date(today.getFullYear(), 0, 1), end: today };
        }
        if (rangeKey === "5y") {
            return getLastDaysRange(365 * 5);
        }
        return getLastDaysRange(30);
    }

    const toIsoStartOfDay = (date) => {
        const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
        return utc.toISOString();
    };

    const toIsoEndOfDay = (date) => {
        const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59));
        return utc.toISOString();
    };

    async function fetchTemperaturesForRange(lat, lon, rangeKey) {
        const { start, end } = getRangeForKey(rangeKey);
        const startDate = formatDateYmd(start);
        const endDate = formatDateYmd(end);

        const url =
            "https://archive-api.open-meteo.com/v1/archive" +
            `?latitude=${encodeURIComponent(lat)}` +
            `&longitude=${encodeURIComponent(lon)}` +
            `&start_date=${startDate}` +
            `&end_date=${endDate}` +
            `&daily=temperature_2m_mean,relative_humidity_2m_mean` +
            `&timezone=Europe%2FOslo`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Vær-API feil: ${res.status} ${res.statusText}`);
        const data = await res.json();

        const days = data?.daily?.time || [];
        const temps = data?.daily?.temperature_2m_mean || [];
        const humidity = data?.daily?.relative_humidity_2m_mean || [];

        const labels = days.map((d) => dayFormatter.format(new Date(d)));
        const values = temps.map((t) => (Number.isFinite(t) ? t : null));
        const humidityValues = humidity.map((h) => (Number.isFinite(h) ? h : null));

        return { labels, values, humidity: humidityValues, days };
    }

    const mapDailySeries = (days = [], seriesDays = [], seriesValues = []) => {
        const valueMap = new Map();
        seriesDays.forEach((d, idx) => {
            const v = seriesValues[idx];
            valueMap.set(d, Number.isFinite(v) ? v : null);
        });
        return days.map((d) => (valueMap.has(d) ? valueMap.get(d) : null));
    };

    const hasFiniteSeries = (values) => Array.isArray(values) && values.some((v) => Number.isFinite(v));
    const hasNonZeroSeries = (values, epsilon = 1e-9) =>
        Array.isArray(values) && values.some((v) => Number.isFinite(v) && Math.abs(v) > epsilon);

    const OM_UV_CACHE_PREFIX = "omUvDailyCacheV1";
    const OM_UV_CACHE_MAX_DAYS = 365 * 6;
    const OM_UV_SHARED_URL = "data/uv-history.json";
    let sharedUvHistoryPromise = null;
    let sharedUvUpdatedAt = null;
    let sharedUvSource = null;

    const toUvLocationKey = (lat, lon) => {
        const safeLat = Number(lat);
        const safeLon = Number(lon);
        return `${safeLat.toFixed(4)},${safeLon.toFixed(4)}`;
    };

    const getUvCacheKey = (lat, lon) => {
        return `${OM_UV_CACHE_PREFIX}:${toUvLocationKey(lat, lon)}`;
    };

    const loadSharedUvHistory = async () => {
        if (!sharedUvHistoryPromise) {
            sharedUvHistoryPromise = fetch(OM_UV_SHARED_URL, { cache: "no-cache" })
                .then((res) => {
                    if (!res.ok) return null;
                    return res.json();
                })
                .catch(() => null);
        }
        return sharedUvHistoryPromise;
    };

    const getSharedUvMapForLocation = async (lat, lon) => {
        const shared = await loadSharedUvHistory();
        sharedUvUpdatedAt = shared?.updatedAt || null;
        sharedUvSource = shared?.source || null;
        const values = shared?.locations?.[toUvLocationKey(lat, lon)] || null;
        if (!values || typeof values !== "object") {
            return { map: new Map(), updatedAt: sharedUvUpdatedAt };
        }

        const map = new Map();
        Object.entries(values).forEach(([day, value]) => {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return;
            if (!Number.isFinite(value)) return;
            map.set(day, value);
        });
        return { map, updatedAt: sharedUvUpdatedAt };
    };

    const loadUvCacheMap = (lat, lon) => {
        try {
            const raw = localStorage.getItem(getUvCacheKey(lat, lon));
            if (!raw) return new Map();
            const parsed = JSON.parse(raw);
            const values = parsed?.values;
            if (!values || typeof values !== "object") return new Map();

            const map = new Map();
            Object.entries(values).forEach(([day, value]) => {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return;
                if (!Number.isFinite(value)) return;
                map.set(day, value);
            });
            return map;
        } catch {
            return new Map();
        }
    };

    const saveUvCacheMap = (lat, lon, uvMap) => {
        if (!(uvMap instanceof Map) || !uvMap.size) return;
        try {
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - OM_UV_CACHE_MAX_DAYS);
            const cutoffKey = formatDateYmd(cutoff);
            const pruned = {};

            uvMap.forEach((value, day) => {
                if (day < cutoffKey) return;
                if (!Number.isFinite(value)) return;
                pruned[day] = value;
            });

            localStorage.setItem(
                getUvCacheKey(lat, lon),
                JSON.stringify({
                    updatedAt: Date.now(),
                    values: pruned,
                })
            );
        } catch {
            // ignore quota/storage errors
        }
    };

    const mergeDailySeriesIntoCache = (uvMap, seriesDays = [], seriesValues = []) => {
        if (!(uvMap instanceof Map)) return;
        seriesDays.forEach((day, idx) => {
            const value = seriesValues[idx];
            if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return;
            if (!Number.isFinite(value)) return;
            uvMap.set(day, value);
        });
    };

    async function fetchUvIndexForRange(lat, lon, rangeKey, days = []) {
        const { start, end } = getRangeForKey(rangeKey);
        const startDate = formatDateYmd(start);
        const endDate = formatDateYmd(end);
        const uvCache = loadUvCacheMap(lat, lon);
        const sharedUv = await getSharedUvMapForLocation(lat, lon);
        sharedUv.map.forEach((value, day) => uvCache.set(day, value));

        const archiveUrl =
            "https://archive-api.open-meteo.com/v1/archive" +
            `?latitude=${encodeURIComponent(lat)}` +
            `&longitude=${encodeURIComponent(lon)}` +
            `&start_date=${startDate}` +
            `&end_date=${endDate}` +
            `&daily=uv_index_max` +
            `&timezone=Europe%2FOslo`;

        let archiveMapped = null;
        try {
            const archiveRes = await fetch(archiveUrl);
            if (!archiveRes.ok) throw new Error(`UV-API feil: ${archiveRes.status} ${archiveRes.statusText}`);
            const archiveData = await archiveRes.json();
            const uvDays = archiveData?.daily?.time || [];
            const uvValues = archiveData?.daily?.uv_index_max || [];
            mergeDailySeriesIntoCache(uvCache, uvDays, uvValues);
            archiveMapped = mapDailySeries(days, uvDays, uvValues);
        } catch {
            archiveMapped = null;
        }

        const recentDays = Math.min(Math.max(days.length, 1), 30);
        const forecastUrl =
            "https://api.open-meteo.com/v1/forecast" +
            `?latitude=${encodeURIComponent(lat)}` +
            `&longitude=${encodeURIComponent(lon)}` +
            `&daily=uv_index_max` +
            `&past_days=${recentDays}` +
            `&forecast_days=1` +
            `&timezone=Europe%2FOslo`;

        let forecastMapped = null;
        let forecastError = null;

        try {
            const forecastRes = await fetch(forecastUrl);
            if (!forecastRes.ok) throw new Error(`UV-forecast feil: ${forecastRes.status} ${forecastRes.statusText}`);
            const forecastData = await forecastRes.json();
            const fDays = forecastData?.daily?.time || [];
            const fValues = forecastData?.daily?.uv_index_max || [];
            mergeDailySeriesIntoCache(uvCache, fDays, fValues);
            forecastMapped = mapDailySeries(days, fDays, fValues);
        } catch (err) {
            forecastError = err;
        }

        saveUvCacheMap(lat, lon, uvCache);
        const cachedMapped = days.map((day) => (uvCache.has(day) ? uvCache.get(day) : null));
        if (hasFiniteSeries(cachedMapped)) return cachedMapped;
        if (hasFiniteSeries(forecastMapped)) return forecastMapped;
        if (hasFiniteSeries(archiveMapped)) return archiveMapped;
        if (forecastError) throw forecastError;
        return days.map(() => null);
    }

    async function fetchAqiForRange(lat, lon, rangeKey, days = []) {
        const { start, end } = getRangeForKey(rangeKey);
        const startDate = formatDateYmd(start);
        const endDate = formatDateYmd(end);

        const url =
            "https://air-quality-api.open-meteo.com/v1/air-quality" +
            `?latitude=${encodeURIComponent(lat)}` +
            `&longitude=${encodeURIComponent(lon)}` +
            `&start_date=${startDate}` +
            `&end_date=${endDate}` +
            `&hourly=european_aqi` +
            `&timezone=Europe%2FOslo`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`AQI-API feil: ${res.status} ${res.statusText}`);
        const data = await res.json();

        const times = data?.hourly?.time || [];
        const values = data?.hourly?.european_aqi || [];
        const dayBuckets = new Map();

        times.forEach((time, idx) => {
            const dayKey = typeof time === "string" ? time.slice(0, 10) : null;
            const v = values[idx];
            if (!dayKey || !Number.isFinite(v)) return;
            if (!dayBuckets.has(dayKey)) {
                dayBuckets.set(dayKey, { sum: 0, count: 0 });
            }
            const bucket = dayBuckets.get(dayKey);
            bucket.sum += v;
            bucket.count += 1;
        });

        return days.map((d) => {
            const bucket = dayBuckets.get(d);
            if (!bucket || !bucket.count) return null;
            return bucket.sum / bucket.count;
        });
    }

    const omStatusEl = document.getElementById("omStatus");
    const omUvUpdatedAtEl = document.getElementById("omUvUpdatedAt");
    const omUvSourceInfoEl = document.getElementById("omUvSourceInfo");
    const omRangeSelector = document.getElementById("omRangeSelector");
    const omRangeButtons = omRangeSelector
        ? Array.from(omRangeSelector.querySelectorAll("[data-range]"))
        : [];
    const omRangeIndicator = omRangeSelector
        ? omRangeSelector.querySelector(".range-selector__indicator")
        : null;
    const trendChartTile = document.getElementById("trendChartTile");

    const setOmStatus = (msg) => {
        if (omStatusEl) omStatusEl.textContent = msg;
    };

    const formatSharedUvUpdatedAt = (isoStr) => {
        if (!isoStr) return "";
        const date = new Date(isoStr);
        if (Number.isNaN(date.getTime())) return "";
        const datePart = date.toLocaleDateString("nb-NO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        const timePart = date.toLocaleTimeString("nb-NO", {
            hour: "2-digit",
            minute: "2-digit",
        });
        return `Delt UV-data sist oppdatert: ${datePart} kl. ${timePart}`;
    };

    const formatSharedUvSource = (source) => {
        if (!source) return "Hentet fra Open-Meteo";
        if (source.includes("open-meteo")) {
            if (source.includes("forecast")) return "Hentet fra Open-Meteo (forecast)";
            return "Hentet fra Open-Meteo";
        }
        return `Hentet fra: ${source}`;
    };

    const setOmUvUpdatedAtStatus = () => {
        if (!omUvUpdatedAtEl) return;
        const text = formatSharedUvUpdatedAt(sharedUvUpdatedAt);
        omUvUpdatedAtEl.textContent = text || "Delt UV-data: venter på første oppdatering.";
        if (omUvSourceInfoEl) {
            const sourceText = formatSharedUvSource(sharedUvSource);
            omUvSourceInfoEl.dataset.tooltip = sourceText;
            omUvSourceInfoEl.removeAttribute("title");
        }
    };

    const setTrendChartLoading = (isLoading) => {
        if (!trendChartTile) return;
        trendChartTile.classList.toggle("is-loading", Boolean(isLoading));
    };

    let omSelectedRange = "30d";
    let omPrevToggleState = null;
    let omPrevTempGradient = null;
    let omPrevSeries = null;
    let omPrevSeriesKey = null;
    let omPrevGradientAllowed = null;

    const positionRangeIndicator = () => {
        if (!omRangeSelector || !omRangeIndicator) return;
        const activeBtn = omRangeSelector.querySelector(".range-selector__btn.is-active");
        if (!activeBtn) return;
        const buttonRect = activeBtn.getBoundingClientRect();
        const containerRect = omRangeSelector.getBoundingClientRect();
        const offsetX = buttonRect.left - containerRect.left;
        const inset = 10;
        const indicatorWidth = Math.max(24, buttonRect.width - inset);
        omRangeIndicator.style.width = `${indicatorWidth}px`;
        omRangeIndicator.style.transform = `translateX(${offsetX + inset / 2}px)`;
    };

    const setActiveRange = (nextRange) => {
        if (!nextRange || omSelectedRange === nextRange) return;
        omSelectedRange = nextRange;
        omRangeButtons.forEach((btn) => {
            const isActive = btn.dataset.range === nextRange;
            btn.classList.toggle("is-active", isActive);
            btn.setAttribute("aria-selected", isActive ? "true" : "false");
        });
        positionRangeIndicator();
    };

    async function updateTrendChartForCoords(lat, lon) {
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            setOmStatus("Skriv inn gyldige koordinater.");
            setTrendChartLoading(false);
            return;
        }
        setTrendChartLoading(true);
        try {
            setOmStatus("Henter grafdata…");
            const { labels, values, humidity, days } = await fetchTemperaturesForRange(lat, lon, omSelectedRange);
            const includeTemp = omTempToggle ? omTempToggle.checked : true;
            const includeHumidity = !!omHumidityToggle?.checked;
            const includeUv = !!omUvToggle?.checked;
            const includeAqi = !!omAqiToggle?.checked;
            const disableGradient = includeUv || includeAqi;
            const gradientAllowed = !disableGradient;
            const tempGradient = includeTemp && gradientAllowed;
            const animateGradient = omPrevGradientAllowed !== null && omPrevGradientAllowed !== gradientAllowed;

            const fetchKey = `${lat},${lon},${omSelectedRange}`;
            const canAnimateOut = !!omPrevSeries && omPrevSeriesKey === fetchKey;

            const nextToggleState = {
                temp: includeTemp,
                humidity: includeHumidity,
                uv: includeUv,
                aqi: includeAqi,
            };

            const animateTemp = includeTemp && (!omPrevToggleState || !omPrevToggleState.temp);
            const animateHumidity = includeHumidity && (!omPrevToggleState || !omPrevToggleState.humidity);
            const animateUv = includeUv && (!omPrevToggleState || !omPrevToggleState.uv);
            const animateAqi = includeAqi && (!omPrevToggleState || !omPrevToggleState.aqi);

            const tempOff = !!omPrevToggleState?.temp && !includeTemp;
            const humidityOff = !!omPrevToggleState?.humidity && !includeHumidity;
            const uvOff = !!omPrevToggleState?.uv && !includeUv;
            const aqiOff = !!omPrevToggleState?.aqi && !includeAqi;

            const extraRequests = [
                includeUv ? fetchUvIndexForRange(lat, lon, omSelectedRange, days) : Promise.resolve(null),
                includeAqi ? fetchAqiForRange(lat, lon, omSelectedRange, days) : Promise.resolve(null),
            ];
            const [uvResult, aqiResult] = await Promise.allSettled(extraRequests);
            const warnings = [];

            setOmUvUpdatedAtStatus();

            const uvRawValues = uvResult.status === "fulfilled" ? uvResult.value : null;
            const uvValues = hasNonZeroSeries(uvRawValues) ? uvRawValues : null;
            if (uvResult.status === "rejected" || !uvValues) warnings.push("UV");

            const aqiRawValues = aqiResult.status === "fulfilled" ? aqiResult.value : null;
            const aqiValues = hasNonZeroSeries(aqiRawValues) ? aqiRawValues : null;
            if (aqiResult.status === "rejected" || !aqiValues) warnings.push("AQI");

            const tempValues = includeTemp ? values : values.map(() => null);

            const exitLabels = canAnimateOut && (tempOff || humidityOff || uvOff || aqiOff)
                ? omPrevSeries?.labels || labels
                : labels;
            const exitTemp = includeTemp
                ? values
                : tempOff && canAnimateOut
                    ? omPrevSeries?.tempValues || null
                    : null;
            const exitHumidity = includeHumidity
                ? humidity
                : humidityOff && canAnimateOut
                    ? omPrevSeries?.humidityValues || null
                    : null;
            const exitUv = includeUv
                ? uvValues
                : uvOff && canAnimateOut
                    ? omPrevSeries?.uvValues || null
                    : null;
            const exitAqi = includeAqi
                ? aqiValues
                : aqiOff && canAnimateOut
                    ? omPrevSeries?.aqiValues || null
                    : null;

            const runExitAnimation = canAnimateOut && (tempOff || humidityOff || uvOff || aqiOff);

            const finalDraw = () => {
                replaceAndDrawTrendChart(labels, tempValues, {
                    humidityPoints: includeHumidity ? humidity : null,
                    uvPoints: includeUv ? uvValues : null,
                    aqiPoints: includeAqi ? aqiValues : null,
                    humidityActive: includeHumidity,
                    uvActive: includeUv,
                    aqiActive: includeAqi,
                    gradientAllowed,
                    animateGradient: false,
                    animateTemp: false,
                    animateHumidity: false,
                    animateUv: false,
                    animateAqi: false,
                });
            };

            replaceAndDrawTrendChart(exitLabels, exitTemp || tempValues, {
                humidityPoints: exitHumidity,
                uvPoints: exitUv,
                aqiPoints: exitAqi,
                humidityActive: includeHumidity || humidityOff,
                uvActive: includeUv || uvOff,
                aqiActive: includeAqi || aqiOff,
                gradientAllowed,
                animateGradient,
                animateTemp,
                animateHumidity,
                animateUv,
                animateAqi,
                animateOutTemp: runExitAnimation && tempOff,
                animateOutHumidity: runExitAnimation && humidityOff,
                animateOutUv: runExitAnimation && uvOff,
                animateOutAqi: runExitAnimation && aqiOff,
                onComplete: runExitAnimation ? finalDraw : null,
            });

            omPrevToggleState = nextToggleState;
            omPrevTempGradient = tempGradient;
            omPrevSeries = {
                labels,
                tempValues: values,
                humidityValues: humidity,
                uvValues,
                aqiValues,
            };
            omPrevSeriesKey = fetchKey;
            omPrevGradientAllowed = gradientAllowed;

            if (warnings.length) {
                setOmStatus(`Delvis feil: ${warnings.join(", ")} utilgjengelig.`);
            } else {
                setOmStatus("");
            }
        } catch (err) {
            console.error(err);
            setOmStatus(`Feil: ${err.message}`);
        } finally {
            setTrendChartLoading(false);
        }
    }

    const omLatInput = document.getElementById("omLat");
    const omLonInput = document.getElementById("omLon");
    const geocodingSearchInput = document.getElementById("geocodingSearch");
    const omLocationResults = document.getElementById("omLocationResults");
    const omTempToggle = document.getElementById("omTempToggle");
    const omHumidityToggle = document.getElementById("omHumidityToggle");
    const omUvToggle = document.getElementById("omUvToggle");
    const omAqiToggle = document.getElementById("omAqiToggle");
    const DEFAULT_LAT = 59.9139;
    const DEFAULT_LON = 10.7522;
    const OM_GEOCODING_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";

    if (omHumidityToggle) omHumidityToggle.checked = true;
    if (omUvToggle) omUvToggle.checked = true;
    if (omAqiToggle) omAqiToggle.checked = true;

    if (omLatInput && omLonInput) {
        const searchField = geocodingSearchInput?.closest(".field-with-icon--city") || null;
        let omLocationSearchTimer = null;
        let omLocationResultsData = [];
        let omLocationActiveIndex = -1;

        const closeLocationOverlay = () => {
            if (!omLocationResults || !geocodingSearchInput) return;
            omLocationResults.hidden = true;
            geocodingSearchInput.setAttribute("aria-expanded", "false");
            omLocationActiveIndex = -1;
        };

        const formatLocationLabel = (entry) => {
            const parts = [entry.name, entry.admin1, entry.country].filter(Boolean);
            return parts.join(", ");
        };

        const setActiveLocationResult = (nextIndex) => {
            if (!omLocationResults) return;
            const nodes = Array.from(omLocationResults.querySelectorAll(".weather-location-results__item"));
            nodes.forEach((node, idx) => {
                const isActive = idx === nextIndex;
                node.classList.toggle("is-active", isActive);
                node.setAttribute("aria-selected", isActive ? "true" : "false");
            });
            omLocationActiveIndex = nextIndex;
        };

        const selectLocationResult = (entry) => {
            if (!entry || !Number.isFinite(Number(entry.latitude)) || !Number.isFinite(Number(entry.longitude))) return;
            const lat = Number(entry.latitude);
            const lon = Number(entry.longitude);
            omLatInput.value = lat.toFixed(4);
            omLonInput.value = lon.toFixed(4);
            if (geocodingSearchInput) geocodingSearchInput.value = formatLocationLabel(entry);
            closeLocationOverlay();
            updateTrendChartForCoords(lat, lon);
        };

        const renderLocationResults = (results = []) => {
            if (!omLocationResults || !geocodingSearchInput) return;
            omLocationResults.innerHTML = "";
            omLocationResultsData = results;

            if (!results.length) {
                closeLocationOverlay();
                return;
            }

            results.forEach((entry, index) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "weather-location-results__item";
                button.setAttribute("role", "option");
                button.setAttribute("aria-selected", "false");

                const name = document.createElement("span");
                name.className = "weather-location-results__name";
                name.textContent = entry.name || "Ukjent sted";

                const meta = document.createElement("span");
                meta.className = "weather-location-results__meta";
                meta.textContent = [entry.admin1, entry.country].filter(Boolean).join(", ");

                button.append(name, meta);
                button.addEventListener("click", () => selectLocationResult(entry));
                button.addEventListener("mouseenter", () => setActiveLocationResult(index));
                omLocationResults.appendChild(button);
            });

            omLocationResults.hidden = false;
            geocodingSearchInput.setAttribute("aria-expanded", "true");
            setActiveLocationResult(-1);
        };

        const fetchLocationResults = async (queryText) => {
            const query = (queryText || "").trim();
            if (query.length < 2) {
                renderLocationResults([]);
                setOmStatus("");
                return;
            }

            const params = new URLSearchParams({
                name: query,
                count: "8",
                language: "no",
                format: "json",
            });

            try {
                const response = await fetch(`${OM_GEOCODING_ENDPOINT}?${params.toString()}`);
                if (!response.ok) {
                    throw new Error("Kunne ikke hente stedsforslag");
                }
                const data = await response.json();
                const results = Array.isArray(data?.results) ? data.results : [];
                renderLocationResults(results);
                if (!results.length) {
                    setOmStatus("Ingen treff på sted.");
                } else {
                    setOmStatus("");
                }
            } catch (error) {
                console.error(error);
                renderLocationResults([]);
                setOmStatus("Klarte ikke hente stedsforslag.");
            }
        };

        if (omRangeButtons.length) {
            omRangeButtons.forEach((btn) => {
                btn.addEventListener("click", () => {
                    const nextRange = btn.dataset.range;
                    setActiveRange(nextRange);
                    updateTrendChartForCoords(Number(omLatInput.value), Number(omLonInput.value));
                });
            });
            requestAnimationFrame(positionRangeIndicator);
            window.addEventListener("resize", positionRangeIndicator);
        }

        if (!omLatInput.value) omLatInput.value = DEFAULT_LAT;
        if (!omLonInput.value) omLonInput.value = DEFAULT_LON;
        if (geocodingSearchInput && !geocodingSearchInput.value.trim()) {
            geocodingSearchInput.value = "Oslo, Norge";
        }

        let omInputTimer = null;
        const scheduleOmUpdate = () => {
            if (omInputTimer) clearTimeout(omInputTimer);
            omInputTimer = setTimeout(() => {
                const lat = Number(omLatInput.value);
                const lon = Number(omLonInput.value);
                closeLocationOverlay();
                updateTrendChartForCoords(lat, lon);
            }, 400);
        };

        const handleCoordPaste = (event) => {
            const text = event.clipboardData?.getData("text")?.trim();
            if (!text) return;
            const matches = text.match(/-?\d+(?:[.,]\d+)?/g);
            if (!matches || matches.length < 2) return;
            const lat = Number(matches[0].replace(",", "."));
            const lon = Number(matches[1].replace(",", "."));
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
            event.preventDefault();
            omLatInput.value = lat;
            omLonInput.value = lon;
            closeLocationOverlay();
            updateTrendChartForCoords(lat, lon);
        };

        if (geocodingSearchInput) {
            geocodingSearchInput.addEventListener("input", () => {
                if (omLocationSearchTimer) clearTimeout(omLocationSearchTimer);
                omLocationSearchTimer = setTimeout(() => {
                    fetchLocationResults(geocodingSearchInput.value);
                }, 250);
            });

            geocodingSearchInput.addEventListener("focus", () => {
                if (omLocationResultsData.length) {
                    omLocationResults.hidden = false;
                    geocodingSearchInput.setAttribute("aria-expanded", "true");
                }
            });

            geocodingSearchInput.addEventListener("keydown", (event) => {
                if (omLocationResults?.hidden || !omLocationResultsData.length) return;
                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    const next = Math.min(omLocationActiveIndex + 1, omLocationResultsData.length - 1);
                    setActiveLocationResult(next);
                    return;
                }
                if (event.key === "ArrowUp") {
                    event.preventDefault();
                    const next = Math.max(omLocationActiveIndex - 1, 0);
                    setActiveLocationResult(next);
                    return;
                }
                if (event.key === "Enter" && omLocationActiveIndex >= 0) {
                    event.preventDefault();
                    selectLocationResult(omLocationResultsData[omLocationActiveIndex]);
                    return;
                }
                if (event.key === "Escape") {
                    closeLocationOverlay();
                }
            });
        }

        document.addEventListener("click", (event) => {
            if (!searchField) return;
            if (!searchField.contains(event.target)) {
                closeLocationOverlay();
            }
        });

        omLatInput.addEventListener("input", scheduleOmUpdate);
        omLonInput.addEventListener("input", scheduleOmUpdate);
        omLatInput.addEventListener("change", scheduleOmUpdate);
        omLonInput.addEventListener("change", scheduleOmUpdate);
        omLatInput.addEventListener("paste", handleCoordPaste);
        omLonInput.addEventListener("paste", handleCoordPaste);
        [omTempToggle, omHumidityToggle, omUvToggle, omAqiToggle].forEach((toggle) => {
            if (!toggle) return;
            toggle.addEventListener("change", () => {
                updateTrendChartForCoords(Number(omLatInput.value), Number(omLonInput.value));
            });
        });

        updateTrendChartForCoords(Number(omLatInput.value), Number(omLonInput.value));
    }

    //aksjer og krypto (gratis)
    function replaceAndDrawMarketChart(labels, points, options = {}) {
        const current = document.getElementById("marketChart");
        if (!current || !current.parentNode) return;
        const fresh = current.cloneNode(true);
        current.parentNode.replaceChild(fresh, current);
        drawTemperatureLineChart(fresh, labels, points, options);
    }

    const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
    const marketTypeSelect = document.getElementById("marketType");
    const marketSymbolInput = document.getElementById("marketSymbol");
    const marketBaseInput = document.getElementById("marketBase");
    const marketQuoteInput = document.getElementById("marketQuote");
    const marketStatusEl = document.getElementById("marketStatus");
    const marketRangeSelector = document.getElementById("marketRangeSelector");
    const marketRangeButtons = marketRangeSelector
        ? Array.from(marketRangeSelector.querySelectorAll("[data-range]"))
        : [];
    const marketRangeIndicator = marketRangeSelector
        ? marketRangeSelector.querySelector(".range-selector__indicator")
        : null;
    const marketChartTile = document.getElementById("marketChartTile");
    const marketFields = Array.from(document.querySelectorAll("[data-market-field]"));
    const DEFAULT_STOCK_SYMBOL = "aapl.us";
    let marketSelectedRange = "30d";
    let marketAutoFetchTimer = null;

    const setMarketStatus = (msg) => {
        if (marketStatusEl) marketStatusEl.textContent = msg;
    };

    const setMarketChartLoading = (isLoading) => {
        if (!marketChartTile) return;
        marketChartTile.classList.toggle("is-loading", Boolean(isLoading));
    };

    const setMarketChartInvalid = (message = "Ugyldig symbol/ISIN") => {
        if (!marketChartTile) return;
        marketChartTile.classList.add("is-invalid");
        marketChartTile.dataset.invalidMessage = message;
    };

    const clearMarketChartInvalid = () => {
        if (!marketChartTile) return;
        marketChartTile.classList.remove("is-invalid");
        delete marketChartTile.dataset.invalidMessage;
    };

    const normalizeUpper = (value) => (value || "").trim().toUpperCase();
    const normalizeLower = (value) => (value || "").trim().toLowerCase();

    const coinGeckoIds = {
        btc: "bitcoin",
        eth: "ethereum",
        sol: "solana",
        xrp: "ripple",
        ada: "cardano",
        doge: "dogecoin",
        bnb: "binancecoin",
        link: "chainlink",
        dot: "polkadot",
        ltc: "litecoin",
    };

    const toggleMarketFields = () => {
        const type = marketTypeSelect?.value || "stock";
        marketFields.forEach((field) => {
            const show = field.dataset.marketField === type;
            field.classList.toggle("is-hidden", !show);
        });
    };

    const positionMarketRangeIndicator = () => {
        if (!marketRangeSelector || !marketRangeIndicator) return;
        const activeBtn = marketRangeSelector.querySelector(".range-selector__btn.is-active");
        if (!activeBtn) return;
        const buttonRect = activeBtn.getBoundingClientRect();
        const containerRect = marketRangeSelector.getBoundingClientRect();
        const offsetX = buttonRect.left - containerRect.left;
        const inset = 10;
        const indicatorWidth = Math.max(24, buttonRect.width - inset);
        marketRangeIndicator.style.width = `${indicatorWidth}px`;
        marketRangeIndicator.style.transform = `translateX(${offsetX + inset / 2}px)`;
    };

    const setMarketRange = (nextRange) => {
        if (!nextRange || marketSelectedRange === nextRange) return;
        marketSelectedRange = nextRange;
        marketRangeButtons.forEach((btn) => {
            const isActive = btn.dataset.range === nextRange;
            btn.classList.toggle("is-active", isActive);
            btn.setAttribute("aria-selected", isActive ? "true" : "false");
        });
        positionMarketRangeIndicator();
    };

    const parseStooqCsv = (csvText, rangeKey) => {
        const lines = csvText.trim().split(/\r?\n/);
        if (lines.length < 2) return { labels: [], values: [] };
        const { start, end } = getRangeForKey(rangeKey);
        const labels = [];
        const values = [];
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const parts = line.includes(";") ? line.split(";") : line.split(",");
            const dateStr = parts[0];
            const closeStr = parts[4];
            if (!dateStr || !datePattern.test(dateStr) || !closeStr) continue;
            const date = new Date(`${dateStr}T00:00:00Z`);
            if (!Number.isFinite(date.getTime())) continue;
            if (date < start || date > end) continue;
            const closeVal = Number.parseFloat(closeStr);
            labels.push(dayFormatter.format(date));
            values.push(Number.isFinite(closeVal) ? closeVal : null);
        }

        return { labels, values };
    };

    async function fetchStooqHistory(symbol, rangeKey) {
        const cleanSymbol = normalizeLower(symbol);
        const baseUrl = `https://stooq.com/q/d/l/?s=${encodeURIComponent(cleanSymbol)}&i=d`;
        const proxyUrls = [
            `https://r.jina.ai/http://stooq.com/q/d/l/?s=${encodeURIComponent(cleanSymbol)}&i=d`,
            `https://r.jina.ai/http://www.stooq.com/q/d/l/?s=${encodeURIComponent(cleanSymbol)}&i=d`,
        ];
        const csvText = await fetchTextWithFallback(proxyUrls);
        const parsed = parseStooqCsv(csvText, rangeKey);
        if (!parsed.labels.length) {
            throw new Error("Fant ingen data (sjekk Stooq-symbol).");
        }
        return parsed;
    }

    const isIsin = (value) => /^NO\d{10}$/i.test((value || "").trim());

    const filterByRange = (rows, rangeKey) => {
        const { start, end } = getRangeForKey(rangeKey);
        return rows.filter((row) => row.date >= start && row.date <= end);
    };

    async function fetchFundHistoryByIsin(isin, rangeKey) {
        const cleanIsin = normalizeUpper(isin);
        const resolveUrl = `/.netlify/functions/resolve-symbol?isin=${encodeURIComponent(cleanIsin)}`;
        const legacyResolveUrl = `/api/resolve-symbol?isin=${encodeURIComponent(cleanIsin)}`;

        let symbol = "";
        let resolved = null;
        try {
            resolved = await fetch(resolveUrl);
        } catch {
            resolved = null;
        }
        if (!resolved || !resolved.ok) {
            resolved = await fetch(legacyResolveUrl);
        }
        if (!resolved.ok) {
            throw new Error(`Symbol-oppslag feilet (HTTP ${resolved.status})`);
        }
        const resolvedData = await resolved.json();
        symbol = normalizeUpper(resolvedData?.symbol || "");
        if (!symbol) {
            throw new Error("Fant ikke symbol for ISIN.");
        }

        const historyUrl = `/.netlify/functions/historical-quotes?symbol=${encodeURIComponent(symbol)}`;
        const legacyHistoryUrl = `/api/historical-quotes?symbol=${encodeURIComponent(symbol)}`;

        let historyRes = null;
        try {
            historyRes = await fetch(historyUrl);
        } catch {
            historyRes = null;
        }
        if (!historyRes || !historyRes.ok) {
            historyRes = await fetch(legacyHistoryUrl);
        }
        if (!historyRes.ok) {
            throw new Error(`Historikk feilet (HTTP ${historyRes.status})`);
        }

        const historyJson = await historyRes.json();
        const rawRows = Array.isArray(historyJson)
            ? historyJson
            : (historyJson.data || historyJson.results || historyJson.quotes || []);

        const normalizedRows = rawRows
            .map((row) => {
                const dateValue = row.date || row.datetime || row.day || null;
                const tsValue = row.timestamp ? Number(row.timestamp) : null;

                let date = null;
                if (dateValue) {
                    date = new Date(String(dateValue).slice(0, 10));
                } else if (Number.isFinite(tsValue)) {
                    date = new Date(tsValue * 1000);
                }
                if (!date || !Number.isFinite(date.getTime())) return null;

                const close = Number(row.c ?? row.close ?? row.price ?? row.nav);
                if (!Number.isFinite(close)) return null;

                return { date, close };
            })
            .filter(Boolean)
            .sort((a, b) => a.date - b.date);

        const filteredRows = filterByRange(normalizedRows, rangeKey);
        if (!filteredRows.length) {
            throw new Error("Fant ingen fondsdata i valgt periode.");
        }

        return {
            labels: filteredRows.map((row) => dayFormatter.format(row.date)),
            values: filteredRows.map((row) => row.close),
            symbol,
        };
    }

    const getCoinGeckoDays = (rangeKey) => {
        if (rangeKey === "1y") return 365;
        if (rangeKey === "5y") return 365 * 5;
        if (rangeKey === "ytd") {
            const today = new Date();
            const start = new Date(today.getFullYear(), 0, 1);
            const diffMs = today - start;
            return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        }
        return 30;
    };

    async function fetchCoinGeckoHistory(baseAsset, quoteAsset, rangeKey) {
        const base = normalizeLower(baseAsset);
        const quote = normalizeLower(quoteAsset);
        const coinId = coinGeckoIds[base] || base;
        const days = getCoinGeckoDays(rangeKey);
        const url =
            `${COINGECKO_BASE}/coins/${encodeURIComponent(coinId)}/market_chart` +
            `?vs_currency=${encodeURIComponent(quote)}` +
            `&days=${encodeURIComponent(days)}` +
            `&interval=daily`;

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`CoinGecko feil: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        const prices = Array.isArray(data?.prices) ? data.prices : [];
        const labels = prices.map((entry) => dayFormatter.format(new Date(entry[0])));
        const values = prices.map((entry) => (Number.isFinite(entry[1]) ? entry[1] : null));
        if (!labels.length) {
            throw new Error("Fant ingen data (sjekk coin ID).");
        }
        return { labels, values, coinId };
    }

    async function updateMarketChart() {
        const type = marketTypeSelect?.value || "stock";
        setMarketChartLoading(true);
        clearMarketChartInvalid();
        setMarketStatus("Henter markedsdata…");

        try {
            if (type === "stock") {
                const rawSymbol = (marketSymbolInput?.value || "").trim();
                if (!rawSymbol) {
                    setMarketStatus("Skriv inn Stooq-symbol (f.eks. aapl.us).");
                    setMarketChartInvalid("Ugyldig symbol/ISIN");
                    return;
                }

                let labels = [];
                let values = [];
                let chartLabel = normalizeUpper(rawSymbol);

                if (isIsin(rawSymbol)) {
                    try {
                        const fundResult = await fetchFundHistoryByIsin(rawSymbol, marketSelectedRange);
                        labels = fundResult.labels;
                        values = fundResult.values;
                        chartLabel = fundResult.symbol || chartLabel;
                    } catch {
                        setMarketStatus("Ugyldig symbol/ISIN.");
                        setMarketChartInvalid("Ugyldig symbol/ISIN");
                        return;
                    }
                } else {
                    const stooqResult = await fetchStooqHistory(rawSymbol, marketSelectedRange);
                    labels = stooqResult.labels;
                    values = stooqResult.values;
                }

                replaceAndDrawMarketChart(labels, values, {
                    primaryLabel: `${chartLabel} pris`,
                    primarySuffix: "",
                    primaryFormatter: new Intl.NumberFormat("no-NO", { maximumFractionDigits: 2 }),
                });
                clearMarketChartInvalid();
                setMarketStatus("");
            } else {
                const baseAsset = normalizeUpper(marketBaseInput?.value);
                const quoteAsset = normalizeUpper(marketQuoteInput?.value);
                if (!baseAsset || !quoteAsset) {
                    setMarketStatus("Skriv inn basis og motvaluta.");
                    return;
                }
                const { labels, values } = await fetchCoinGeckoHistory(baseAsset, quoteAsset, marketSelectedRange);
                replaceAndDrawMarketChart(labels, values, {
                    primaryLabel: `${baseAsset}/${quoteAsset}`,
                    primarySuffix: "",
                    primaryFormatter: new Intl.NumberFormat("no-NO", { maximumFractionDigits: 6 }),
                });
                clearMarketChartInvalid();
                setMarketStatus("");
            }
        } catch (err) {
            console.error(err);
            if (type === "stock") {
                setMarketChartInvalid("Ugyldig symbol/ISIN");
            }
            setMarketStatus(`Feil: ${err.message}`);
        } finally {
            setMarketChartLoading(false);
        }
    }

    const scheduleMarketAutoFetch = () => {
        clearTimeout(marketAutoFetchTimer);
        marketAutoFetchTimer = setTimeout(updateMarketChart, 450);
    };

    if (marketTypeSelect) {
        if (marketTypeSelect.value === "stock" && marketSymbolInput && !marketSymbolInput.value.trim()) {
            marketSymbolInput.value = DEFAULT_STOCK_SYMBOL;
        }
        toggleMarketFields();
        marketTypeSelect.addEventListener("change", () => {
            toggleMarketFields();
            scheduleMarketAutoFetch();
        });
    }

    if (marketRangeButtons.length) {
        marketRangeButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const nextRange = btn.dataset.range;
                setMarketRange(nextRange);
                updateMarketChart();
            });
        });
        requestAnimationFrame(positionMarketRangeIndicator);
        window.addEventListener("resize", positionMarketRangeIndicator);
    }

    if (marketSymbolInput) {
        marketSymbolInput.addEventListener("input", scheduleMarketAutoFetch);
        marketSymbolInput.addEventListener("change", scheduleMarketAutoFetch);
    }

    if (marketBaseInput) {
        marketBaseInput.addEventListener("input", scheduleMarketAutoFetch);
        marketBaseInput.addEventListener("change", scheduleMarketAutoFetch);
    }

    if (marketQuoteInput) {
        marketQuoteInput.addEventListener("input", scheduleMarketAutoFetch);
        marketQuoteInput.addEventListener("change", scheduleMarketAutoFetch);
    }

    if (marketTypeSelect || marketRangeButtons.length || marketSymbolInput || marketBaseInput || marketQuoteInput) {
        updateMarketChart();
    }


    document.addEventListener("open-meteo:forecast", (evt) => {
        const { lat, lon } = evt?.detail || {};
        updateTrendChartForCoords(Number(lat), Number(lon));
    });

    //klokke-widget
    const timerDisplay = document.getElementById("timeren");
    const countdownDisplay = document.getElementById("nedtelling");
    const minInput = document.getElementById("minInput");
    const sekInput = document.getElementById("sekInput");
    const startBtn = document.getElementById("startBtn");
    const stoppBtn = document.getElementById("stoppBtn");
    const resetBtn = document.getElementById("resetBtn");

    let timerSekunder = 0;
    setInterval(() => {
        timerSekunder++;
        timerDisplay.textContent = formatTid(timerSekunder);
    }, 1000);

    let countdownSekunder = 600;
    let nedtellingInterval = null;

    function startNedtelling() {
        const min = parseInt(minInput.value) || 10;
        const sek = parseInt(sekInput.value) || 0;
        countdownSekunder = min * 60 + sek;
        if (nedtellingInterval) clearInterval(nedtellingInterval);
        oppdaterCountdown();
        nedtellingInterval = setInterval(() => {
            countdownSekunder--;
            if (countdownSekunder <= 0) {
                clearInterval(nedtellingInterval);
                countdownSekunder = 0;
                alert("Tid er ute! 🚨");
            }
            oppdaterCountdown();
        }, 1000);
    }
    function stoppNedtelling() {
        clearInterval(nedtellingInterval);
        nedtellingInterval = null;
    }
    function resetNedtelling() {
        stoppNedtelling();
        countdownSekunder = 600;
        oppdaterCountdown();
    }
    function oppdaterCountdown() {
        countdownDisplay.textContent = formatTid(countdownSekunder);
    }
    function formatTid(totalSekunder) {
        const timer = String(Math.floor(totalSekunder / 3600)).padStart(2, "0");
        const min = String(Math.floor((totalSekunder % 3600) / 60)).padStart(2, "0");
        const sek = String(totalSekunder % 60).padStart(2, "0");
        return `${timer}:${min}:${sek}`;
    }
    startBtn.addEventListener("click", startNedtelling);
    stoppBtn.addEventListener("click", stoppNedtelling);
    resetBtn.addEventListener("click", resetNedtelling);
    oppdaterCountdown();


        //vær: prøv data fra data/weather.json, ellers fallback til met.no (med user-agent)
        async function getWeather() {
        const el = {
            temp: document.querySelector(".temp"),
            feels: document.querySelector(".feelslike"),
            wind: document.querySelector(".wind"),
            humidity: document.querySelector(".humidity"),
            clouds: document.querySelector(".clouds"),
            pressure: document.querySelector(".pressure"),
            precip: document.querySelector(".precip"),
            symbol: document.querySelector(".symbol"),
        };

        //hjelpere
        const degToDir = (deg) => {
            //16-sektors kompass
            const dirs = ["N","NØ","Ø","SØ","S","SV","V","NV","N"]; //kort variant
            const idx = Math.round(((deg % 360) / 45));
            return dirs[idx];
        };

        //enkel vindkjøling (metodisk ikke 100% offisiell; gir “ok” indikator ved lave temp)
        const feelsLike = (tC, windMs) => {
            if (tC === undefined || windMs === undefined) return undefined;
            //konverter til km/t for en enkel formel (ikke offisiell wci)
            const v = windMs * 3.6;
            //grov tilnærming: føles = t - k * v, lavere k når varmere
            const k = tC <= 5 ? 0.1 : 0.03;
            return Math.round((tC - k * v) * 10) / 10;
        };

        const render = (data) => {
            const ts = data?.properties?.timeseries?.[0];
            if (!ts) throw new Error("Mangler timeseries[0]");

            const now = ts.data?.instant?.details || {};
            const next1h = ts.data?.next_1_hours;
            //next_6_hours finnes ofte også: ts.data?.next_6_hours

            const temp = now.air_temperature;
            const wind = now.wind_speed; //m/s
            const gust = now.wind_speed_of_gust; //m/s
            const windDir = now.wind_from_direction; //grader
            const rh = now.relative_humidity; //%
            const clouds = now.cloud_area_fraction; //%
            const pressure = now.air_pressure_at_sea_level; //hpa

            const feels = feelsLike(temp, wind);

            //oppdater dom – legg inn kun hvis felt finnes
            if (typeof temp === "number" && el.temp) el.temp.textContent = `${temp} °C`;
            if (typeof feels === "number" && el.feels) el.feels.textContent = `Føles som: ${feels} °C`;

            if (typeof wind === "number" && typeof windDir === "number" && el.wind) {
            const dirTxt = degToDir(windDir);
            const gustTxt = typeof gust === "number" ? ` (kast: ${gust.toFixed(1)} m/s)` : "";
            el.wind.textContent = `Vind: ${wind.toFixed(1)} m/s ${dirTxt}${gustTxt}`;
            }

            if (typeof rh === "number" && el.humidity) el.humidity.textContent = `Luftfuktighet: ${Math.round(rh)}%`;
            if (typeof clouds === "number" && el.clouds) el.clouds.textContent = `Skydekke: ${Math.round(clouds)}%`;
            if (typeof pressure === "number" && el.pressure) el.pressure.textContent = `Trykk: ${Math.round(pressure)} hPa`;

            if (next1h) {
            const precip = next1h?.details?.precipitation_amount;
            const sym = next1h?.summary?.symbol_code;
            if (typeof precip === "number" && el.precip) el.precip.textContent = `Nedbør (neste 1t): ${precip.toFixed(1)} mm`;
            if (sym && el.symbol) {
                //du kan senere mappe symbol_code -> ikonfil (f.eks. 'partlycloudy_day' -> /icons/partlycloudy_day.svg)
                el.symbol.textContent = `Værsymbol: ${sym}`;
                //eksempel for ikon:
                //el.symbol.innerHTML = `<img src="/icons/${sym}.svg" alt="${sym}" width="28" height="28">`;
            }
            }
        };

        //1) prøv same-origin json (actions) først
        try {
            const res = await fetch("data/weather.json", { cache: "no-cache" });
            if (!res.ok) throw new Error("weather.json mangler");
            const data = await res.json();
            render(data);
            return;
        } catch (err) {
            console.warn("Bruker ikke weather.json:", err);
        }

        //2) fallback: direkte met.no (med user-agent)
        try {
            const url = "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.91&lon=10.75";
            const res2 = await fetch(url, {
            headers: {
                //sett din egen identifikator/kontaktinfo i ua i produksjon (se met.no guidelines)
                "User-Agent": "LeandersVærWidget/1.0 (kontakt: example@example.com)"
            }
            });
            if (!res2.ok) throw new Error(`MET.no ${res2.status}`);
            const data2 = await res2.json();
            render(data2);
        } catch (err2) {
            console.error("Klarte ikke hente værdata:", err2);
            if (el.temp) el.temp.textContent = "Klarte ikke hente værdata";
        }
        }

        //vis/skjul bokser fra sidebar
        const cardToggles = document.querySelectorAll("[data-toggle-card]");
        const storedVisibility = JSON.parse(localStorage.getItem("altkalkis-card-visibility") || "{}");
        let requestMasonryLayout = null;
        const applyVisibility = (cardId, isVisible) => {
            const card = document.getElementById(cardId);
            if (!card) return;
            card.classList.toggle("is-hidden", !isVisible);
        };

        if (cardToggles.length) {
            cardToggles.forEach((toggle) => {
                const targetId = toggle.dataset.toggleCard;
                if (!targetId) return;

                if (Object.prototype.hasOwnProperty.call(storedVisibility, targetId)) {
                    toggle.checked = Boolean(storedVisibility[targetId]);
                }

                applyVisibility(targetId, toggle.checked);

                toggle.addEventListener("change", () => {
                    const isVisible = toggle.checked;
                    storedVisibility[targetId] = isVisible;
                    localStorage.setItem("altkalkis-card-visibility", JSON.stringify(storedVisibility));
                    applyVisibility(targetId, isVisible);
                    if (isVisible && targetId === "datetimeCard") {
                        if (typeof updateDateTime === "function") updateDateTime();
                        if (typeof drawAnalogClock === "function") drawAnalogClock();
                    }
                    if (typeof requestMasonryLayout === "function") requestMasonryLayout();
                    window.dispatchEvent(new Event("resize"));
                });
            });
        }

        //masonry: tett layout uten tomme rom
        const grid = document.querySelector("main");
        if (grid && window.Masonry) {
            const cards = Array.from(grid.querySelectorAll(".bordershadow"));
            let resizeTimer;
            const isWideCard = (card) => card.classList.contains("card--wide") || card.classList.contains("card--wide-auto");
            const masonry = new Masonry(grid, {
                itemSelector: ".bordershadow",
                columnWidth: ".grid-sizer",
                gutter: ".gutter-sizer",
                percentPosition: true,
                horizontalOrder: false,
                transitionDuration: "0.2s",
            });

            const reorderCardsForPacking = () => {
                if (window.matchMedia("(max-width: 1100px)").matches) return;

                const visibleCards = cards.filter((card) => !card.classList.contains("is-hidden"));
                if (visibleCards.length < 4) return;

                const wideCards = [];
                const regularCards = [];
                visibleCards.forEach((card) => {
                    if (isWideCard(card)) {
                        wideCards.push(card);
                    } else {
                        regularCards.push(card);
                    }
                });

                if (!wideCards.length || !regularCards.length) return;

                const ordered = [];
                let wideIndex = 0;
                let regularIndex = 0;

                while (wideIndex < wideCards.length || regularIndex < regularCards.length) {
                    if (wideIndex < wideCards.length) {
                        ordered.push(wideCards[wideIndex]);
                        wideIndex += 1;
                    }

                    if (regularIndex < regularCards.length) {
                        ordered.push(regularCards[regularIndex]);
                        regularIndex += 1;
                    }

                    if (wideIndex >= wideCards.length) {
                        while (regularIndex < regularCards.length) {
                            ordered.push(regularCards[regularIndex]);
                            regularIndex += 1;
                        }
                    }
                }

                const currentOrder = visibleCards.map((card) => card.id).join("|");
                const nextOrder = ordered.map((card) => card.id).join("|");
                if (currentOrder === nextOrder) return;

                ordered.forEach((card) => grid.appendChild(card));
            };

            const requestLayout = () => {
                reorderCardsForPacking();
                masonry.reloadItems();
                masonry.layout();
            };

            requestMasonryLayout = () => window.requestAnimationFrame(requestLayout);

            window.addEventListener("load", requestMasonryLayout);
            window.addEventListener("resize", () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(requestMasonryLayout, 120);
            });

            const observer = new ResizeObserver(requestMasonryLayout);
            cards.forEach((card) => observer.observe(card));

            requestMasonryLayout();
        }

});
