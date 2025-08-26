/* === R2K2 Rainbet Leaderboard Script ===
   - Cycle: 18th → 18th (monthly)
   - Example: If today is Aug 26 → current cycle = Aug 18 → Sep 18
*/

const RAINBET_KEY = "OjwJ62YWj7gveE0OkmkrCvRM4U3Omh16";  // your Rainbet affiliate key
const rewards = [200, 100, 50, 20, 15, 10, 5];
const START_DAY = 18;
const END_DAY = 18;

function maskUsername(username) {
  if (!username) return "Unknown";
  if (username.length <= 4) return username;
  return username.slice(0, 2) + "***" + username.slice(-2);
}

function formatWagered(amount) {
  return `$${Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/* cycle logic: 18th → 18th */
function getCycleDates() {
  const now = new Date();

  // compute end date = 18th of *next* month at 23:59:59
  let end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), END_DAY, 23, 59, 59, 999));
  if (now > end) {
    end.setUTCMonth(end.getUTCMonth() + 1, END_DAY);
  }

  // start date = 18th of the month before the end date at 00:00:00
  const start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - 1, START_DAY, 0, 0, 0, 0));

  const fmt = (d) => d.toISOString().slice(0, 10);
  return { startISO: fmt(start), endISO: fmt(end), endDate: end };
}

function updateCountdown(endDate) {
  const el = document.getElementById("countdown");
  function tick() {
    const diff = endDate - new Date();
    if (diff <= 0) {
      el.textContent = "Ended";
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.textContent = `${d}d ${h}h ${m}m ${s}s`;
  }
  tick();
  setInterval(tick, 1000);
}

function renderLeaderboard(data) {
  const top3 = document.getElementById("top3-cards");
  const rows = document.getElementById("leaderboard-rows");
  top3.innerHTML = "";
  rows.innerHTML = "";

  data.forEach((entry, idx) => {
    const place = idx + 1;
    const username = maskUsername(entry.username);
    const wagered = formatWagered(entry.wagered_amount);
    const reward = idx < rewards.length ? `$${rewards[idx]}` : "$0";

    if (idx < 3) {
      const card = document.createElement("div");
      card.className = "css-jehefp";
      card.style.boxShadow = ["0 0 40px #C0C0C0", "0 0 40px #FFD700", "0 0 40px #CD7F32"][idx];
      card.innerHTML = `
        <img src="assets/rainbetlogo.png" style="width:96px;height:auto;border-radius:12px;">
        <div><span style="font-weight:bold;">${username}</span></div>
        <div>Wagered: ${wagered}</div>
        <div class="reward">${reward}</div>
      `;
      top3.appendChild(card);
    } else {
      const row = document.createElement("div");
      row.className = "leaderboard-row";
      row.innerHTML = `
        <div class="rank">#${place}</div>
        <div class="username">${username}</div>
        <div class="wagered">${wagered}</div>
        <div class="reward">${reward}</div>
      `;
      rows.appendChild(row);
    }
  });
}

async function fetchLeaderboard() {
  const { startISO, endISO, endDate } = getCycleDates();
  updateCountdown(endDate);

  const url = `https://services.rainbet.com/v1/external/affiliates?start_at=${startISO}&end_at=${endISO}&key=${encodeURIComponent(RAINBET_KEY)}`;
  const rows = document.getElementById("leaderboard-rows");

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} — ${text.slice(0, 200)}`);
    }
    const json = await res.json();
    const affiliates = (json && json.affiliates) || [];
    const sorted = affiliates
      .filter(u => Number(u.wagered_amount) > 0)
      .sort((a,b) => Number(b.wagered_amount) - Number(a.wagered_amount));
    renderLeaderboard(sorted.slice(0, 10));
  } catch (err) {
    console.error("Leaderboard error:", err);
    rows.innerHTML = `<p style="color:red;white-space:pre-wrap">
      Failed to load data.
      URL: ${url}
      Error: ${String(err)}
    </p>`;
  }
}

document.addEventListener("DOMContentLoaded", fetchLeaderboard);