// pages/api/trenes.js
import fetch from 'node-fetch';

export default async function handler(req, res){
  const url = process.env.TRENES_API_URL || '';
  if(url){
    try{
      const r = await fetch(url);
      if(r.ok){
        const j = await r.json();
        // Asumimos que j es array con {texto, alerta} o adaptamos mínimamente
        return res.json(Array.isArray(j) ? j : [{ texto: JSON.stringify(j), alerta: false }]);
      }
    }catch(e){}
  }
  // fallback mock
  return res.json([
    { texto: "Ramal Sarmiento → Demora 10 min", alerta: true },
    { texto: "Ramal Mitre → Normal", alerta: false },
    { texto: "Ramal Roca → Interrumpido", alerta: true }
  ]);
}
