
console.log("holidays.js lastet");

(() => {
  const container = document.getElementById("holidays");
  const title = document.getElementById("holidayTitle");

  const countryCode = "NO";
  const year = new Date().getFullYear();

  //nager.date endpoint: /api/v3/publicholidays/{year}/{countrycode}
  //(dokumentert i nager.date api / swagger)
  const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`;

  title.textContent = `Norske helligdager ${year}`;

  const formatDate = (isoDate) => {
    //isodate er typisk "yyyy-mm-dd" i responsen [1](https://date.nager.at/api)
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

      //sorter slik at neste helligdag ligger øverst (rullerende sortering)
      const todayIso = new Date().toISOString().slice(0, 10);
      holidays.sort((a, b) => a.date.localeCompare(b.date));
      const upcoming = holidays.filter(h => h.date >= todayIso);
      const past = holidays.filter(h => h.date < todayIso);
      const ordered = [...upcoming, ...past];
      const nextIndex = upcoming.length ? 0 : -1;

      if (!ordered.length) {
        container.innerHTML = `<p>Fant ingen helligdager for ${year}.</p>`;
        return;
      }

      const listItems = ordered.map((h, index) => {
        const dateText = formatDate(h.date);
        const local = escapeHtml(h.localName ?? "");
        const english = escapeHtml(h.name ?? "");
        const types = Array.isArray(h.types)
          ? h.types.filter((type) => type !== "Public").join(", ")
          : "";
        const isNext = index === nextIndex;

        return `
          <li class="holiday${isNext ? " holiday--next" : ""}">
            <div class="holiday__date">${escapeHtml(dateText)}</div>
            <div class="holiday__names">
              <strong class="holiday__local">${local}</strong>
              ${isNext ? `<span class="holiday__badge">Neste helligdag</span>` : ""}
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

  loadHolidays();
})();