document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM er lastet");

    // 📊 Prosentkalkulator
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

    // 💸 Timeslønn
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

    // 🎂 Alderskalkulator
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
        ageResultEl.innerText = `Omtrent ${ageRounded} år (${years} år og ${months} måneder).`;
    };
    if (birthDateInput) birthDateInput.addEventListener("input", updateAge);
    updateAge();

    // 📆 Dato-diff
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

    // ⏰ Tid-diff
    const time1Input = document.getElementById("time1");
    const time2Input = document.getElementById("time2");
    const timeDiffResultEl = document.getElementById("timeDiffResult");
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
        const formatter = new Intl.DateTimeFormat("no-NO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        const today = new Date();
        const labels = points.map((_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - (points.length - 1 - i));
            return formatter.format(d);
        });
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

        let hoverIndex = -1;
        let hoverPos = null;
        let interactiveReady = false;
        const hitRadius = 10;

        function drawSmoothPath() {
            if (coords.length < 2) return;
            const tension = 0.5;
            ctx.beginPath();
            ctx.moveTo(coords[0].x, coords[0].y);
            for (let i = 0; i < coords.length - 1; i++) {
                const p0 = coords[i - 1] || coords[i];
                const p1 = coords[i];
                const p2 = coords[i + 1];
                const p3 = coords[i + 2] || p2;

                const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
                const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;
                const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
                const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;

                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
            }
        }

        function drawTooltip(pos, label, value) {
            if (!pos) return;
            const paddingX = 10;
            const paddingY = 8;
            const lineHeight = 16;
            const text1 = label;
            const text2 = `Verdi: ${value}`;

            ctx.font = "12px system-ui, -apple-system, Segoe UI, sans-serif";
            const w1 = ctx.measureText(text1).width;
            const w2 = ctx.measureText(text2).width;
            const boxW = Math.max(w1, w2) + paddingX * 2;
            const boxH = paddingY * 2 + lineHeight * 2;

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
            ctx.fillText(text1, x + paddingX, y + paddingY + lineHeight - 3);
            ctx.fillText(text2, x + paddingX, y + paddingY + lineHeight * 2 - 3);
        }

        function render(progress) {
            drawBase();

            const totalSegments = coords.length - 1;
            const progressSegments = totalSegments * progress;
            const lastIndex = Math.floor(progressSegments);
            const t = progressSegments - lastIndex;

            // Gradient fill under line
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, width * progress, height);
            ctx.clip();
            ctx.beginPath();
            drawSmoothPath();
            ctx.lineTo(coords[coords.length - 1].x, height - padY);
            ctx.lineTo(coords[0].x, height - padY);
            ctx.closePath();
            const fillGradient = ctx.createLinearGradient(0, padY, 0, height - padY);
            fillGradient.addColorStop(0, `rgba(${accent}, 0.35)`);
            fillGradient.addColorStop(1, `rgba(${accent}, 0.0)`);
            ctx.fillStyle = fillGradient;
            ctx.fill();
            ctx.restore();

            // Smooth line
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, width * progress, height);
            ctx.clip();
            ctx.strokeStyle = `rgb(${accent})`;
            ctx.lineWidth = 2.5;
            drawSmoothPath();
            ctx.stroke();
            ctx.restore();

            // Hover point + tooltip
            if (hoverIndex >= 0 && interactiveReady) {
                const p = coords[hoverIndex];
                ctx.fillStyle = `rgba(${accent}, 0.95)`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = `rgba(${textBase}, 0.25)`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
                ctx.stroke();

                drawTooltip(hoverPos, labels[hoverIndex], points[hoverIndex]);
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
            for (let i = 0; i < coords.length; i++) {
                const dx = pos.x - coords[i].x;
                const dy = pos.y - coords[i].y;
                const dist = Math.hypot(dx, dy);
                if (dist < minDist) {
                    minDist = dist;
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

    const trendChart = document.getElementById("trendChart");
    drawDemoLineChart(trendChart);

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

    // 🧱 Auto-masonry: høyde og bredde basert på innhold
    const grid = document.querySelector("main");
    if (grid) {
        const cards = Array.from(grid.querySelectorAll(".bordershadow"));
        const autoWideThreshold = 36; // antall rader før auto-wide
        let resizeTimer;

        const applyMasonry = () => {
            const styles = getComputedStyle(grid);
            const rowHeight = parseFloat(styles.getPropertyValue("grid-auto-rows")) || 8;
            const rowGap = parseFloat(styles.getPropertyValue("row-gap")) || 0;
            const columnCount = styles.gridTemplateColumns.split(" ").length;
            const canBeWide = columnCount >= 2;

            // Første pass: fjern auto-wide og nullstill span
            cards.forEach((card) => {
                card.classList.remove("card--wide-auto");
                card.style.gridRowEnd = "auto";
            });

            // Mål faktisk innholdshøyde og beregn span
            cards.forEach((card) => {
                const contentHeight = card.scrollHeight;
                const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
                if (canBeWide && rowSpan >= autoWideThreshold && !card.classList.contains("card--wide")) {
                    card.classList.add("card--wide-auto");
                }
                card.style.gridRowEnd = `span ${rowSpan}`;
            });
        };

        const requestLayout = () => window.requestAnimationFrame(applyMasonry);

        window.addEventListener("load", requestLayout);
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(requestLayout, 80);
        });

        const observer = new ResizeObserver(requestLayout);
        cards.forEach((card) => observer.observe(card));

        requestLayout();
    }

});
