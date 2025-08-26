// Minimal Rainbet proxy for Railway (Node 20+)
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
const RAINBET_KEY = process.env.RAINBET_KEY; // set in Railway Variables

app.get("/api/leaderboard", async (req, res) => {
  try {
    const { start_at, end_at } = req.query;
    if (!start_at || !end_at) {
      return res.status(400).json({ error: "Missing start_at or end_at" });
    }
    if (!RAINBET_KEY) {
      return res.status(500).json({ error: "RAINBET_KEY not set on server" });
    }

    const url = `https://services.rainbet.com/v1/external/affiliates?start_at=${start_at}&end_at=${end_at}&key=${encodeURIComponent(RAINBET_KEY)}`;
    const upstream = await fetch(url, { cache: "no-store" });
    const text = await upstream.text();

    res.setHeader("Access-Control-Allow-Origin", "*"); // allow cross-origin
    res.type("application/json").send(text);
  } catch (err) {
    res.status(500).json({ error: "Proxy failed", details: String(err) });
  }
});

app.get("/health", (_, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Proxy listening on :${PORT}`));