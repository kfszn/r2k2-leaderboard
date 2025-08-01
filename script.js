const API_KEY = "OjwJ62YWj7gveE00kmkrCvRM4U30mh16";
const ENDPOINT = "https://services.rainbet.com/v1/external/affiliates";

// Prize tiers for top 7
const prizes = ["$200", "$100", "$50", "$25", "$15", "$7.50", "$2.50"];

async function fetchLeaderboard() {
    const start_at = "2025-07-23"; // leaderboard start date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const end_at = `${yyyy}-${mm}-${dd}`;

    const url = `${ENDPOINT}?start_at=${start_at}&end_at=${end_at}&key=${API_KEY}`;
    const leaderboardTable = document.getElementById('leaderboard-body');
    leaderboardTable.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Example: Assume API returns an array of users like:
        // [{ username: 'player1', wagered: 1234.56, earnings: 0.12 }, ... ]

        const leaderboardData = data.map(user => {
            const points = Math.floor((user.wagered * 0.1) + (user.earnings * 2000));
            return {
                username: user.username || "Unknown",
                wagered: user.wagered || 0,
                earnings: user.earnings || 0,
                points
            };
        });

        // Sort by points descending
        leaderboardData.sort((a, b) => b.points - a.points);

        leaderboardTable.innerHTML = "";

        leaderboardData.forEach((player, index) => {
            const row = document.createElement("tr");

            // Assign prize for top 7
            const prize = index < prizes.length ? prizes[index] : "–";

            row.innerHTML = `
                <td>${player.points.toLocaleString()}</td>
                <td>$${player.wagered.toLocaleString()}</td>
                <td>${prize}</td>
            `;

            leaderboardTable.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        leaderboardTable.innerHTML = "<tr><td colspan='3'>Error loading data</td></tr>";
    }
}

// Initial load + auto-refresh every 15 mins
fetchLeaderboard();
setInterval(fetchLeaderboard, 900000);
