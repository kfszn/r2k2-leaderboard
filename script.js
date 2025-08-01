// Prize tiers for top 7
const prizes = ["$200", "$100", "$50", "$25", "$15", "$7.50", "$2.50"];

async function fetchLeaderboard() {
    const leaderboardTable = document.getElementById('leaderboard-body');
    leaderboardTable.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

    try {
        // Fetch from your Vercel serverless function instead of Rainbet directly
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        
        // Extract affiliates array from API response
        const leaderboardData = data.affiliates.map(user => {
            const wagered = parseFloat(user.wagered_amount || 0);
            const income = parseFloat(user.income || 0); // income field is earnings
            const points = Math.floor((wagered * 0.1) + (income * 2000));
            
            return { 
                username: user.username || "Unknown", 
                wagered, 
                income, 
                points 
            };
        });

        // Sort by points descending
        leaderboardData.sort((a, b) => b.points - a.points);

        // Clear table
        leaderboardTable.innerHTML = "";

        // Populate leaderboard rows
        leaderboardData.forEach((player, index) => {
            const row = document.createElement("tr");
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

// Floating Kick player close button
const closeBtn = document.getElementById('close-player');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        document.getElementById('floating-player').style.display = 'none';
    });
}
