document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM er lastet");

  // 🔄 Dato og tid
    function updateDateTime() {
        const now = new Date();
        const el = document.getElementById('currentDateTime');
        if (el) el.innerText = now.toLocaleString();
    }

    // kjør med en gang
    updateDateTime();

    // så oppdater hvert sekund
    setInterval(updateDateTime, 1000);

  // 📊 Prosentkalkulator
    const percentBtn = document.getElementById('percentButton');
    if (percentBtn) {
        percentBtn.addEventListener('click', () => {
            const value = parseFloat(document.getElementById('percentValue').value);
            const percent = parseFloat(document.getElementById('percentPercent').value);
            const resultEl = document.getElementById('percentResult');
            if (resultEl) resultEl.innerText = (value * percent / 100).toFixed(2);
        });
    }

  // 💸 Timeslønn
    const hourlyBtn = document.getElementById('hourlyButton');
    if (hourlyBtn) {
        hourlyBtn.addEventListener('click', () => {
            const salary = parseFloat(document.getElementById('monthlySalary').value);
            const hours = parseFloat(document.getElementById('hoursPerWeek').value);
            const yearlyHours = hours * 52;
            const hourly = (salary * 12 / yearlyHours).toFixed(2);
            const el = document.getElementById('hourlyResult');
            if (el) el.innerText = `Timeslønn: ${hourly} kr/t`;
        });
    }

  // 🎂 Alderskalkulator
    const ageBtn = document.getElementById('ageButton');
    if (ageBtn) {
        ageBtn.addEventListener('click', () => {
            const birth = new Date(document.getElementById('birthDate').value);
            const now = new Date();

            const ageEl = document.getElementById('ageResult');

            if (isNaN(birth)) {
                ageEl.innerText = "Vennligst skriv inn en gyldig dato.";
                return;
            }

            const diffMs = now - birth;
            const ageInYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
            const ageRounded = Math.floor(ageInYears * 10) / 10;
            const years = Math.floor(ageInYears);
            const months = Math.floor((ageInYears - years) * 12);

            ageEl.innerText = `Omtrent ${ageRounded} år (${years} år og ${months} måneder).`;
            });
        }

  // 📆 Dato-diff
    const diffBtn = document.getElementById('dateDiffButton');
    if (diffBtn) {
        diffBtn.addEventListener('click', () => {
            const d1 = new Date(document.getElementById('date1').value);
            const d2 = new Date(document.getElementById('date2').value);

            const diffMs = Math.abs(d2 - d1);
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            let years = d2.getFullYear() - d1.getFullYear();
            let months = d2.getMonth() - d1.getMonth();
            if (months < 0) {
                years--;
                months += 12;
            }

            const el = document.getElementById('dateDiffResult');
            if (el) {
                el.innerHTML = `Forskjell: ${diffDays} dager<br>(${years} år og ${months} måneder)`;
            }
            });
        }

    // ⏰ Tid-diff
    const timeBtn = document.getElementById('timeDiffButton');
    if (timeBtn) {
        timeBtn.addEventListener('click', () => {
            const t1 = document.getElementById('time1').value;
            const t2 = document.getElementById('time2').value;

            if (!t1 || !t2) return; // sjekk at begge er fylt inn

            // split "HH:MM"
            const [h1, m1] = t1.split(":").map(Number);
            const [h2, m2] = t2.split(":").map(Number);

            // gjør om til minutter siden midnatt
            const total1 = h1 * 60 + m1;
            const total2 = h2 * 60 + m2;

            // absolutt differanse
            const diffMinutes = Math.abs(total2 - total1);
            const hours = Math.floor(diffMinutes / 60);
            const minutes = diffMinutes % 60;

            const el = document.getElementById('timeDiffResult');
            if (el) {
                el.innerHTML = `Forskjell: ${hours} timer og ${minutes} minutter`;
            }
        });
    }


  // 🌍 Tidssoner
        const tzBtn = document.getElementById('timezoneButton');
        if (tzBtn) {
            tzBtn.addEventListener('click', () => {
                const tzSelect = document.getElementById('timezoneSelect');
                const tzId = tzSelect.value;
                const tzLabel = tzSelect.options[tzSelect.selectedIndex].text;

                const el = document.getElementById('timezoneResult');
                try {
                    const now = new Date().toLocaleString("nb-NO", { timeZone: tzId });
                    el.innerText = `Tid i ${tzLabel}: ${now}`;
                } catch {
                    el.innerText = `Ugyldig tidssone`;
                }
                });
            }

  // ⏱️ Minutter til timer/dager
    const minutesBtn = document.getElementById('minutesButton');
    if (minutesBtn) {
        minutesBtn.addEventListener('click', () => {
            const mins = parseFloat(document.getElementById('minutesInput').value);
            const hours = (mins / 60).toFixed(2);
            const days = (mins / 60 / 24).toFixed(2);
            const el = document.getElementById('minutesResult');
            if (el) el.innerText = `${mins} minutter ≈ ${hours} timer ≈ ${days} dager`;
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
                currentInput = "";
                calcDisplay.value = "";
            } else if (button.id === "equals") {
                try {
                currentInput = eval(currentInput).toString();
                calcDisplay.value = currentInput;
                } catch {
                calcDisplay.value = "Error";
                currentInput = "";
                }
            } else {
                currentInput += value;
                calcDisplay.value = currentInput;
            }
        });
    });

  // 💱 Valutakalkulator
    const convertBtn = document.getElementById("convertBtn");
    if (convertBtn) {
        convertBtn.addEventListener("click", async () => {
            console.log("👉 Knapp trykket");

            const amount = document.getElementById("amount").value;
            const currency = document.getElementById("currency").value;
            console.log("Beløp (NOK):", amount, "Valgt valuta:", currency);

            if (!amount || amount <= 0) {
                document.getElementById("result").innerText = "Skriv inn et gyldig beløp!";
                console.log("⚠️ Feil: ugyldig beløp");
                return;
            }

            try {
                console.log("🔄 Henter data fra API...");
                const res = await fetch(`https://api.frankfurter.app/latest?from=NOK&to=${currency}`);
                const data = await res.json();
                console.log("✅ API-respons:", data);

                const rate = data.rates[currency];
                const converted = (amount * rate).toFixed(2);
                console.log(`Utregning: ${amount} NOK = ${converted} ${currency}`);

                document.getElementById("result").innerText =
                    `${amount} NOK = ${converted} ${currency}`;
            } catch (error) {
                console.error("❌ API-feil:", error);
                document.getElementById("result").innerText = "Kunne ikke hente valutakurs";
            }
            });
        }

    async function getDailyQuote() {
        try {
            let res = await fetch("https://zenquotes.io/api/today");
            let data = await res.json();

            let quote = data[0].q;
            let author = data[0].a;
            document.getElementById("quoteResult").innerText = `"${quote}" — ${author}`;
        } catch (err) {
            document.getElementById("quoteResult").innerText = "Klarte ikke hente dagens quote 😅";
        }
    }

    // henter dagens quote med en gang siden lastes
    getDailyQuote();

    const idag = new Date();
    const day = String(idag.getDate()).padStart(2, '0');

    // Map månedstall til norsk månedsnavn
    const maneder = [
        "januar", "februar", "mars", "april", "mai", "juni",
        "juli", "august", "september", "oktober", "november", "desember"
    ];
    const monthNavn = maneder[idag.getMonth()]; // getMonth() er 0-basert

    // Lag filnavnet basert på månedsnavn
    const filNavn = `json-filer/${monthNavn}.json`;

    fetch(filNavn)
        .then(response => {
            if (!response.ok) throw new Error('Kunne ikke laste JSON-filen');
            return response.json();
        })
        .then(data => {
            const key = `${String(idag.getMonth() + 1).padStart(2,'0')}-${day}`; // "MM-DD"
            const dagensHendelse = data[key] || "Ingen historisk hendelse registrert for i dag.";
            document.getElementById("dagens").textContent = dagensHendelse;
        })
        .catch(error => {
            console.error(error);
            document.getElementById("dagens").textContent = "Kunne ikke laste dagens hendelse.";
        });

    const timerDisplay = document.getElementById("timeren");
    const countdownDisplay = document.getElementById("nedtelling");
    const minInput = document.getElementById("minInput");
    const sekInput = document.getElementById("sekInput");
    const startBtn = document.getElementById("startBtn");
    const stoppBtn = document.getElementById("stoppBtn");
    const resetBtn = document.getElementById("resetBtn");

    // TIMER
    let timerSekunder = 0;
    setInterval(() => {
        timerSekunder++;
        timerDisplay.textContent = formatTid(timerSekunder);
    }, 1000);

    // NEDTELLING
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

    // Event listeners
    startBtn.addEventListener("click", startNedtelling);
    stoppBtn.addEventListener("click", stoppNedtelling);
    resetBtn.addEventListener("click", resetNedtelling);

    oppdaterCountdown();
        

    async function getWeather() {
    try {
        const res = await fetch(
        "https://api.allorigins.win/get?url=" +
            encodeURIComponent("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.91&lon=10.75"),
        { headers: { "User-Agent": "MinEnkleNettside/1.0" } }
        );

        const wrappedData = await res.json();
        const data = JSON.parse(wrappedData.contents);
        const temp = data.properties.timeseries[0].data.instant.details.air_temperature;

        document.querySelector(".temp").textContent = temp + " °C";
    } catch (err) {
        document.querySelector(".temp").textContent = "Klarte ikke hente værdata 😢";
        console.error(err);
    }
    }

    getWeather();


    });
