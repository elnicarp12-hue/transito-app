import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=ar&apiKey=${apiKey}`
    );

    const data = await response.json();
    res.status(200).json(data.articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo obtener las noticias." });
  }
}
