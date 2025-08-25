document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM er lastet");

  // 🔄 Dato og tid
    function updateDateTime() {
        const now = new Date();
        const el = document.getElementById('currentDateTime');
        if (el) el.innerText = now.toLocaleString();
    }
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
                const res = await fetch(`https://api.exchangerate.host/latest?base=NOK&symbols=${currency}`);
                const data = await res.json();
                console.log("✅ API-respons:", data);

                const rate = data.rates[currency];
                const converted = (amount * rate).toFixed(2);
                console.log(`Utregning: ${amount} NOK = ${converted} ${currency}`);

                document.getElementById("result").innerText =
                    `${amount} NOK = ${converted} ${currency}`;
            } catch (error) {
                console.error("❌ API-feil:", error);
                document.getElementById("result").innerText = "Kunne ikke hente valutakurs 😅";
            }
            });
        }
    });
