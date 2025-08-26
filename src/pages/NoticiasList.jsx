import { useEffect, useState } from 'react'
import { api } from '../api'
import { absUrl } from '../url'
import { useNavigate } from 'react-router-dom'
import Reveal from '../components/Reveal'

export default function NoticiasList(){
  const [data, setData] = useState({ results: [] })
  const nav = useNavigate()

  useEffect(() => {
    api('/api/news/posts/').then(res =>
      setData(Array.isArray(res) ? { results: res } : (res || { results: [] }))
    )
  }, [])

  return (
    <main>
      <style>{`
        .news-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px;   /* ✅ igual que Equipo.jsx */
        }

        /* H1 con fuente oficial */
        .news-title{
          font-family:'Agelia', system-ui, sans-serif;
          font-size: 34px; line-height:1.05;
          margin: 20px 0 12px;
        }

        /* grilla 2 col – mismo alto por fila */
        .news-grid{
          display:grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 28px;
          align-items: stretch; /* estira las tarjetas */
        }

        /* tarjeta flexible, mismo alto */
        .news-card{
          display:flex; flex-direction:column;
          overflow:hidden; border-radius: 12px;
          height:100%;
        }

        /* imagen con alto fijo para que todas queden iguales */
        .news-figure{
          margin:0; height: 260px;           /* ajusta 240–300 si quieres */
          overflow:hidden; border-bottom: 1px solid #f0d0d8;
        }
        .news-figure img{
          width:100%; height:100%;
          object-fit: cover; display:block;
        }

        /* cuerpo flexible para empujar el botón al fondo */
        .news-body{
          padding: 14px 16px 16px;
          display:flex; flex-direction:column; gap:8px;
          flex:1;
        }

        /* tipografía oficial */
        .news-h3{
          font-family:'Cobbler Sans', system-ui, sans-serif;
          font-weight:700; font-size:18px;
          margin:0;
        }
        .news-excerpt{
          font-family:'Cobbler Sans', system-ui, sans-serif;
          font-size:15px; line-height:1.45; color:#444;
          margin:0;
          flex:1; /* ocupa el espacio disponible */
        }

        .news-btn{
          align-self:flex-start;              /* como en el mock */
          margin-top:auto;                    /* queda pegado abajo */
        }

        /* responsive */
        @media (max-width: 820px){
          .news-grid{ grid-template-columns: 1fr; gap:22px; }
          .news-figure{ height: 220px; }
        }
      `}</style>

      <div className="news-wrap">
        <Reveal as="h1" className="news-title">Noticias</Reveal>

        <div className="news-grid">
          {(data.results || []).map((p, i) => {
            const img = p.cover_image ? (absUrl ? absUrl(p.cover_image) : p.cover_image) : null
            return (
              <Reveal key={p.slug || p.id || i} className="card news-card" delay={70*i}>
                <figure className="news-figure">
                  {img && <img src={img} alt={p.title} loading="lazy" decoding="async" />}
                </figure>

                <div className="news-body">
                  <h3 className="news-h3">{p.title}</h3>
                  {p.excerpt && <p className="news-excerpt">{p.excerpt}</p>}
                  <button
                    className="btn-donar news-btn"
                    onClick={() => nav(`/noticias/${p.slug || p.id}`)}
                    aria-label={`Leer más: ${p.title}`}
                  >
                    Leer más
                  </button>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </main>
  )
}
