export default async function handler(req, res) {
  const start_at = "2025-07-23"; // LB start
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const end_at = `${yyyy}-${mm}-${dd}`;

  const apiKey = "OjwJ62YWj7gveE0OkmkrCvRM4U3Omh16";
  const url = `https://services.rainbet.com/v1/external/affiliates?start_at=${start_at}&end_at=${end_at}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard data" });
  }
}
