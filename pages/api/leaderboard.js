export default async function handler(req, res) {
  const API_KEY = process.env.RAINBET_API_KEY;
  const now = new Date();

  // Get today's date in YYYY-MM-DD
  const formatDate = (d) =>
    d.toISOString().split("T")[0];

  const start_at = formatDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)); // 30 days ago
  const end_at = formatDate(now); // today

  const apiUrl = `https://services.rainbet.com/v1/external/affiliates?start_at=${start_at}&end_at=${end_at}&key=${API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.users || !Array.isArray(data.users)) {
      throw new Error("Unexpected API response format");
    }

    const leaderboard = data.users
      .filter(
        (u) =>
          u.username !== "r2ktwoonkick" &&
          u.username !== "R2KtwoLive"
      )
      .map((u) => ({
        username: u.username,
        wagered: u.total_wagered,
      }))
      .sort((a, b) => b.wagered - a.wagered);

    res.status(200).json(leaderboard);
  } catch (err) {
    console.error("Leaderboard API error:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard data" });
  }
}
