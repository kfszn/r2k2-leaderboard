const API_URL = "https://r2k2data.onrender.com/leaderboard/top14"; // Replace with your actual API URL

const rewards = [200, 100, 50, 25, 15, 10, 5]; // top 7 rewards
const top3Glows = ['0 0 40px #C0C0C0', '0 0 40px #FFD700', '0 0 40px #CD7F32'];
const logo = '/assets/rainbetlogo.png';

async function loadLeaderboard() {
  const response = await fetch(API_URL);
  const data = await response.json();

  const top3Container = document.querySelector("#top3-cards");
  const rowsContainer = document.querySelector("#leaderboard-rows");
  top3Container.innerHTML = '';
  rowsContainer.innerHTML = '';

  data.forEach((entry, index) => {
    const reward = index < rewards.length ? `$ ${rewards[index]}` : '$ 0';
    const wagered = `$ ${Number(entry.wagered).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    const username = entry.username;

    if (index < 3) {
      const card = document.createElement('div');
      card.className = 'css-jehefp';
      card.style.boxShadow = top3Glows[index];
      card.innerHTML = `
        <img src="${logo}" style="width: 96px; border-radius: 12px;">
        <div class="css-hca0vm"><span class="css-15a1lq3" style="font-weight:bold;">${username}</span></div>
        <div class="css-7ahevu"><span class="css-1vqddgv">Wagered:</span>
          <span class="css-18icuxn"><div class="css-1y0ox2o"><span class="css-114dvlx">${wagered}</span></div></span>
        </div>
        <span class="css-v4675v"><div class="css-1y0ox2o"><span class="css-114dvlx glow">${reward}</span></div></span>
      `;
      top3Container.appendChild(card);
    } else {
      const row = document.createElement('div');
      row.className = 'row list row-cols-5';
      row.innerHTML = `
        <div class="hide-mobile col-2"><b style="font-size: 18px;">#${index + 1}</b></div>
        <div class="col-5">
          <img src="${logo}" width="22" style="margin-right: 8px;">
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

document.addEventListener("DOMContentLoaded", loadLeaderboard);
