# Tránsito & Transporte — En Vivo (Next.js)

Instrucciones rápidas:

1. Crear repo público en GitHub y pegar estos archivos en la raíz.
2. En Vercel → Import Project → seleccionar el repo.
3. En Vercel Settings → Environment Variables:
   - `NEWSAPI_KEY` = tu clave de https://newsapi.org (obligatorio para noticias reales)
   - Opcional:
     - `TRENES_API_URL` = URL JSON de Trenes Argentinos (si la tenés)
     - `SUBTE_SOURCE_URL` = URL (JSON o HTML) para estado del Subte (si la tenés)
     - `GCBA_TRANSITO_API` = endpoint GCBA si lo tenés
4. Deploy. La app actualizará cada 30s y mostrará alertas sonoras/visuales.

Notas:
- Si no configuras las URLs reales, el proyecto usa **mocks** para que pruebes la interfaz.
- NewsAPI tiene límites en el plan free. Si se agota, aumentá el intervalo (en `pages/index.js`).
