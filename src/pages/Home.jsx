import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { absUrl } from '../url'
import Carousel from '../components/Carousel'

export default function Home(){
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showRest, setShowRest] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await api('/api/news/posts/')
        const list = Array.isArray(res) ? res
                  : Array.isArray(res?.results) ? res.results
                  : Array.isArray(res?.data) ? res.data
                  : []
        if (alive) setFeatured(list)
      } catch (e) {
        if (alive) setError(e?.message || 'No se pudieron cargar las noticias')
      } finally {
        if (alive) setLoading(false)
        setTimeout(() => { if (alive) setShowRest(true) }, 200)
      }
    })()
    return () => { alive = false }
  }, [])

  const fallbackImg = '/images/placeholder.jpg'
  const items = featured.map(p => ({
    id: p.id ?? p.slug,
    slug: encodeURIComponent(p.slug ?? String(p.id ?? '')),
    title: p.title ?? '',
    excerpt: p.excerpt ?? '',
    hero_image: absUrl(p.hero_image || p.cover_image || p.image || p.thumbnail) || fallbackImg,
    cover_image: absUrl(p.cover_image || p.hero_image || p.image || p.thumbnail) || fallbackImg
  }))

  return (
    <>
      {/* HERO FULL-WIDTH */}
      <section className="hero-bleed">
        {(!loading && !error && items.length > 0) ? (
          <Carousel
            items={items}
            interval={6000}
            onClickSlide={(it)=> nav(`/noticias/${it.slug}`)}  // ✅ navegación SPA
          />
        ) : (
          <div className="hero-skeleton" aria-hidden="true">
            <div className="shine" />
          </div>
        )}
      </section>

      <main className={`container home-rest ${showRest ? 'show' : ''}`}>
        {error && <p style={{color:'crimson', margin:'16px 0'}}>{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p style={{margin:'16px 0'}}>No hay noticias destacadas por ahora.</p>
        )}

        {/* === NUESTRO PROPÓSITO FULL-BLEED === */}
        <section className="info-band_2-bleed">
          <div className="info-band_2">
            <div className="container info-band__inner">
              <img
                className="purpose__img"
                src="/images/nuestro-compromiso 3.jpg"
                alt="Niñas participantes"
                loading="lazy"
                decoding="async"
                onError={(e)=>{e.currentTarget.src='/images/nuestro-compromiso.jpg'}}
              />

              <div className="purpose__card">
                <h2 className="purpose__title">Nuestro propósito</h2>
                <p>
                  Nuestro propósito es transformar la salud menstrual en una experiencia positiva y libre de miedos. Queremos que cada niña y adolescente pueda aprender, jugar y crecer sin que su ciclo menstrual sea un obstáculo. Apostamos por la educación, el acceso a productos adecuados y la creación de entornos más inclusivos y respetuosos.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ESTILOS */}
      <style>{`
        /* ===== HERO FULL BLEED ===== */
        .hero-bleed{
          position:relative;
          left:50%; right:50%;
          margin-left:-50vw; margin-right:-50vw;
          width:100vw;
          min-height:60vh;
          display:block;
        }
        .hero-skeleton{
          position:relative; width:100%; height:60vh; max-height:720px; background:#eee; overflow:hidden;
        }
        .hero-skeleton .shine{
          position:absolute; inset:0;
          background: linear-gradient(90deg, #e9e9e9 0%, #f5f5f5 50%, #e9e9e9 100%);
          transform: translateX(-100%);
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer { 100% { transform: translateX(100%); } }

        /* ===== RESTO ANIMADO ===== */
        .home-rest{ opacity:0; transform:translateY(14px); transition:opacity .5s ease, transform .5s ease; }
        .home-rest.show{ opacity:1; transform:none; }

        /* ===== FULL-BLEED “PROPÓSITO” ===== */
        .info-band_2-bleed{
          position:relative;
          left:50%; right:50%;
          margin-left:-50vw; margin-right:-50vw;
          width:100vw;
        }
        .info-band_2 {
          --bg:#F7AB98;
          --pattern-size:220px;
          margin-top: 40px;
          padding: 56px 0 64px;
          background-color: var(--bg);
          background-image: url("/ilustraciones/Ilustraciones_Mesa%20de%20trabajo%201%20copia%203.png");
          background-repeat: repeat;
          background-size: var(--pattern-size) auto;
        }
        .info-band__inner{
          display:grid; grid-template-columns: 1fr 1fr; gap:32px; align-items:center;
        }
        .purpose__img{
          width:380px; max-width:100%; aspect-ratio:1/1; border-radius:50%;
          object-fit:cover; display:block; margin:0 auto;
        }
        .purpose__card{
          background:#dcdcdc; border-radius:8px; padding:24px 28px; text-align:center;
          box-shadow:0 2px 6px rgba(0,0,0,.06);
        }
        .purpose__title{
          font-family:'Agelia', system-ui, sans-serif;
          font-size:28px; margin:0 0 12px;
        }
        @media (max-width: 900px){
          .info-band__inner{ grid-template-columns:1fr; gap:24px; }
          .purpose__img{ width:300px; }
        }
      `}</style>
    </>
  )
}
