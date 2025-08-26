// index.js for /leaderboard/rainbet

const API_URL = "https://services.rainbet.com/v1/external/affiliates?start_at=2025-08-18&end_at=2025-09-18&key=xxx";
const rewards = [200, 100, 50, 20, 15, 10, 5];

function maskUsername(username) {
  if (!username) return 'Unknown';
  if (username.length <= 4) return username;
  return username.slice(0, 2) + '***' + username.slice(-2);
}

function formatWagered(amount) {
  return `$${parseFloat(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function renderLeaderboard(data) {
  const top3Container = document.getElementById('top3-cards');
  const rowsContainer = document.getElementById('leaderboard-rows');

  top3Container.innerHTML = '';
  rowsContainer.innerHTML = '';

  data.forEach((entry, index) => {
    const place = index + 1;
    const username = maskUsername(entry.username);
    const wagered = formatWagered(entry.wagered_amount);
    const reward = index < rewards.length ? `$${rewards[index]}` : '$0';

    if (index < 3) {
      const card = document.createElement('div');
      card.className = 'css-jehefp';
      card.style.boxShadow = ['0 0 40px #C0C0C0', '0 0 40px #FFD700', '0 0 40px #CD7F32'][index];
      card.style.position = 'relative';
      if (index === 1) card.style.transform = 'translateY(25px) scale(1.2)';
      if (index === 2) card.style.transform = 'translateY(25px)';

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
      const row = document.createElement('div');
      row.className = 'row list row-cols-5';
      row.innerHTML = `
        <div class="hide-mobile col-2"><b style="font-size: 18px;">#${place}</b></div>
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
}

async function fetchLeaderboard() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    const affiliates = json.affiliates || [];

    const sorted = affiliates.filter(entry => parseFloat(entry.wagered_amount) > 0)
      .sort((a, b) => parseFloat(b.wagered_amount) - parseFloat(a.wagered_amount));

    const top10 = sorted.slice(0, 10);
    renderLeaderboard(top10);
  } catch (err) {
    console.error("[❌] Failed to fetch leaderboard:", err);
    document.getElementById("leaderboard-rows").innerHTML = "<p style='color:red;'>Failed to load data.</p>";
  }
}

document.addEventListener("DOMContentLoaded", fetchLeaderboard);
