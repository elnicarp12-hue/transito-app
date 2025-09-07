export default async function handler(req, res) {
  try {
    const response = await fetch("https://api-ferrocarriles.fake/trenes"); // ⚠️ reemplazá con API real
    if (!response.ok) {
      throw new Error("Error al obtener datos de trenes");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
