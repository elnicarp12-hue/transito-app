import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const response = await fetch("https://www.argentina.gob.ar/noticias/transito");
    const html = await response.text();
    const $ = cheerio.load(html);

    const transito = [];
    $(".views-row").each((i, el) => {
      transito.push({
        titulo: $(el).find("h2").text().trim(),
        link: "https://www.argentina.gob.ar" + $(el).find("a").attr("href"),
      });
    });

    res.status(200).json({ transito });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tránsito", detalle: error.message });
  }
}
