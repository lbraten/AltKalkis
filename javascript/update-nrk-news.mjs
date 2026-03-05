import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const OUT_FILE = resolve(process.cwd(), "data", "nrk-news.json");
const RSS_URL = "https://www.nrk.no/nyheter/siste.rss";
const MAX_ITEMS = 6;

const decodeXml = (value = "") =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const extractTag = (xml, tagName) => {
  const match = xml.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? decodeXml(match[1]) : "";
};

const parseItems = (xmlText) => {
  const itemMatches = xmlText.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  return itemMatches
    .map((itemXml) => {
      const title = extractTag(itemXml, "title");
      const link = extractTag(itemXml, "link");
      const category = extractTag(itemXml, "category") || "NRK Nyheter";
      const pubDate = extractTag(itemXml, "pubDate");

      return { title, link, category, pubDate };
    })
    .filter((item) => item.title && item.link)
    .slice(0, MAX_ITEMS);
};

async function fetchWithTimeout(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Alt-i-ett-Kalkulator/1.0 (+https://leabr.github.io/Alt-i-ett-Kalkulator/)",
        Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeoutId);
  }
}

async function main() {
  const xmlText = await fetchWithTimeout(RSS_URL);
  const items = parseItems(xmlText);

  if (!items.length) {
    throw new Error("Fant ingen gyldige nyheter i RSS-feed.");
  }

  const payload = {
    updatedAt: new Date().toISOString(),
    source: RSS_URL,
    items,
  };

  await writeFile(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Updated ${items.length} NRK news items in data/nrk-news.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
