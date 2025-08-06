export default async function handler(req, res) {
  const API_KEY = process.env.RAINBET_API_KEY;

  try {
    const response = await fetch("https://rainbet.com/api/affiliate/stats", {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    const leaderboard = data.users
      .filter(
        (u) => u.username !== "r2ktwoonkick" && u.username !== "R2KtwoLive"
      )
      .map((u) => ({
        username: u.username,
        wagered: u.totalWagered,
      }))
      .sort((a, b) => b.wagered - a.wagered);

    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard data" });
  }
}
