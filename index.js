const API_KEY = "OjwJ62YWj7gveE0OkmkrCvRM4U3Omh16";
const START_DATE = "2025-07-23";
const END_DATE = "2025-08-22";
const API_URL = `https://services.rainbet.com/v1/external/affiliates?start_at=${START_DATE}&end_at=${END_DATE}&key=${API_KEY}`;
const rewards = [200, 100, 50, 20, 15, 10, 5];

function maskUsername(username) {
  if (!username) return "anon";
  if (username.length <= 4) return username;
  return username.slice(0, 2) + "***" + username.slice(-2);
}

async function loadLeaderboard() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    const entries = json.affiliates
      .filter(entry => entry.wagered_amount && entry.username)
      .sort((a, b) => b.wagered_amount - a.wagered_amount)
      .slice(0, 10);

    const top3Container = document.getElementById("top3-cards");
    const rowsContainer = document.getElementById("leaderboard-rows");
    top3Container.innerHTML = "";
    rowsContainer.innerHTML = "";

    const top3Glows = ["0 0 40px #FFD700", "0 0 40px #C0C0C0", "0 0 40px #CD7F32"];

    entries.forEach((entry, i) => {
      const username = maskUsername(entry.username);
      const wagered = `$ ${parseFloat(entry.wagered_amount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
      const reward = i < rewards.length ? `$ ${rewards[i]}` : "$ 0";

      if (i < 3) {
        const card = document.createElement("div");
        card.className = "css-jehefp";
        card.style.boxShadow = top3Glows[i];
        if (i === 1) card.style.transform = "translateY(25px) scale(1.2)";
        if (i === 2) card.style.transform = "translateY(25px)";
        card.innerHTML = `
          <img src="/assets/rainbetlogo.png" style="width: 96px; height: auto; border-radius: 12px;">
          <div class="css-hca0vm"><span class="css-15a1lq3" style="font-weight:bold;">${username}</span></div>
          <div class="css-7ahevu ejrykqo0"><span class="css-1vqddgv">Wagered: </span>
            <span class="css-18icuxn"><div class="css-1y0ox2o"><span class="css-114dvlx">${wagered}</span></div></span>
          </div>
          <span class="css-v4675v"><div class="css-1y0ox2o"><span class="css-114dvlx glow">${reward}</span></div></span>
        `;
        top3Container.appendChild(card);
      } else {
        const row = document.createElement("div");
        row.className = "row list row-cols-5";
        row.innerHTML = `
          <div class="hide-mobile col-2"><b style="font-size: 18px;">#${i + 1}</b></div>
          <div class="col-5">
            <img src="/assets/rainbetlogo.png" width="22" style="margin-right: 8px;">
            <span style="font-weight:bold; font-size: 16px;">${username}</span>
          </div>
          <div class="col-2">
            <div class="price-wrapper glow" style="font-weight:bold; font-size: 15px;">${reward}</div>
          </div>
          <div class="col-3">
            <div class="price-wrapper" style="color: #FFF; font-weight:bold; font-size: 15px;">${wagered}</div>
          </div>
        `;
        const wrapper = document.createElement("div");
        wrapper.className = "leaderboard-row-wrapper";
        wrapper.appendChild(row);
        rowsContainer.appendChild(wrapper);
      }
    });
  } catch (err) {
    console.error("Leaderboard error:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadLeaderboard);
