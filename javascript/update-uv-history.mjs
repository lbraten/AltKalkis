import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const UV_FILE = resolve(process.cwd(), "data", "uv-history.json");
const MAX_DAYS = 365 * 6;
const LOCATIONS = [
  { name: "Oslo", lat: 59.9139, lon: 10.7522 },
  { name: "Bergen", lat: 60.3913, lon: 5.3221 },
  { name: "Trondheim", lat: 63.4305, lon: 10.3951 },
  { name: "Stavanger", lat: 58.969, lon: 5.7331 },
  { name: "Tromsø", lat: 69.6492, lon: 18.9553 },
];

const toLocationKey = (lat, lon) => `${Number(lat).toFixed(4)},${Number(lon).toFixed(4)}`;

const formatDateYmd = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const readJsonSafe = async (filePath, fallback) => {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const fetchUvSeries = async (lat, lon) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setUTCDate(startDate.getUTCDate() - MAX_DAYS);
  const startDateKey = formatDateYmd(startDate);
  const endDateKey = formatDateYmd(today);

  const archiveUrl =
    "https://archive-api.open-meteo.com/v1/archive" +
    `?latitude=${encodeURIComponent(lat)}` +
    `&longitude=${encodeURIComponent(lon)}` +
    `&start_date=${startDateKey}` +
    `&end_date=${endDateKey}` +
    "&daily=uv_index_max" +
    "&timezone=Europe%2FOslo";

  const forecastUrl =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${encodeURIComponent(lat)}` +
    `&longitude=${encodeURIComponent(lon)}` +
    "&daily=uv_index_max" +
    "&past_days=30" +
    "&forecast_days=1" +
    "&timezone=Europe%2FOslo";

  const [archiveRes, forecastRes] = await Promise.all([fetch(archiveUrl), fetch(forecastUrl)]);
  if (!archiveRes.ok) throw new Error(`Archive HTTP ${archiveRes.status}`);
  if (!forecastRes.ok) throw new Error(`Forecast HTTP ${forecastRes.status}`);

  const archiveData = await archiveRes.json();
  const forecastData = await forecastRes.json();
  const merged = {};

  const archiveDays = archiveData?.daily?.time || [];
  const archiveValues = archiveData?.daily?.uv_index_max || [];
  archiveDays.forEach((day, idx) => {
    const value = archiveValues[idx];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return;
    if (!Number.isFinite(value)) return;
    merged[day] = value;
  });

  const forecastDays = forecastData?.daily?.time || [];
  const forecastValues = forecastData?.daily?.uv_index_max || [];
  forecastDays.forEach((day, idx) => {
    const value = forecastValues[idx];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return;
    if (!Number.isFinite(value)) return;
    merged[day] = value;
  });

  const days = Object.keys(merged).sort();
  const values = days.map((day) => merged[day]);
  return { days, values };
};

const pruneOldDays = (valuesObj) => {
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - MAX_DAYS);
  const cutoffKey = formatDateYmd(cutoff);
  const pruned = {};

  Object.keys(valuesObj)
    .sort()
    .forEach((day) => {
      const value = valuesObj[day];
      if (day < cutoffKey) return;
      if (!Number.isFinite(value)) return;
      pruned[day] = value;
    });

  return pruned;
};

async function main() {
  const doc = await readJsonSafe(UV_FILE, {
    updatedAt: null,
    source: "open-meteo-archive+forecast-daily-uv-index-max",
    locations: {},
  });

  if (!doc.locations || typeof doc.locations !== "object") {
    doc.locations = {};
  }

  doc.source = "open-meteo-archive+forecast-daily-uv-index-max";

  let successCount = 0;

  for (const location of LOCATIONS) {
    const key = toLocationKey(location.lat, location.lon);
    const existing =
      doc.locations[key] && typeof doc.locations[key] === "object"
        ? doc.locations[key]
        : {};

    try {
      const { days, values } = await fetchUvSeries(location.lat, location.lon);
      const merged = { ...existing };

      days.forEach((day, idx) => {
        const value = values[idx];
        if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return;
        if (!Number.isFinite(value)) return;
        merged[day] = value;
      });

      doc.locations[key] = pruneOldDays(merged);
      successCount += 1;
    } catch (error) {
      console.warn(`UV update failed for ${location.name}: ${error.message}`);
      doc.locations[key] = pruneOldDays(existing);
    }
  }

  doc.updatedAt = new Date().toISOString();
  await writeFile(UV_FILE, `${JSON.stringify(doc, null, 2)}\n`, "utf8");

  if (successCount === 0) {
    throw new Error("No UV locations were updated.");
  }

  console.log(`UV history updated for ${successCount}/${LOCATIONS.length} locations.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
