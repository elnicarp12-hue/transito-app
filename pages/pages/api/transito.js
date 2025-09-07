// pages/api/transito.js
import fetch from 'node-fetch';

export default async function handler(req, res){
  const url = process.env.GCBA_TRANSITO_API || '';
  if(url){
    try{
      const r = await fetch(url);
      if(r.ok){
        const j = await r.json();
        return res.json(Array.isArray(j) ? j : [{ texto: JSON.stringify(j), alerta:false }]);
      }
    }catch(e){}
  }
  // fallback mock
  return res.json([
    { texto: "Av. 9 de Julio → Cortada", alerta: true },
    { texto: "Autopista Illia → Fluido", alerta: false }
  ]);
}
