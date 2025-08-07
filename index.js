const today = new Date();
const END_DATE = "2025-08-22"; // Fixed end date for the leaderboard
const START_DATE = new Date(today.setDate(today.getDate() - 30)).toISOString().split("T")[0];
const API_KEY = "OjwJ62YWj7gveE0OkmkrCvRM4U3Omh16"; // Move to backend proxy in production
const API_URL = `https://services.rainbet.com/v1/external/affiliates?start_at=${START_DATE}&end_at=${END_DATE}&key=${API_KEY}`;
const rewards = [200, 100, 50, 20, 15, 10, 5];
const top3Glows = ["0 0 40px #FFD700", "0 0 40px #C0C0C0", "0 0 40px #CD7F32"];

function maskUsername(username) {
  if (!username) return "anon";
  if (username.length <= 4) return username;
  return username.slice(0, 2) + "***" + username.slice(-2);
}

async function loadLeaderboard() {
  const top3Container = document.querySelector("#top3-cards, .css-gqrafh");
  const rowsContainer = document.getElementById("leaderboard-rows");
  const errorContainer = document.getElementById("leaderboard-error");

  if (!top3Container || !rowsContainer || !errorContainer) {
    console.error("Leaderboard containers missing");
    return;
  }

  top3Container.innerHTML = "<div>Loading leaderboard...</div>";
  rowsContainer.innerHTML = "";
  errorContainer.style.display = "none";

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
    const json = await res.json();
    console.log("API Response:", json);

    if (!json.affiliates || !Array.isArray(json.affiliates)) {
      throw new Error("Invalid API response format");
    }

    const entries = json.affiliates
      .filter(entry => entry.wagered_amount && entry.username)
      .sort((a, b) => parseFloat(b.wagered_amount) - parseFloat(a.wagered_amount))
      .slice(0, 10);

    if (entries.length === 0) {
      throw new Error("No leaderboard data available");
    }

    top3Container.innerHTML = "";
    rowsContainer.innerHTML = "";

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
        card.setAttribute("aria-label", `Leaderboard position ${i + 1}: ${username} with ${wagered}`);
        card.innerHTML = `
          <img src="/assets/rainbetlogo.png" style="width: 96px; height: auto; border-radius: 12px;" alt="Rainbet logo">
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
        row.setAttribute("aria-label", `Leaderboard position ${i + 1}: ${username} with ${wagered}`);
        row.innerHTML = `
          <div class="hide-mobile col-2"><b style="font-size: 18px;">#${i + 1}</b></div>
          <div class="col-5">
            <img src="/assets/rainbetlogo.png" width="22" style="margin-right: 8px;" alt="Rainbet logo">
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
    top3Container.innerHTML = "";
    errorContainer.textContent = `Failed to load leaderboard: ${err.message}. Please try again or contact Rainbet support.`;
    errorContainer.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", loadLeaderboard);