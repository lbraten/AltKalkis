document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("omCity");
  const searchCityBtn = document.getElementById("omSearchCityBtn");
  const cityResults = document.getElementById("omCityResults");
  const presetCitySelect = document.getElementById("omPresetCity");

  const latInput = document.getElementById("omLat");
  const lonInput = document.getElementById("omLon");
  const fetchBtn = document.getElementById("omFetchBtn");
  const myLocBtn = document.getElementById("omMyLocationBtn");

  const statusEl = document.getElementById("omStatus");
  const outputEl = document.getElementById("omOutput");

  // --- Helpers ---
  const setStatus = (msg) => (statusEl.textContent = msg);

  const fmt = (n, digits = 1) => {
    if (n === null || n === undefined || Number.isNaN(n)) return "—";
    return Number(n).toFixed(digits);
  };

  function renderWeather({ label, lat, lon, data }) {
    const cur = data.current || {};
    const daily = data.daily || {};
    const todayMax = Array.isArray(daily.temperature_2m_max) ? daily.temperature_2m_max[0] : null;
    const todayMin = Array.isArray(daily.temperature_2m_min) ? daily.temperature_2m_min[0] : null;
    const precipProb = Array.isArray(daily.precipitation_probability_max)
      ? daily.precipitation_probability_max[0]
      : null;

    // Open-Meteo har "weather_code" som variabel; vi viser bare koden (du kan mappe til tekst senere). [3](https://open-meteo.com/en/docs)
    outputEl.innerHTML = `
      <div>
        <p style="margin:0;"><strong>${label}</strong></p>
        <p style="margin:6px 0 0 0; opacity:.85;">
          Koordinater: ${fmt(lat, 4)}, ${fmt(lon, 4)}
        </p>

        <hr style="opacity:.2; margin:10px 0;" />

        <p style="margin:0;"><strong>Nå</strong></p>
        <p style="margin:6px 0 0 0;">
          Temperatur: ${fmt(cur.temperature_2m)}°C
          • Føles som: ${fmt(cur.apparent_temperature)}°C
          • Vind: ${fmt(cur.wind_speed_10m)} m/s
        </p>
        <p style="margin:6px 0 0 0;">
          Værkode: ${cur.weather_code ?? "—"}
          • Tid: ${cur.time ?? "—"}
        </p>

        <hr style="opacity:.2; margin:10px 0;" />

        <p style="margin:0;"><strong>I dag</strong></p>
        <p style="margin:6px 0 0 0;">
          Min: ${fmt(todayMin)}°C • Maks: ${fmt(todayMax)}°C
          • Nedbørssjanse (maks): ${precipProb ?? "—"}%
        </p>
      </div>
    `;
  }

  async function fetchForecast(lat, lon, label = "Valgt sted") {
    // Forecast API (dokumentert her): https://api.open-meteo.com/v1/forecast … [3](https://open-meteo.com/en/docs)
    // Vi ber om "current" + "daily" variabler.
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${encodeURIComponent(lat)}` +
      `&longitude=${encodeURIComponent(lon)}` +
      `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&timezone=Europe%2FOslo`;

    setStatus("Henter værdata…");
    outputEl.innerHTML = `<p style="margin:0;">Laster…</p>`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Vær-API feil: ${res.status} ${res.statusText}`);
    const data = await res.json();

    setStatus("Ferdig.");
    renderWeather({ label, lat, lon, data });
    document.dispatchEvent(
      new CustomEvent("open-meteo:forecast", {
        detail: { lat, lon },
      })
    );
  }

  async function geocodeCity(name) {
    // Geocoding API endpoint og parametere er dokumentert her. [1](https://open-meteo.com/en/docs/geocoding-api)
    // Vi begrenser til Norge med countryCode=NO for mer presise treff. [1](https://open-meteo.com/en/docs/geocoding-api)
    const url =
      "https://geocoding-api.open-meteo.com/v1/search" +
      `?name=${encodeURIComponent(name)}` +
      `&count=10` +
      `&language=no` +
      `&format=json` +
      `&countryCode=NO`;

    setStatus("Søker etter by…");
    cityResults.hidden = true;
    cityResults.innerHTML = "";

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding feil: ${res.status} ${res.statusText}`);
    const data = await res.json();

    const results = data.results || [];
    if (!results.length) {
      setStatus("Fant ingen treff. Prøv et annet navn.");
      return null;
    }

    // Fyll dropdown med treff
    results.forEach((r, idx) => {
      const opt = document.createElement("option");
      const admin = [r.admin1, r.admin2, r.country].filter(Boolean).join(", ");
      opt.value = String(idx);
      opt.textContent = `${r.name}${admin ? " — " + admin : ""} (${fmt(r.latitude, 4)}, ${fmt(r.longitude, 4)})`;
      cityResults.appendChild(opt);
    });

    cityResults.hidden = false;
    setStatus(`Fant ${results.length} treff. Velg ett, eller hent direkte.`);

    // Returner første som “default”
    return results;
  }

  // --- Event handlers ---
  searchCityBtn.addEventListener("click", async () => {
    const name = (cityInput.value || "").trim();
    if (!name) {
      setStatus("Skriv inn et bynavn først.");
      return;
    }

    try {
      const results = await geocodeCity(name);
      if (!results) return;

      // Autopopuler lat/lon med første treff
      latInput.value = results[0].latitude;
      lonInput.value = results[0].longitude;
      cityResults.value = "0";
    } catch (err) {
      console.error(err);
      setStatus(`Feil: ${err.message}`);
    }
  });

  cityResults.addEventListener("change", () => {
    const idx = Number(cityResults.value);
    if (Number.isNaN(idx)) return;

    // Vi må hente “siste søk” igjen hvis du vil støtte endring uten lagring.
    // En enkel løsning: trigge nytt søk når man velger – men her bruker vi lat/lon-feltene.
    // Derfor: lat/lon blir satt når du klikker "Hent vær" etter å ha valgt.
    setStatus("Trykk «Hent vær» for valgt treff.");
  });

  if (presetCitySelect) {
    presetCitySelect.addEventListener("change", async () => {
      const opt = presetCitySelect.selectedOptions[0];
      if (!opt || !opt.dataset.lat || !opt.dataset.lon) return;

      const lat = Number(opt.dataset.lat);
      const lon = Number(opt.dataset.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

      latInput.value = lat;
      lonInput.value = lon;

      try {
        await fetchForecast(lat, lon, opt.value || "Valgt by");
      } catch (err) {
        console.error(err);
        setStatus(`Feil: ${err.message}`);
      }
    });
  }

  fetchBtn.addEventListener("click", async () => {
    const lat = Number(latInput.value);
    const lon = Number(lonInput.value);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      setStatus("Skriv inn gyldige koordinater (lat/lon).");
      return;
    }

    try {
      await fetchForecast(lat, lon, "Koordinater");
    } catch (err) {
      console.error(err);
      setStatus(`Feil: ${err.message}`);
    }
  });

  myLocBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation støttes ikke i denne nettleseren.");
      return;
    }

    setStatus("Henter posisjon…");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        latInput.value = lat;
        lonInput.value = lon;

        try {
          await fetchForecast(lat, lon, "Min posisjon");
        } catch (err) {
          console.error(err);
          setStatus(`Feil: ${err.message}`);
        }
      },
      (err) => {
        setStatus(`Kunne ikke hente posisjon: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
       );
  });
});
