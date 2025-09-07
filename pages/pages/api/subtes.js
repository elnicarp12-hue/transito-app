// pages/api/subtes.js
import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async function handler(req, res){
  const url = process.env.SUBTE_SOURCE_URL || '';
  if(url){
    try{
      const r = await fetch(url);
      const ct = r.headers.get('content-type') || '';
      if(ct.includes('application/json')){
        const j = await r.json();
        return res.json(Array.isArray(j) ? j : [{ texto: JSON.stringify(j), alerta:false }]);
      } else {
        const html = await r.text();
        const $ = cheerio.load(html);
        const lines = [];
        // Esto es ejemplo genérico: adaptar según el HTML real del sitio
        $('.linea, .line-status, .line').each((i,el)=>{
          const name = $(el).find('.name, h3').first().text().trim();
          const status = $(el).find('.status, .estado').first().text().trim();
          if(name) lines.push({ texto: `${name} → ${status || 'Sin datos'}`, alerta: /interrump|demor/i.test(status || '') });
        });
        if(lines.length) return res.json(lines);
      }
    }catch(e){}
  }
  // fallback mock
  return res.json([
    { texto: "Línea B → Normal", alerta: false },
    { texto: "Línea C → Demora 5 min", alerta: true },
    { texto: "Premetro → Normal", alerta: false }
  ]);
}
