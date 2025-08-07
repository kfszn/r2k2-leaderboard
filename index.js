import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = "OjwJ62YWj7gveE0OkmkrCvRM4U3Omh16";

let cachedData = [];

// CORS setup
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Mask usernames
function maskUsername(username) {
  if (!username || username.length <= 4) return username || "anon";
  return username.slice(0, 2) + "***" + username.slice(-2);
}

// Dynamic API URL for current 30-day period (23rd to 22nd)
function getCurrentApiUrl() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const currentDay = now.getUTCDate();

  const startMonth = currentDay < 23 ? month - 1 : month;
  const endMonth = currentDay < 23 ? month : month + 1;

  const start = new Date(Date.UTC(year, startMonth, 23)).toISOString().split("T")[0];
  const end = new Date(Date.UTC(year, endMonth, 22)).toISOString().split("T")[0];

  return `https://services.rainbet.com/v1/external/affiliates?start_at=${start}&end_at=${end}&key=${API_KEY}`;
}

// Fetch and cache current leaderboard
async function fetchAndCacheData() {
  try {
    const res = await fetch(getCurrentApiUrl());
    const json = await res.json();

    if (!json.affiliates) throw new Error("No affiliates found");

    const sorted = json.affiliates.sort(
      (a, b) => parseFloat(b.wagered_amount) - parseFloat(a.wagered_amount)
    );

    const top10 = sorted.slice(0, 10);

    cachedData = top10.map(entry => ({
      username: maskUsername(entry.username),
      wagered: parseFloat(entry.wagered_amount).toFixed(2),
    }));

    console.log("[✅] Cached leaderboard data.");
  } catch (err) {
    console.error("[❌] Fetch error:", err.message);
  }
}

// Run immediately and every 5 minutes
fetchAndCacheData();
setInterval(fetchAndCacheData, 5 * 60 * 1000);

// Main route
app.get("/leaderboard/top10", (req, res) => {
  res.json(cachedData);
});

// Previous period route (for manual toggle)
app.get("/leaderboard/prev", async (req, res) => {
  try {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const currentDay = now.getUTCDate();

    const startMonth = currentDay < 23 ? month - 2 : month - 1;
    const endMonth = currentDay < 23 ? month - 1 : month;

    const start = new Date(Date.UTC(year, startMonth, 23)).toISOString().split("T")[0];
    const end = new Date(Date.UTC(year, endMonth, 22)).toISOString().split("T")[0];

    const url = `https://services.rainbet.com/v1/external/affiliates?start_at=${start}&end_at=${end}&key=${API_KEY}`;
    const resData = await fetch(url);
    const json = await resData.json();

    if (!json.affiliates) throw new Error("No previous data");

    const sorted = json.affiliates.sort(
      (a, b) => parseFloat(b.wagered_amount) - parseFloat(a.wagered_amount)
    );

    const top10 = sorted.slice(0, 10);

    const data = top10.map(entry => ({
      username: maskUsername(entry.username),
      wagered: parseFloat(entry.wagered_amount).toFixed(2),
    }));

    res.json(data);
  } catch (err) {
    console.error("[❌] Previous fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch previous leaderboard" });
  }
});

// Self-ping for Render
setInterval(() => {
  fetch("https://r2k2-leaderboard.onrender.com/leaderboard/top10")
    .then(() => console.log("[🔁] Self-ping success"))
    .catch(err => console.error("[⚠️] Self-ping error:", err.message));
}, 4.5 * 60 * 1000);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));