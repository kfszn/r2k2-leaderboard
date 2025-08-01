export default async function handler(req, res) {
  // Optional: require a secret token for extra protection
  const AUTH_TOKEN = process.env.API_SECRET_TOKEN || "mysecret";
  if (req.headers.authorization !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const start_at = "2025-07-23"; // leaderboard start
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const end_at = `${yyyy}-${mm}-${dd}`;

  // ✅ API key is hidden in Vercel environment variables
  const apiKey = process.env.RAINBET_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key missing in environment" });
  }

  const url = `https://services.rainbet.com/v1/external/affiliates?start_at=${start_at}&end_at=${end_at}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Rainbet API error: ${response.status}`);
    
    const data = await response.json();
    res.status(200).json(data); // ✅ Send JSON to frontend

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leaderboard data" });
  }
}
