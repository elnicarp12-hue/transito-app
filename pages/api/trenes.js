import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const response = await fetch("https://www.argentina.gob.ar/transporte/trenes-argentinos");
    const html = await response.text();
    const $ = cheerio.load(html);

    const trenes = [];
    $("table tbody tr").each((i, el) => {
      trenes.push({
        ramal: $(el).find("td").eq(0).text().trim(),
        estado: $(el).find("td").eq(1).text().trim(),
      });
    });

    res.status(200).json({ trenes });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener trenes", detalle: error.message });
  }
}
