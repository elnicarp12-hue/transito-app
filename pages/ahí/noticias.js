// pages/api/noticias.js
import fetch from 'node-fetch';

export default async function handler(req, res){
  const key = process.env.NEWSAPI_KEY || '';
  if(!key){
    // fallback demo
    return res.json([{ texto: "[URGENTE] Demo: NewsAPI no configurada", alerta: true }]);
  }

  const url = `https://newsapi.org/v2/top-headlines?country=ar&pageSize=8&apiKey=${key}`;
  try{
    const r = await fetch(url);
    if(!r.ok) throw new Error('newsapi');
    const j = await r.json();
    const out = (j.articles || []).map(a => ({
      texto: `[URGENTE] ${a.title}`,
      alerta: true
    }));
    return res.json(out);
  }catch(e){
    return res.json([{ texto: "[URGENTE] Error cargando noticias", alerta: true }]);
  }
}
