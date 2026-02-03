const OPENFIGI_KEY = process.env.OPENFIGI_KEY;

exports.handler = async (event) => {
  try {
    const isin = event.queryStringParameters?.isin;
    if (!isin) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing isin" }) };
    }

    if (!OPENFIGI_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: "OPENFIGI_KEY not set" }) };
    }

    const url = "https://api.openfigi.com/v3/mapping";
    const body = [{
      idType: "ID_ISIN",
      idValue: isin,
      // exchCode: "OSE",
    }];

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-OPENFIGI-APIKEY": OPENFIGI_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ error: `OpenFIGI HTTP ${res.status}` }) };
    }

    const json = await res.json();
    const data = json?.[0]?.data || [];
    if (!data.length) {
      return { statusCode: 404, body: JSON.stringify({ error: `No symbol for ISIN ${isin}` }) };
    }

    const withTicker = data.find((x) => x.ticker) || data[0];
    const symbol = withTicker.ticker || withTicker.name || isin;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err?.message || "Server error" }) };
  }
};
