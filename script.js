document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM er lastet");

    // 📊 Prosentkalkulator
    const percentBtn = document.getElementById("percentButton");
    if (percentBtn) {
        percentBtn.addEventListener("click", () => {
            const value = parseFloat(document.getElementById("percentValue").value);
            const percent = parseFloat(document.getElementById("percentPercent").value);
            const resultEl = document.getElementById("percentResult");
            if (!isNaN(value) && !isNaN(percent) && resultEl) {   
                const result = (value * percent / 100).toFixed(2);
                resultEl.textContent = `Resultat: ${result}`;
            } else if (resultEl) {
                resultEl.innerText = "Skriv inn gyldige tall.";
            }
        });
    }

    // 💸 Timeslønn
    const hourlyBtn = document.getElementById("hourlyButton");
    if (hourlyBtn) {
        hourlyBtn.addEventListener("click", () => {
            const salary = parseFloat(document.getElementById("monthlySalary").value);
            const hours = parseFloat(document.getElementById("hoursPerWeek").value);
            const el = document.getElementById("hourlyResult");
            if (isNaN(salary) || isNaN(hours) || hours <= 0) {
                if (el) el.innerText = "Skriv inn gyldige verdier.";
                return;
            }
            const yearlyHours = hours * 52;
            const hourly = (salary * 12 / yearlyHours).toFixed(2);
            if (el) el.innerText = `Timeslønn: ${hourly} kr/t`;
        });
    }

    // 🎂 Alderskalkulator
    const ageBtn = document.getElementById("ageButton");
    if (ageBtn) {
        ageBtn.addEventListener("click", () => {
            const birthStr = document.getElementById("birthDate").value;
            const ageEl = document.getElementById("ageResult");
            if (!birthStr) {
                if (ageEl) ageEl.innerText = "Vennligst skriv inn en gyldig dato.";
                return;
            }
            const birth = new Date(birthStr);
            const now = new Date();
            const diffMs = now - birth;
            const ageInYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
            const ageRounded = Math.floor(ageInYears * 10) / 10;
            const years = Math.floor(ageInYears);
            const months = Math.floor((ageInYears - years) * 12);
            if (ageEl) ageEl.innerText = `Omtrent ${ageRounded} år (${years} år og ${months} måneder).`;
        });
    }

    // 📆 Dato-diff
    const diffBtn = document.getElementById("dateDiffButton");
    if (diffBtn) {
        diffBtn.addEventListener("click", () => {
            const d1 = new Date(document.getElementById("date1").value);
            const d2 = new Date(document.getElementById("date2").value);
            const el = document.getElementById("dateDiffResult");
            if (isNaN(d1) || isNaN(d2)) {
                if (el) el.innerText = "Velg to gyldige datoer.";
                return;
            }
            const diffMs = Math.abs(d2 - d1);
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            let years = d2.getFullYear() - d1.getFullYear();
            let months = d2.getMonth() - d1.getMonth();
            if (months < 0) { years--; months += 12; }
            if (el) el.innerHTML = `Forskjell: ${diffDays} dager<br>(${years} år og ${months} måneder)`;
        });
    }

    // ⏰ Tid-diff
    const timeBtn = document.getElementById("timeDiffButton");
    if (timeBtn) {
        timeBtn.addEventListener("click", () => {
            const t1 = document.getElementById("time1").value;
            const t2 = document.getElementById("time2").value;
            const el = document.getElementById("timeDiffResult");
            if (!t1 || !t2) { if (el) el.innerText = "Fyll inn begge klokkeslett."; return; }
            const [h1, m1] = t1.split(":").map(Number);
            const [h2, m2] = t2.split(":").map(Number);
            const total1 = h1 * 60 + m1;
            const total2 = h2 * 60 + m2;
            const diffMinutes = Math.abs(total2 - total1);
            const hours = Math.floor(diffMinutes / 60);
            const minutes = diffMinutes % 60;
            if (el) el.innerText = `Forskjell: ${hours} timer og ${minutes} minutter`;
        });
    }

    // 🌍 Tidssoner
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

    // 🧮 Kalkulator
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

    // 💱 Valutakalkulator
    const convertBtn = document.getElementById("convertBtn");
    if (convertBtn) {
        convertBtn.addEventListener("click", async () => {
            const amount = parseFloat(document.getElementById("amount").value);
            const currency = document.getElementById("currency").value;
            const resEl = document.getElementById("result");
            if (!amount || amount <= 0) { resEl.innerText = "Skriv inn et gyldig beløp!"; return; }
            try {
                const res = await fetch(`https://api.frankfurter.app/latest?from=NOK&to=${currency}`);
                const data = await res.json();
                const rate = data.rates[currency];
                const converted = (amount * rate).toFixed(2);
                resEl.innerText = `${amount} NOK = ${converted} ${currency}`;
            } catch (error) {
                console.error("❌ API-feil:", error);
                resEl.innerText = "Kunne ikke hente valutakurs";
            }
        });
    }


    // 📜 Sitat fra Quotable (random ved hver lasting)
    async function getDailyQuote() {
    const el = document.getElementById("quoteResult");

    try {
        // /quotes/random returnerer en ARRAY med quotes (default 1 hvis limit ikke settes)
        const url = "https://api.quotable.io/quotes/random?limit=1";

        const res = await fetch(url, {
        // mode: "cors" er default for cross-origin fetch, men kan stå for tydelighet
        mode: "cors",
        headers: { "Accept": "application/json" },
        });

        if (!res.ok) throw new Error(`Quotable-feil: ${res.status}`);

        const data = await res.json();
        const q = data?.[0];

        const quote = q?.content;
        const author = q?.author;

        if (quote && author) {
        el.innerText = `"${quote}" — ${author}`;
        } else {
        el.innerText = "Ingen sitat tilgjengelig.";
        }
    } catch (err) {
        console.error(err);
        el.innerText = "Klarte ikke hente sitat 😅";
    }
    }

    getDailyQuote();

    // 📈 Demo line chart (fake data)
    function generateRandomSeries(count, min, max) {
        const values = [];
        for (let i = 0; i < count; i++) {
            values.push(Math.floor(min + Math.random() * (max - min + 1)));
        }
        return values;
    }

    function drawDemoLineChart(canvas) {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rootStyles = getComputedStyle(document.documentElement);
        const accent = rootStyles.getPropertyValue("--color").trim() || "189, 150, 255";
        const bgElevated = rootStyles.getPropertyValue("--color-bg-elevated").trim() || "8, 14, 24";
        const textBase = rootStyles.getPropertyValue("--color-text-base").trim() || "243, 243, 246";

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(240, rect.width);
        const height = Math.max(140, rect.height);
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        // Fake data points (random)
        const points = generateRandomSeries(12, 12, 68);
        const maxVal = Math.max(...points) + 8;
        const minVal = Math.min(...points) - 8;
        const padX = 10;
        const padY = 12;
        const usableW = width - padX * 2;
        const usableH = height - padY * 2;

        const coords = points.map((v, i) => {
            const x = padX + (usableW * i) / (points.length - 1);
            const t = (v - minVal) / (maxVal - minVal);
            const y = height - padY - t * usableH;
            return { x, y };
        });

        function drawBase() {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            // Background
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = `rgba(${bgElevated}, 0.55)`;
            ctx.fillRect(0, 0, width, height);

            // Grid
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

        function render(progress) {
            drawBase();

            const totalSegments = coords.length - 1;
            const progressSegments = totalSegments * progress;
            const lastIndex = Math.floor(progressSegments);
            const t = progressSegments - lastIndex;

            // Line
            ctx.strokeStyle = `rgb(${accent})`;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(coords[0].x, coords[0].y);
            for (let i = 1; i <= lastIndex && i < coords.length; i++) {
                ctx.lineTo(coords[i].x, coords[i].y);
            }
            if (lastIndex + 1 < coords.length) {
                const prev = coords[Math.max(0, lastIndex)];
                const next = coords[lastIndex + 1];
                const ix = prev.x + (next.x - prev.x) * t;
                const iy = prev.y + (next.y - prev.y) * t;
                ctx.lineTo(ix, iy);
            }
            ctx.stroke();

            // Glow dots
            ctx.fillStyle = `rgba(${accent}, 0.85)`;
            for (let i = 0; i <= lastIndex && i < coords.length; i++) {
                ctx.beginPath();
                ctx.arc(coords[i].x, coords[i].y, 2.6, 0, Math.PI * 2);
                ctx.fill();
            }
            if (lastIndex + 1 < coords.length) {
                const prev = coords[Math.max(0, lastIndex)];
                const next = coords[lastIndex + 1];
                const ix = prev.x + (next.x - prev.x) * t;
                const iy = prev.y + (next.y - prev.y) * t;
                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                ctx.arc(ix, iy, 2.6, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        const duration = 900;
        const start = performance.now();
        function animate(now) {
            const progress = Math.min(1, (now - start) / duration);
            render(progress);
            if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }

    const trendChart = document.getElementById("trendChart");
    drawDemoLineChart(trendChart);

    // 📊 Demo bar chart (fake data)
    function drawDemoBarChart(canvas) {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rootStyles = getComputedStyle(document.documentElement);
        const accent = rootStyles.getPropertyValue("--color").trim() || "189, 150, 255";
        const bgElevated = rootStyles.getPropertyValue("--color-bg-elevated").trim() || "8, 14, 24";
        const textBase = rootStyles.getPropertyValue("--color-text-base").trim() || "243, 243, 246";

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(240, rect.width);
        const height = Math.max(140, rect.height);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // Background
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = `rgba(${bgElevated}, 0.55)`;
        ctx.fillRect(0, 0, width, height);

        // Grid (horizontal only, dashed)
        ctx.strokeStyle = `rgba(${textBase}, 0.08)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        const gridRows = 4;
        for (let r = 1; r < gridRows; r++) {
            const y = (height / gridRows) * r;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Fake data (random)
        const values = generateRandomSeries(10, 90, 250);
        const maxVal = Math.max(...values) + 20;
        const minVal = Math.min(...values) - 20;
        const padX = 14;
        const padY = 14;
        const usableW = width - padX * 2;
        const usableH = height - padY * 2;
        const barGap = 10;
        const barCount = values.length;
        const barWidth = (usableW - barGap * (barCount - 1)) / barCount;

        const lineColor = `rgb(${accent})`;
        const gradient = ctx.createLinearGradient(0, padY, 0, height - padY);
        gradient.addColorStop(0, `rgba(${accent}, 0.8)`);
        gradient.addColorStop(1, `rgba(${accent}, 0.05)`);

        // Bars
        values.forEach((v, i) => {
            const t = (v - minVal) / (maxVal - minVal);
            const barHeight = Math.max(6, t * usableH);
            const x = padX + i * (barWidth + barGap);
            const y = height - padY - barHeight;

            // Rounded rect
            const radius = Math.min(8, barWidth / 2);
            ctx.beginPath();
            ctx.moveTo(x, y + radius);
            ctx.arcTo(x, y, x + radius, y, radius);
            ctx.lineTo(x + barWidth - radius, y);
            ctx.arcTo(x + barWidth, y, x + barWidth, y + radius, radius);
            ctx.lineTo(x + barWidth, y + barHeight);
            ctx.lineTo(x, y + barHeight);
            ctx.closePath();

            ctx.fillStyle = gradient;
            ctx.fill();

            // Subtle top stroke
            ctx.strokeStyle = lineColor;
            ctx.globalAlpha = 0.7;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;
        });
    }

    const distributionChart = document.getElementById("distributionChart");
    drawDemoBarChart(distributionChart);

    // ⏱️ Klokke-widget
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


        // 🌦️ Vær: prøv data fra data/weather.json, ellers fallback til MET.no (med User-Agent)
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

        // Hjelpere
        const degToDir = (deg) => {
            // 16-sektors kompass
            const dirs = ["N","NØ","Ø","SØ","S","SV","V","NV","N"]; // kort variant
            const idx = Math.round(((deg % 360) / 45));
            return dirs[idx];
        };

        // Enkel vindkjøling (metodisk ikke 100% offisiell; gir “ok” indikator ved lave temp)
        const feelsLike = (tC, windMs) => {
            if (tC === undefined || windMs === undefined) return undefined;
            // Konverter til km/t for en enkel formel (ikke offisiell WCI)
            const v = windMs * 3.6;
            // Grov tilnærming: føles = T - k * v, lavere k når varmere
            const k = tC <= 5 ? 0.1 : 0.03;
            return Math.round((tC - k * v) * 10) / 10;
        };

        const render = (data) => {
            const ts = data?.properties?.timeseries?.[0];
            if (!ts) throw new Error("Mangler timeseries[0]");

            const now = ts.data?.instant?.details || {};
            const next1h = ts.data?.next_1_hours;
            // next_6_hours finnes ofte også: ts.data?.next_6_hours

            const temp = now.air_temperature;
            const wind = now.wind_speed; // m/s
            const gust = now.wind_speed_of_gust; // m/s
            const windDir = now.wind_from_direction; // grader
            const rh = now.relative_humidity; // %
            const clouds = now.cloud_area_fraction; // %
            const pressure = now.air_pressure_at_sea_level; // hPa

            const feels = feelsLike(temp, wind);

            // Oppdater DOM – legg inn kun hvis felt finnes
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
                // Du kan senere mappe symbol_code -> ikonfil (f.eks. 'partlycloudy_day' -> /icons/partlycloudy_day.svg)
                el.symbol.textContent = `Værsymbol: ${sym}`;
                // Eksempel for ikon:
                // el.symbol.innerHTML = `<img src="/icons/${sym}.svg" alt="${sym}" width="28" height="28">`;
            }
            }
        };

        // 1) Prøv same-origin JSON (Actions) først
        try {
            const res = await fetch("data/weather.json", { cache: "no-cache" });
            if (!res.ok) throw new Error("weather.json mangler");
            const data = await res.json();
            render(data);
            return;
        } catch (err) {
            console.warn("Bruker ikke weather.json:", err);
        }

        // 2) Fallback: direkte MET.no (med User-Agent)
        try {
            const url = "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.91&lon=10.75";
            const res2 = await fetch(url, {
            headers: {
                // Sett din egen identifikator/kontaktinfo i UA i produksjon (se MET.no guidelines)
                "User-Agent": "LeandersVærWidget/1.0 (kontakt: example@example.com)"
            }
            });
            if (!res2.ok) throw new Error(`MET.no ${res2.status}`);
            const data2 = await res2.json();
            render(data2);
        } catch (err2) {
            console.error("Klarte ikke hente værdata:", err2);
            if (el.temp) el.temp.textContent = "Klarte ikke hente værdata 😢";
        }
        }

});
