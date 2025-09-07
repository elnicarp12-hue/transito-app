import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.SUBTE_API_KEY;
    const response = await fetch(
      `https://api.buenosaires.gob.ar/subte?api_key=${apiKey}`
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo obtener el estado de subtes." });
  }
}
