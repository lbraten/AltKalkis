
console.log("holidays.js lastet ✅");

(() => {
  const container = document.getElementById("holidays");
  const title = document.getElementById("holidayTitle");

  const countryCode = "NO";
  const year = new Date().getFullYear();

  // Nager.Date endpoint: /api/v3/PublicHolidays/{year}/{countryCode}
  // (Dokumentert i Nager.Date API / Swagger)
  const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`;

  title.textContent = `Norske helligdager ${year}`;

  const formatDate = (isoDate) => {
    // isoDate er typisk "YYYY-MM-DD" i responsen [1](https://date.nager.at/Api)
    const d = new Date(isoDate + "T00:00:00");
    return new Intl.DateTimeFormat("nb-NO", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(d);
  };

  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));

  async function loadHolidays() {
    container.innerHTML = `<p>Laster helligdager for ${year}…</p>`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} – ${res.statusText}`);
      }

      /** @type {Array<{date:string, localName:string, name:string, types:string[]}>} */
      const holidays = await res.json();

      // Sortér etter dato (ISO-format gjør dette enkelt)
      holidays.sort((a, b) => a.date.localeCompare(b.date));

      if (!holidays.length) {
        container.innerHTML = `<p>Fant ingen helligdager for ${year}.</p>`;
        return;
      }

      const listItems = holidays.map(h => {
        const dateText = formatDate(h.date);
        const local = escapeHtml(h.localName ?? "");
        const english = escapeHtml(h.name ?? "");
        const types = Array.isArray(h.types) ? h.types.join(", ") : "";

        return `
          <li class="holiday">
            <div class="holiday__date">${escapeHtml(dateText)}</div>
            <div class="holiday__names">
              <strong class="holiday__local">${local}</strong>
              ${english && english !== local ? `<span class="holiday__en">(${english})</span>` : ""}
            </div>
            ${types ? `<div class="holiday__types">${escapeHtml(types)}</div>` : ""}
          </li>
        `;
      }).join("");

      container.innerHTML = `
        <ul class="holidayList">
          ${listItems}
        </ul>
        <small class="source">
          Kilde: Nager.Date PublicHolidays API
        </small>
      `;
    } catch (err) {
      container.innerHTML = `
        <div class="error">
          <p><strong>Kunne ikke hente helligdager.</strong></p>
          <p>${escapeHtml(err.message)}</p>
          <p>Sjekk nettverk/URL eller prøv igjen senere.</p>
        </div>
      `;
      console.error(err);
    }
   }

  loadHolidays();})