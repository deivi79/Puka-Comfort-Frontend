import { useEffect, useRef, useState } from 'react'

export default function Carousel({ items = [], interval = 5000, onClickSlide }) {
  const [index, setIndex] = useState(0)
  const timer = useRef(null)
  const hasItems = Array.isArray(items) && items.length > 0

  useEffect(() => { setIndex(0) }, [items?.length])

  useEffect(() => {
    if (!hasItems || items.length < 2) return
    const start = () => { stop(); timer.current = setTimeout(() => setIndex(i => (i + 1) % items.length), interval) }
    const stop  = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null } }
    const vis   = () => { document.hidden ? stop() : start() }
    start(); document.addEventListener('visibilitychange', vis)
    return () => { stop(); document.removeEventListener('visibilitychange', vis) }
  }, [hasItems, items, interval])

  const goto = (i) => setIndex((i % items.length + items.length) % items.length)
  const handleKey = (e, it) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClickSlide?.(it) }
    else if (e.key === 'ArrowLeft') goto(index - 1)
    else if (e.key === 'ArrowRight') goto(index + 1)
  }

  if (!hasItems) return null

  return (
    <div className="carousel" role="region" aria-roledescription="carrusel" aria-label="Noticias destacadas">
      <style>{`
        body{ overflow-x:hidden; }

        .carousel{
          width:100%;
          margin:0 auto;
          position:relative;
          overflow:hidden;
          border-radius:16px;
          background:#f6f6f6;

          /* 📐 Más ALTO en desktop, sin cambiar el ancho */
          aspect-ratio: 4 / 3;      /* más alto que 16/9 y 3/2 */
          max-height: 820px;

          /* tamaños de flechas */
          --arrow-size:72px;
          --arrow-icon:34px;

          /* margen lateral para que el caption no toque las flechas */
          --edge-gap: calc(var(--arrow-size) + 20px);
        }

        .carousel-track{ display:flex; height:100%; transition: transform .55s ease; }
        .carousel-slide{ min-width:100%; position:relative; height:100%; outline:none; cursor:pointer; }
        .carousel-slide img{ width:100%; height:100%; object-fit:cover; object-position:center; display:block; }

        /* ===== Caption (con margen lateral dinámico) ===== */
        .carousel-caption{
          position:absolute; left:50%; transform:translateX(-50%); bottom:24px;
          width: calc(100% - (var(--edge-gap) * 2));  /* 👈 evita cruce con flechas */
          max-width:100%;
          background:#fff; border-radius:16px;
          padding:26px 40px;
          box-shadow:0 16px 36px rgba(0,0,0,.22);
          text-align:center; z-index:2;
        }
        .carousel-caption .title{
          margin:0 0 8px; font-family:'Agelia', system-ui, sans-serif;
          font-size: clamp(26px, 3.2vw, 42px); line-height:1.1;
        }
        .carousel-caption .sub{
          margin:0; font-family:'Cobbler Sans', system-ui, sans-serif;
          font-size: clamp(13px, 1.6vw, 16px); line-height:1.35; color:#222; opacity:.92;
        }
        .carousel-caption .heart{
          position:absolute; top:-14px; right:-14px; width:72px; height:auto; pointer-events:none;
        }

        /* Flechas */
        .carousel-btn{
          position:absolute; top:50%; transform:translateY(-50%);
          width:var(--arrow-size); height:var(--arrow-size);
          border:0; border-radius:50%; background:rgba(255,255,255,.28); color:#111;
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 4px 14px rgba(0,0,0,.18);
          cursor:pointer; user-select:none; backdrop-filter: blur(2px);
          transition: background .2s ease, transform .12s ease; z-index:3;
        }
        .carousel-btn:hover, .carousel-btn:focus-visible{ background:rgba(255,255,255,.65); transform:translateY(-50%) scale(1.06); }
        .carousel-btn:active{ transform:translateY(-50%) scale(.98); }
        .carousel-btn.prev{ left:14px; } .carousel-btn.next{ right:14px; }
        .carousel-btn svg{ width:var(--arrow-icon); height:var(--arrow-icon); display:block; }

        /* ===== Muy ancho (aún más alto si quieres) ===== */
        @media (min-width:1200px){
          .carousel{ aspect-ratio: 5 / 4; }   /* más alto todavía */
        }

        /* ===== Tablet ===== */
        @media (max-width: 900px){
          .carousel{ aspect-ratio: 4 / 3; --arrow-size:60px; --arrow-icon:28px; --edge-gap: calc(var(--arrow-size) + 16px); }
          .carousel-caption{ bottom:18px; padding:18px 22px; }
          .carousel-caption .heart{ width:62px; top:-10px; right:-10px; }
        }

        /* ===== Móvil ===== */
        @media (max-width: 520px){
          .carousel{
            aspect-ratio: 5 / 6; max-height: 62vh;
            --arrow-size:48px; --arrow-icon:22px; --edge-gap: calc(var(--arrow-size) + 12px);
          }
          .carousel-caption{
            bottom:10px; width: calc(100% - (var(--edge-gap) * 2));
            padding:12px 14px; border-radius:14px; box-shadow:0 10px 26px rgba(0,0,0,.18);
          }
          .carousel-caption .title{ font-size: clamp(18px, 5.2vw, 24px); }
          .carousel-caption .sub{
            font-size: clamp(12px, 3.6vw, 14px);
            display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:3; overflow:hidden;
          }
          .carousel-caption .heart{ width:48px; top:-8px; right:-8px; }
          .carousel-btn.prev{ left:8px; } .carousel-btn.next{ right:8px; }
        }

        @media (max-width: 380px){
          .carousel{ aspect-ratio: 1 / 1; max-height: 64vh; }
          .carousel-caption .sub{ -webkit-line-clamp:2; }
        }
      `}</style>

      <div
        className="carousel-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
        aria-live="polite"
      >
        {items.map((it, i) => {
          const src = it.hero_image || it.cover_image || '/images/placeholder.jpg'
          return (
            <div
              key={it.id ?? i}
              className="carousel-slide"
              onClick={() => onClickSlide?.(it)}
              onKeyDown={(e) => handleKey(e, it)}
              role="button"
              tabIndex={0}
              aria-label={`Slide ${i+1} de ${items.length}: ${it.title}`}
            >
              <img
                src={src}
                alt={it.title || 'Imagen de noticia'}
                loading="eager"
                decoding="async"
                onError={(e)=>{ e.currentTarget.src='/images/placeholder.jpg' }}
              />
              <div className="carousel-caption">
                <div className="title">{it.title}</div>
                {!!it.excerpt && <p className="sub">{it.excerpt}</p>}
                <img className="heart" src="/ilustraciones/Ilustraciones_Mesa de trabajo 1 copia 2.png" alt="" aria-hidden="true" />
              </div>
            </div>
          )
        })}
      </div>

      {items.length > 1 && (
        <>
          <button type="button" className="carousel-btn prev" aria-label="Anterior" onClick={() => goto(index - 1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button type="button" className="carousel-btn next" aria-label="Siguiente" onClick={() => goto(index + 1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </>
      )}
    </div>
  )
}
