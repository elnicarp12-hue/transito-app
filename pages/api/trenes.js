export default async function handler(req, res) {
  const apiKey = process.env.API_KEY_TRANSPORTE;

  try {
    const response = await fetch(`https://apitransporte.buenosaires.gob.ar/trenes?client_id=${apiKey}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener datos de trenes" });
  }
}
