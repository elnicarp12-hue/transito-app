import Parser from "rss-parser";

export default async function handler(req, res) {
  const parser = new Parser();
  const feeds = [
    "https://www.clarin.com/rss/lo-ultimo/",
    "https://www.pagina12.com.ar/rss/portada",
    "https://www.lanacion.com.ar/rss/canal/ultimas-noticias/"
  ];

  try {
    let noticias = [];
    for (const url of feeds) {
      const feed = await parser.parseURL(url);
      noticias = noticias.concat(feed.items.map(item => ({
        titulo: item.title,
        link: item.link,
        fuente: feed.title
      })));
    }

    res.status(200).json(noticias.slice(0, 20)); // primeras 20
  } catch (error) {
    res.status(500).json({ error: "Error al obtener noticias" });
  }
}
