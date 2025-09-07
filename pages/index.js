// pages/index.js
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
export default function Home(){
  const endpoints = {
    trenes: '/api/trenes',
    subtes: '/api/subtes',
    transito: '/api/transito',
    noticias: '/api/noticias'
  };

  const [trenes, setTrenes] = useState([]);
  const [subtes, setSubtes] = useState([]);
  const [transito, setTransito] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [lastUpdate, setLastUpdate] = useState('--:--');
  const [alertsPaused, setAlertsPaused] = useState(false);
  const lastHashRef = useRef(null);
  const audioRef = useRef();

  async function fetchJSON(url){
    try{
      const r = await fetch(url, {cache: 'no-cache'});
      if(!r.ok) throw new Error('network');
      return await r.json();
    }catch(e){
      return [];
    }
  }

  function renderList(arr){
    if(!arr || !arr.length) return <div className="item">Sin datos.</div>;
    return arr.map((it, idx) => (
      <div key={idx} className={`item ${it.alerta ? 'alerta' : ''}`}>{it.texto}</div>
    ));
  }

  function buildGuion(){
    const tAlert = trenes.filter(t=>t.alerta).slice(0,4).map(t=>t.texto);
    const sAlert = subtes.filter(s=>s.alerta).slice(0,4).map(s=>s.texto);
    const trAlert = transito.filter(t=>t.alerta).slice(0,3).map(t=>t.texto);
    const nAlert = noticias.slice(0,3).map(n=>n.texto);

    const parts = [];
    if(tAlert.length) parts.push(`Trenes: ${tAlert.join(' — ')}.`);
    if(sAlert.length) parts.push(`Subte: ${sAlert.join(' — ')}.`);
    if(trAlert.length) parts.push(`Tránsito: ${trAlert.join(' — ')}.`);
    if(nAlert.length) parts.push(`Último momento: ${nAlert.join(' — ')}.`);

    return parts.length ? parts.join(' ') : 'Tránsito y transporte sin novedades relevantes por el momento.';
  }

  async function actualizarAll(){
    const [t,s,tr,n] = await Promise.all([
      fetchJSON(endpoints.trenes),
      fetchJSON(endpoints.subtes),
      fetchJSON(endpoints.transito),
      fetchJSON(endpoints.noticias)
    ]);
    setTrenes(t); setSubtes(s); setTransito(tr); setNoticias(n);
    setLastUpdate(new Date().toLocaleTimeString());

    // detect change
    const hash = JSON.stringify({t,s,tr,n});
    if(hash !== lastHashRef.current){
      const anyAlert = [...t, ...s, ...tr, ...n].some(i=>i.alerta);
      if(anyAlert && !alertsPaused){
        try{ audioRef.current.currentTime = 0; audioRef.current.play(); }catch(e){}
      }
      lastHashRef.current = hash;
    }
  }

  useEffect(() => {
    actualizarAll();
    const iv = setInterval(actualizarAll, 30000);
    return ()=> clearInterval(iv);
  }, [alertsPaused]);

  // SSE fallback: try to open /api/events (not required)
  useEffect(() => {
    if(typeof EventSource !== 'undefined'){
      try{
        const es = new EventSource('/api/events');
        es.onmessage = (ev) => {
          try{
            const d = JSON.parse(ev.data);
            if(d.type === 'update'){
              actualizarAll();
            } else if(d.type === 'alert' && !alertsPaused){
              try{ audioRef.current.play(); }catch(e){}
              actualizarAll();
            }
          }catch(err){}
        };
        es.onerror = ()=>{};
      }catch(e){}
    }
  }, [alertsPaused]);

  return (
    <>
      <Head>
        <title>Tránsito & Transporte — En Vivo</title>
      </Head>
      <header className="topbar">
        <h1>🚦 Tránsito, Trenes, Subte y Urgentes — En Vivo</h1>
        <div className="last-update">Última actualización: {lastUpdate}</div>
      </header>

      <main className="container">
        <div className="grid">
          <section className="card">
            <h2>🚆 Trenes Argentinos</h2>
            <div id="trenes-data">{renderList(trenes)}</div>
          </section>

          <section className="card">
            <h2>🚇 Subte / Premetro</h2>
            <div id="subtes-data">{renderList(subtes)}</div>
          </section>

          <section className="card">
            <h2>🚗 Tránsito CABA</h2>
            <div id="transito-data">{renderList(transito)}</div>
          </section>

          <section className="card">
            <h2>📰 Último Momento (Noticias)</h2>
            <div id="noticias-data">{renderList(noticias)}</div>
          </section>
        </div>

        <section className="card">
          <h2>🎙️ Modo guion</h2>
          <div id="guion-text">{buildGuion()}</div>
          <div className="controls">
            <button onClick={() => { navigator.clipboard.writeText(buildGuion()).then(()=>alert('Guion copiado'))}}>Copiar guion</button>
            <button onClick={() => setAlertsPaused(p => !p)}>{alertsPaused ? 'Reanudar alertas' : 'Pausar alertas'}</button>
          </div>
        </section>
      </main>

      <audio ref={audioRef} id="alert-sound" preload="auto">
        <source src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg" type="audio/ogg"/>
      </audio>
    </>
  );
}
