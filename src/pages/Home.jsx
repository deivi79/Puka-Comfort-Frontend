import { useEffect, useMemo, useState, Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { absUrl } from '../url'

// ✅ Carga diferida del Carousel (reduce JS inicial)
const Carousel = lazy(() => import('../components/Carousel'))

export default function Home() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showRest, setShowRest] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await api('/api/news/articles/')
        const list = Array.isArray(res) ? res
          : Array.isArray(res?.results) ? res.results
          : Array.isArray(res?.data) ? res.data
          : []
        if (alive) setArticles(list)
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

  const items = useMemo(() => (
    (articles || []).map((p) => {
      const rawImg = p.imagen_cover || p.hero_image || p.cover_image || p.imagen || p.thumbnail
      let finalImg = absUrl(rawImg) || fallbackImg
      if (finalImg.endsWith('?')) finalImg = finalImg.slice(0, -1)
      return {
        id: p.id ?? p.slug,
        slug: encodeURIComponent(p.slug ?? String(p.id ?? '')),
        title: p.titulo ?? '',
        excerpt: p.descripcion ?? '',
        hero_image: finalImg,
        cover_image: finalImg,
        author: {
          name: p.autor?.nombre ?? 'Puka Comfort',
          position: p.autor?.cargo ?? '',
          photo: absUrl(p.autor?.foto ?? ''),
        },
        category: {
          name: p.categoria?.nombre ?? 'General',
          slug: p.categoria?.slug ?? '',
        },
        published_at: p.fecha_publicacion ?? null,
      }
    })
  ), [articles])

  // 👉 Primera imagen (LCP): intenta sacarla del primer item si existe
  const lcpImg = items[0]?.hero_image

  return (
    <>
      {/* ✅ Preload de la imagen LCP (mejora LCP/Speed Index) */}
      {lcpImg && (
        <link
          rel="preload"
          as="image"
          href={lcpImg}
          // Opcional: si sirves responsive, agrega imagesrcset/imagesizes
        />
      )}

      {/* === CARRUSEL / HERO === */}
      <section className="hero-bleed">
        {(!loading && !error && items.length > 0) ? (
          <Suspense
            fallback={
              <div className="hero-skeleton" aria-hidden="true"><div className="shine" /></div>
            }
          >
            <Carousel
              items={items}
              interval={6000}
              onClickSlide={(it) => nav(`/noticias/${it.slug}`)}
              // 👉 Si tu Carousel renderiza <img>, dale prioridad a la primera:
              renderImage={(src, alt = '') => (
                <picture>
                  <source srcSet={src} type="image/avif" />
                  <source srcSet={src} type="image/webp" />
                  <img
                    src={src}
                    alt={alt}
                    width={1200} height={700}     // ✅ tamaño explícito evita CLS
                    loading="eager"               // ✅ solo para la primera/hero
                    fetchpriority="high"          // ✅ empuja al front de la cola
                    decoding="async"
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    onError={(e) => { e.currentTarget.src = '/images/placeholder.jpg' }}
                  />
                </picture>
              )}
            />
          </Suspense>
        ) : (
          <div className="hero-skeleton" aria-hidden="true"><div className="shine" /></div>
        )}
      </section>

      {/* === RESTO DE LA PÁGINA === */}
      <main className={`container home-rest ${showRest ? 'show' : ''}`}>
        {error && <p style={{ color: 'crimson', margin: '16px 0' }}>{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p style={{ margin: '16px 0' }}>No hay noticias recientes por ahora.</p>
        )}

        {/* === SECCIÓN PROPÓSITO === */}
        <section className="info-band_2-bleed">
          <div className="info-band_2">
            <div className="container info-band__inner">
              {/* ✅ width/height + lazy */}
              <picture>
                <source srcSet="/images/nuestro-compromiso 3.avif" type="image/avif" />
                <source srcSet="/images/nuestro-compromiso 3.webp" type="image/webp" />
                <img
                  className="purpose__img"
                  src="/images/nuestro-compromiso 3.jpg"
                  alt="Niñas participantes"
                  width={380} height={380}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { e.currentTarget.src = '/images/nuestro-compromiso.jpg' }}
                />
              </picture>

              <div className="purpose__card">
                <h2 className="purpose__title">Nuestro propósito</h2>
                <p>
                  Nuestro propósito es transformar la salud menstrual en una experiencia positiva y libre de miedos...
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* === ESTILOS === */}
      <style>{`
        /* ===== HERO FULL BLEED ===== */
        .hero-bleed {
          position: relative;
          left: 50%; right: 50%;
          margin-left: -50vw; margin-right: -50vw;
          width: 100vw;
          min-height: 60vh;
          display: block;
          overflow: hidden; /* evita repaints por desbordes */
          contain: paint;   /* ayuda al compositor */
        }
        .hero-skeleton {
          position: relative; width: 100%; height: 60vh;
          background: #eee; overflow: hidden;
        }
        .hero-skeleton .shine {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, #e9e9e9 0%, #f5f5f5 50%, #e9e9e9 100%);
          transform: translateX(-100%);
          animation: shimmer 1.2s infinite linear;
        }
        @keyframes shimmer { 100% { transform: translateX(100%); } }

        /* ===== ANIMACIÓN RESTO ===== */
        .home-rest { opacity: 0; transform: translateY(14px); transition: opacity .5s ease, transform .5s ease; }
        .home-rest.show { opacity: 1; transform: none; }

        /* ===== SECCIÓN PROPÓSITO ===== */
        .info-band_2-bleed {
          position: relative;
          left: 50%; right: 50%;
          margin-left: -50vw; margin-right: -50vw;
          width: 100vw;
        }
        .info-band_2 {
          --bg: #F7AB98;
          --pattern-size: 220px;
          margin-top: 40px;
          padding: 56px 0 64px;
          background-color: var(--bg);
          background-image: url("/ilustraciones/Ilustraciones_Mesa%20de%20trabajo%201%20copia%203.png");
          background-repeat: repeat;
          background-size: var(--pattern-size) auto;
        }
        .info-band__inner {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 32px; align-items: center;
        }
        .purpose__img {
          max-width: 100%; aspect-ratio: 1/1;
          border-radius: 50%; object-fit: cover; display: block; margin: 0 auto;
        }
        .purpose__card {
          background: #dcdcdc; border-radius: 8px;
          padding: 24px 28px; text-align: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, .06);
        }
        .purpose__title {
          font-family: 'Agelia', system-ui, sans-serif;
          font-size: 28px; margin: 0 0 12px;
        }
        @media (max-width: 900px) {
          .info-band__inner { grid-template-columns: 1fr; gap: 24px; }
        }
      `}</style>
    </>
  )
}
