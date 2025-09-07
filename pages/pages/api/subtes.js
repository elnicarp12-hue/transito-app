import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const response = await fetch("https://www.metrovias.com.ar/Subte/Estado");
    if (!response.ok) {
      throw new Error("Error al obtener datos de subtes");
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Ejemplo de scraping (ajustalo según la página real)
    const lineas = [];
    $(".estado-linea").each((i, el) => {
      lineas.push({
        nombre: $(el).find(".nombre-linea").text().trim(),
        estado: $(el).find(".estado").text().trim()
      });
    });

    res.status(200).json(lineas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
