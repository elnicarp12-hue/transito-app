export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.currentsapi.services/v1/latest-news?language=es", {
      headers: {
        Authorization: `Bearer TU_API_KEY` // ⚠️ reemplazá con tu API key real
      }
    });

    if (!response.ok) {
      throw new Error("Error al obtener noticias");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
