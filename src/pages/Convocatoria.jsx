import { useEffect, useState } from 'react'
import { api } from '../api'
import { absUrl } from '../url'
import Reveal from '../components/Reveal'

export default function Convocatoria(){
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    api('/api/calls/')
      .then(res => mounted && setRows(Array.isArray(res) ? res : (res?.results || [])))
      .catch(e => mounted && setError(e))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  // ✅ imágenes de public/ se usan desde la raíz (SIN /public)
  const heroImg = '/images/voluntariado.jpg'

  const SKELE = {
    box: {
      height: 180,
      width: 300,
      borderRadius: 6,
      background: 'linear-gradient(90deg,#f3f3f3 25%,#ecebeb 37%,#f3f3f3 63%)',
      backgroundSize: '400% 100%',
      animation: 'pulse 1.2s ease-in-out infinite'
    }
  }

  return (
    <main>
      <style>{`
        @keyframes pulse {
          0% { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
        .calls-wrap {
            max-width: 1100px;
            margin: 0 auto;
            padding: 24px;   /* ✅ mismo padding que Equipo.jsx */
          }
        .calls-title{
          font-family:'Agelia', system-ui, sans-serif;
          font-size:36px; line-height:1.05; text-align:center;
          margin:20px 0 16px;
        }
        .calls-hero{
          max-width:720px; margin:0 auto 28px;
          border-radius:10px; overflow:hidden;
          box-shadow:0 8px 30px rgba(0,0,0,.06);
        }
        .calls-hero img{ width:100%; height:auto; display:block; object-fit:cover; }

        .calls-grid{
          display:grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap:34px; align-items:start;
        }
        .call-card{ text-align:center; }
        .call-logoBox{
          width: 300px; height: 180px; margin: 0 auto 12px;
          background:#e9e9e9; border-radius:6px;
          display:flex; align-items:center; justify-content:center; overflow:hidden;
        }
        .call-logoBox img{ max-width:100%; max-height:100%; object-fit:contain; display:block; }
        .call-btn{
          display:inline-block; margin:6px 0 12px; padding:8px 18px;
          border-radius:999px; background:#E9B21E; color:#000; font-weight:700;
          text-decoration:none; border:1px solid rgba(0,0,0,.15);
        }
        .call-btn:hover{ filter:brightness(.95); }
        .call-title{
          font-family:'Cobbler Sans', system-ui, sans-serif;
          font-weight:700; color:#000; font-size:18px; line-height:1.25; margin:0;
        }
        .calls-note{ text-align:center; color:#444; margin-top:12px; }

        @media (max-width: 920px){
          .call-logoBox{ width: 260px; height: 160px; }
        }
        @media (max-width: 700px){
          .calls-grid{ grid-template-columns: 1fr; gap:24px; }
          .call-logoBox{ width: 260px; height: 160px; }
        }
      `}</style>

      <div className="calls-wrap">
        <Reveal as="h1" className="calls-title">Convocatoria de voluntariado</Reveal>

        <Reveal className="calls-hero" delay={40}>
          <img src={heroImg} alt="Convocatorias de voluntariado" loading="lazy" decoding="async" />
        </Reveal>

        {loading && <p className="calls-note">Cargando convocatorias…</p>}
        {error && <p className="calls-note">Ups, no pudimos cargar: {error.message}</p>}

        {!loading && !error && rows.length > 0 && (
          <div className="calls-grid">
            {rows.map((c, i) => {
              const src = c.partner_logo || c.image
              const img = src ? absUrl(src) : ''   // ✅ aplica helper siempre
              return (
                <Reveal key={c.id || c.slug || i} className="call-card" delay={70*i}>
                  <div className="call-logoBox">
                    {img ? (
                      <img src={img} alt={c.partner_name || c.title} loading="lazy" decoding="async" />
                    ) : (
                      <div style={SKELE.box} />
                    )}
                  </div>

                  {c.apply_url && (
                    <a className="call-btn" href={c.apply_url} target="_blank" rel="noreferrer">
                      ¡Postula!
                    </a>
                  )}

                  <h3 className="call-title">{c.title}</h3>
                </Reveal>
              )
            })}
          </div>
        )}

        {!loading && !error && rows.length === 0 && (
          <p className="calls-note">No hay convocatorias activas por ahora.</p>
        )}
      </div>
    </main>
  )
}
