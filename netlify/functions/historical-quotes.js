const LEEWAY_TOKEN = process.env.LEEWAY_TOKEN;
const LEEWAY_BASE = "https://api.leeway.tech/api/v1/public";

exports.handler = async (event) => {
  try {
    const symbol = event.queryStringParameters?.symbol;
    if (!symbol) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing symbol" }) };
    }

    if (!LEEWAY_TOKEN) {
      return { statusCode: 500, body: JSON.stringify({ error: "LEEWAY_TOKEN not set" }) };
    }

    const url = `${LEEWAY_BASE}/historicalquotes/${encodeURIComponent(symbol)}?apitoken=${encodeURIComponent(LEEWAY_TOKEN)}`;
    const res = await fetch(url);
    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ error: `Leeway HTTP ${res.status}` }) };
    }

    const json = await res.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err?.message || "Server error" }) };
  }
};
