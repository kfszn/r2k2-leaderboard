const prizes = ["$200", "$100", "$50", "$25", "$15", "$7.50", "$2.50"];

async function fetchLeaderboard() {
  const leaderboardTable = document.getElementById('leaderboard-body');
  leaderboardTable.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

  try {
    const response = await fetch('/api/leaderboard');
    const data = await response.json();

    const leaderboardData = data.affiliates.map(user => {
      const wagered = parseFloat(user.wagered_amount || 0);
      const income = parseFloat(user.income || 0); // used only for points

      const points = Math.floor((wagered * 0.1) + (income * 2000));

      return {
        username: user.username || "Unknown",
        wagered,
        points
      };
    });

    leaderboardData.sort((a, b) => b.points - a.points);
    leaderboardTable.innerHTML = "";

    leaderboardData.forEach((player, index) => {
      const row = document.createElement("tr");
      const prize = index < prizes.length ? prizes[index] : "–";

      // Top 3 color highlights
      if (index === 0) row.classList.add("gold");
      else if (index === 1) row.classList.add("silver");
      else if (index === 2) row.classList.add("bronze");

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${player.username}</td>
        <td>${player.points.toLocaleString()}</td>
        <td>$${player.wagered.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td>${prize}</td>
      `;

      leaderboardTable.appendChild(row);
    });

  } catch (error) {
    console.error(error);
    leaderboardTable.innerHTML = "<tr><td colspan='5'>Error loading data</td></tr>";
  }
}

fetchLeaderboard();
setInterval(fetchLeaderboard, 900000);

// Close floating Kick player
const closeBtn = document.getElementById('close-player');
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    document.getElementById('floating-player').style.display = 'none';
  });
}

// Make floating player draggable
function makeDraggable(el) {
  let isDragging = false, offsetX = 0, offsetY = 0;

  el.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      el.style.left = `${e.clientX - offsetX}px`;
      el.style.top = `${e.clientY - offsetY}px`;
      el.style.bottom = 'auto';
      el.style.right = 'auto';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    el.style.cursor = 'grab';
  });
}

const floatingPlayer = document.getElementById('floating-player');
if (floatingPlayer) {
  makeDraggable(floatingPlayer);
}
