// Dagens dato og tid
function updateDateTime() {
    const now = new Date();
    document.getElementById('currentDateTime').innerText = now.toLocaleString();
}
setInterval(updateDateTime, 1000);

// Prosentkalkulator
document.getElementById('percentButton').addEventListener('click', () => {
    const value = parseFloat(document.getElementById('percentValue').value);
    const percent = parseFloat(document.getElementById('percentPercent').value);
  document.getElementById('percentResult').innerText = (value * percent / 100).toFixed(2);
});

// Timeslønn fra månedslønn
document.getElementById('hourlyButton').addEventListener('click', () => {
    const salary = parseFloat(document.getElementById('monthlySalary').value);
    const hours = parseFloat(document.getElementById('hoursPerWeek').value);
  const yearlyHours = hours * 52;
  const hourly = (salary * 12 / yearlyHours).toFixed(2);
    document.getElementById('hourlyResult').innerText = `Timeslønn: ${hourly} kr/t`;
});

// Alderskalkulator
document.getElementById('ageButton').addEventListener('click', () => {
    const birth = new Date(document.getElementById('birthDate').value);
    const now = new Date();
    const diff = now - birth;
    const ageDate = new Date(diff);
    const years = ageDate.getUTCFullYear() - 1970;
    document.getElementById('ageResult').innerText = `Du er ca. ${years} år gammel.`;
});

// Differanse mellom datoer
document.getElementById('dateDiffButton').addEventListener('click', () => {
    const d1 = new Date(document.getElementById('date1').value);
    const d2 = new Date(document.getElementById('date2').value);
    const diffMs = Math.abs(d2 - d1);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    document.getElementById('dateDiffResult').innerText = `Forskjell: ${diffDays} dager`;
});

// Tidssoner (enkel)
document.getElementById('timezoneButton').addEventListener('click', () => {
    const tz = document.getElementById('timezone').value;
    try {
    const now = new Date().toLocaleString("en-US", { timeZone: tz });
    document.getElementById('timezoneResult').innerText = `Tid i ${tz}: ${now}`;
    } catch {
    document.getElementById('timezoneResult').innerText = `Ugyldig tidssone`;
    }
});

// Minutter → timer/dager
document.getElementById('minutesButton').addEventListener('click', () => {
    const mins = parseFloat(document.getElementById('minutesInput').value);
    const hours = (mins / 60).toFixed(2);
    const days = (mins / 60 / 24).toFixed(2);
    document.getElementById('minutesResult').innerText = `${mins} minutter ≈ ${hours} timer ≈ ${days} dager`;
});
