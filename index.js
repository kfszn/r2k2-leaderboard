const API_KEY = "OjwJ62YWj7gveE0OkmkrCvRM4U3Omh16";
const BASE_URL = "https://services.rainbet.com/v1/external/affiliates";
const rewards = [100, 200, 50, 20, 15, 10, 5]; // You can adjust this
const top3Glows = ['0 0 40px #C0C0C0', '0 0 40px #FFD700', '0 0 40px #CD7F32'];
const rainbetLogo = '/assets/rainbetlogo.png';

// Auto-generate current leaderboard date range
function getDateRange() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const isBefore23rd = now.getUTCDate() < 23;

  const start = new Date(Date.UTC(year, month - (isBefore23rd ? 1 : 0), 23));
  const end = new Date(Date.UTC(year, month + (isBefore23rd ? 0 : 1), 22));

  const startStr = start.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);

  return { startStr, endStr };
}

function maskUsername(username) {
  if (!username || username.length <= 4) return username;
  return username.slice(0, 2) + "***" + username.slice(-2);
}

async function loadLeaderboard() {
  const { startStr, endStr } = getDateRange();
  const apiURL = `${BASE_URL}?start_at=${startStr}&end_at=${endStr}&key=${API_KEY}`;

  try {
    const res = await fetch(apiURL);
    const json = await res.json();
    const data = json.affiliates || [];

    const top3Container = document.querySelector(".css-gqrafh");
    const rowsContainer = document.getElementById("leaderboard-rows");
    top3Container.innerHTML = '';
    rowsContainer.innerHTML = '';

    const sorted = data.sort((a, b) => b.wagered_amount - a.wagered_amount);
    const top10 = sorted.slice(0, 10);

    top10.forEach((entry, index) => {
      const place = index + 1;
      const username = maskUsername(entry.username);
      const wagered = `$ ${parseFloat(entry.wagered_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
      const reward = index < rewards.length ? `$ ${rewards[index]}` : '$ 0';

      if (index < 3) {
        const card = document.createElement('div');
        card.className = 'css-jehefp';
        card.style.boxShadow = top3Glows[index];
        card.style.position = 'relative';
        if (index === 1) card.style.transform = 'translateY(25px) scale(1.2)';
        if (index === 2) card.style.transform = 'translateY(25px)';
        card.innerHTML = `
          <img src="${rainbetLogo}" style="width: 96px; height: auto; border-radius: 12px;">
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
            <img src="${rainbetLogo}" width="22" style="margin-right: 8px;">
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
    console.error("❌ Failed to load leaderboard:", err.message);
  }
}

// Run on load
loadLeaderboard();