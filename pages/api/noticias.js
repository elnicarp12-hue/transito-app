import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const response = await fetch("https://www.telam.com.ar/");
    const html = await response.text();
    const $ = cheerio.load(html);

    const noticias = [];
    $(".c-articleBox__title a").each((i, el) => {
      noticias.push({
        titulo: $(el).text().trim(),
        link: $(el).attr("href"),
      });
    });

    res.status(200).json({ noticias });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener noticias", detalle: error.message });
  }
}
