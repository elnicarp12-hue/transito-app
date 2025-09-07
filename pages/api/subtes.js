import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const response = await fetch("https://www.subte.com.ar/");
    const html = await response.text();
    const $ = cheerio.load(html);

    const subtes = [];
    $(".estado-linea").each((i, el) => {
      subtes.push({
        linea: $(el).find(".nombre-linea").text().trim(),
        estado: $(el).find(".texto-estado").text().trim(),
      });
    });

    res.status(200).json({ subtes });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener subtes", detalle: error.message });
  }
}
