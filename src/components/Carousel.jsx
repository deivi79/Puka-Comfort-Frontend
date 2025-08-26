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
        .carousel{
          --arrow-size:72px; --arrow-icon:34px;
          position:relative; overflow:hidden; background:#f6f6f6;
          width:100%; min-height:60vh; max-height:720px; /* hero grande */
        }
        .carousel-track{ display:flex; height:100%; transition: transform .55s ease; }
        .carousel-slide{ min-width:100%; position:relative; cursor:pointer; outline:none; height:100%; }
        .carousel-slide img{
          width:100%; height:100%; object-fit:cover; display:block;
        }

        /* caption centrado, más grande en hero */
        .carousel-caption{
          position:absolute; left:50%; transform:translateX(-50%); bottom:28px;
          width:min(1000px, calc(100% - 40px));
          background:#fff; border-radius:16px;
          padding:22px 96px 22px 22px;
          box-shadow:0 16px 36px rgba(0,0,0,.22); text-align:center; z-index:2;
        }
        .carousel-caption .title{
          margin:0 0 6px; font-family:'Agelia', system-ui, sans-serif;
          font-size: clamp(24px, 3vw, 36px); line-height:1.1; color:#0f0f0f;
        }
        .carousel-caption .sub{
          margin:0; font-family:'Cobbler Sans', system-ui, sans-serif;
          font-size: clamp(13px, 1.6vw, 16px); line-height:1.35; color:#222; opacity:.92;
        }
        .carousel-caption .heart{ position:absolute; top:-14px; right:-14px; width:72px; height:auto; pointer-events:none; }

        .carousel-btn{
          position:absolute; top:50%; transform:translateY(-50%);
          width:var(--arrow-size); height:var(--arrow-size);
          border:0; border-radius:50%; background:rgba(255,255,255,.28); color:#111;
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 4px 14px rgba(0,0,0,.18);
          cursor:pointer; user-select:none; backdrop-filter: blur(2px);
          transition: background .2s ease, transform .12s ease; z-index:3;
        }
        .carousel-btn:hover, .carousel-btn:focus-visible{ background:rgba(255,255,255,.65); transform:translateY(-50%) scale(1.06); outline:none; }
        .carousel-btn:active{ transform:translateY(-50%) scale(.98); }
        .carousel-btn.prev{ left:14px; } .carousel-btn.next{ right:14px; }
        .carousel-btn svg{ width:var(--arrow-icon); height:var(--arrow-icon); display:block; }

        @media (max-width: 780px){
          .carousel{ min-height:50vh; }
          .carousel-caption{ bottom:12px; width:calc(100% - 24px); padding-right:86px; }
          .carousel-caption .heart{ width:58px; top:-10px; right:-10px; }
          .carousel{ --arrow-size:56px; --arrow-icon:26px; }
          .carousel-btn.prev{ left:8px; } .carousel-btn.next{ right:8px; }
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
                loading="eager"      /* prioridad al hero */
                decoding="async"
                onError={(e)=>{ e.currentTarget.src='/images/placeholder.jpg' }}
              />
              <div className="carousel-caption">
                <div className="title">{it.title}</div>
                {!!it.excerpt && <p className="sub">{it.excerpt}</p>}
                <img
                  className="heart"
                  src="/ilustraciones/Ilustraciones_Mesa de trabajo 1 copia 2.png"
                  alt="" aria-hidden="true"
                />
              </div>
            </div>
          )
        })}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            className="carousel-btn prev"
            aria-label="Anterior"
            onClick={() => goto(index - 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            type="button"
            className="carousel-btn next"
            aria-label="Siguiente"
            onClick={() => goto(index + 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </>
      )}
    </div>
  )
}
