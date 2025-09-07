import { useEffect, useState } from "react";

export default function Home() {
  const [noticias, setNoticias] = useState([]);
  const [trenes, setTrenes] = useState([]);
  const [subtes, setSubtes] = useState([]);
  const [transito, setTransito] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [n, t, s, tr] = await Promise.allSettled([
          fetch("/api/noticias").then((r) => r.json()),
          fetch("/api/trenes").then((r) => r.json()),
          fetch("/api/subtes").then((r) => r.json()),
          fetch("/api/transito").then((r) => r.json()),
        ]);

        if (n.status === "fulfilled") setNoticias(n.value.noticias || []);
        if (t.status === "fulfilled") setTrenes(t.value.trenes || []);
        if (s.status === "fulfilled") setSubtes(s.value.subtes || []);
        if (tr.status === "fulfilled") setTransito(tr.value.transito || []);
      } catch (err) {
        setError("Error al cargar datos");
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🚦 Estado del tránsito, trenes, subtes y noticias</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <section>
        <h2>📰 Noticias</h2>
        <ul>
          {noticias.map((n, i) => (
            <li key={i}>
              <a href={n.link} target="_blank" rel="noreferrer">
                {n.titulo}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>🚆 Trenes</h2>
        <ul>
          {trenes.map((t, i) => (
            <li key={i}>
              <b>{t.ramal}</b>: {t.estado}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>🚇 Subtes</h2>
        <ul>
          {subtes.map((s, i) => (
            <li key={i}>
              <b>{s.linea}</b>: {s.estado}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>🚗 Tránsito</h2>
        <ul>
          {transito.map((t, i) => (
            <li key={i}>
              <a href={t.link} target="_blank" rel="noreferrer">
                {t.titulo}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
