(() => {
  const $ = (id) => document.getElementById(id);

  const hexInput = $("hexInput");
  const colorPicker = $("colorPicker");
  const schemeMode = $("schemeMode");
  const fetchBtn = $("hexFetchBtn");
  const statusEl = $("hexStatus");
  const infoEl = $("hexInfo");
  const paletteEl = $("palette");

  function setStatus(msg) {
    statusEl.textContent = msg;
  }

  function normalizeHex(raw) {
    if (!raw) return null;
    let h = String(raw).trim().replace(/^#/, "");

    // Tillat 3-tegns hex (#abc -> aabbcc)
    if (/^[0-9a-fA-F]{3}$/.test(h)) {
      h = h.split("").map((c) => c + c).join("");
    }

    if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
    return h.toUpperCase();
  }

  async function fetchColorInfo(hex6) {
    // /id endpoint: Get Color GET /id{?hex,...} [1](https://www.thecolorapi.com/docs)
    const url = `https://www.thecolorapi.com/id?hex=${hex6}&format=json`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`ID HTTP ${res.status}`);
    return res.json();
  }

  async function fetchScheme(hex6, mode, count = 5) {
    // /scheme endpoint: Get Scheme GET /scheme{?hex,...,mode,count} [1](https://www.thecolorapi.com/docs)
    const url = `https://www.thecolorapi.com/scheme?hex=${hex6}&mode=${encodeURIComponent(mode)}&count=${count}&format=json`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`SCHEME HTTP ${res.status}`);
    return res.json();
  }

  function renderInfo(data) {
    // Responsen inneholder bl.a. name.value, rgb.value, hsl.value, cmyk.value, contrast.value [1](https://www.thecolorapi.com/docs)
    const name = data?.name?.value ?? "Ukjent";
    const hex = data?.hex?.value ?? "#??????";
    const rgb = data?.rgb?.value ?? "—";
    const hsl = data?.hsl?.value ?? "—";
    const cmyk = data?.cmyk?.value ?? "—";
    const contrast = data?.contrast?.value ?? "#000000";

    infoEl.innerHTML = `
      <div class="label">Navn</div><div>${name}</div>
      <div class="label">HEX</div><div>${hex}</div>
      <div class="label">RGB</div><div>${rgb}</div>
      <div class="label">HSL</div><div>${hsl}</div>
      <div class="label">CMYK</div><div>${cmyk}</div>
      <div class="label">Kontrast</div><div>${contrast}</div>
    `;
    infoEl.hidden = false;
  }

  function renderPalette(colors) {
    paletteEl.innerHTML = "";

    for (const c of colors) {
      const hex = c?.hex?.value ?? "#000000";
      const name = c?.name?.value ?? "";
      const textColor = c?.contrast?.value ?? "#000000"; // best-contrast i respons [1](https://www.thecolorapi.com/docs)

      const sw = document.createElement("div");
      sw.className = "swatch";
      sw.style.background = hex;
      sw.style.color = textColor;

      sw.innerHTML = `
        <div class="name">${name}</div>
        <div class="hex">${hex}</div>
      `;

      sw.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(hex);
          setStatus(`Kopierte ${hex} ✅`);
        } catch {
          // fallback hvis clipboard ikke er tilgjengelig
          const tmp = document.createElement("textarea");
          tmp.value = hex;
          document.body.appendChild(tmp);
          tmp.select();
          document.execCommand("copy");
          tmp.remove();
          setStatus(`Kopierte ${hex} ✅`);
        }
      });

      paletteEl.appendChild(sw);
    }
  }

  async function loadFromHex(rawHex) {
    const hex6 = normalizeHex(rawHex);
    if (!hex6) {
      setStatus("Ugyldig hex. Bruk f.eks. #0df2d7 eller 0df2d7.");
      return;
    }

    setStatus("Henter data…");
    infoEl.hidden = true;

    // Synk fargepicker + input
    const hexWithHash = `#${hex6}`;
    colorPicker.value = hexWithHash;
    hexInput.value = hexWithHash;

    try {
      const [info, scheme] = await Promise.all([
        fetchColorInfo(hex6),
        fetchScheme(hex6, schemeMode.value, 5),
      ]);

      renderInfo(info);
      renderPalette(scheme?.colors ?? []);
      setStatus("Ferdig.");
    } catch (err) {
      console.error(err);
      setStatus("Feil ved henting (nettverk/API). Sjekk Console.");
    }
  }

  function wireUp() {
    // Default
    if (!hexInput.value) hexInput.value = "#0df2d7";

    fetchBtn.addEventListener("click", () => loadFromHex(hexInput.value));

    // Enter i input
    hexInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") loadFromHex(hexInput.value);
    });

    // Når du velger i color picker
    colorPicker.addEventListener("input", () => loadFromHex(colorPicker.value));

    // Når du bytter mode
    schemeMode.addEventListener("change", () => loadFromHex(hexInput.value));

    // Første load
    loadFromHex(hexInput.value);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireUp);
  } else {
    wireUp();
  }
})();
``
