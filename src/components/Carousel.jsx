import { useEffect, useRef, useState } from 'react'

export default function Carousel({ items = [], interval = 5000, onClickSlide }) {
  console.log('🧩 Carousel recibe:', items)
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
          border-radius:10px;
          background:#f6f6f6;
          height:80vh;
          max-height:960px;
          --arrow-size:80px;
          --arrow-icon:38px;
          --edge-gap: calc(var(--arrow-size) + 24px);
        }

        .carousel-track{ display:flex; height:100%; transition: transform .55s ease; }
        .carousel-slide{ min-width:100%; position:relative; height:100%; outline:none; cursor:pointer; }
        .carousel-slide img{ width:100%; height:100%; object-fit:cover; object-position:center; display:block; }

        /* ===== Caption principal ===== */
        .carousel-caption{
          position:absolute; 
          left:50%; 
          transform:translateX(-50%); 
          bottom:48px;
          width: calc(100% - (var(--edge-gap) * 2));
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(6px);
          border-radius:20px;
          padding:32px 44px;
          box-shadow:0 16px 42px rgba(0,0,0,.25);
          text-align:center; 
          z-index:2;
        }

        .carousel-caption .title{
          margin:0 0 8px;
          font-family:'Agelia', system-ui, sans-serif;
          font-size: clamp(28px, 3.6vw, 44px);
          line-height:1.15;
          color:#222;
        }

        .carousel-caption .sub{
          margin:0 0 16px;
          font-size: clamp(14px, 1.6vw, 18px);
          color:#333;
          opacity:.9;
        }

        /* ===== Línea de meta-información ===== */
        .carousel-meta {
          display:flex;
          flex-wrap:wrap;
          justify-content:center;
          align-items:center;
          gap:10px;
          font-size:14px;
          color:#555;
          opacity:.9;
        }
        .carousel-meta span {
          display:flex;
          align-items:center;
          gap:4px;
        }
        .carousel-meta .dot {
          width:4px;
          height:4px;
          background:#777;
          border-radius:50%;
          margin: 0 6px;
        }

        /* ===== Corazón decorativo ===== */
        .carousel-caption .heart{
          position:absolute;
          top:-10px;
          right:-10px;
          width:60px;   /* 🔹 más pequeño que antes */
          height:auto;
          pointer-events:none;
          z-index:3;
          transform: rotate(10deg); /* pequeño giro decorativo opcional */
        }

        /* ===== Botones laterales ===== */
        .carousel-btn{
          position:absolute; top:50%; transform:translateY(-50%);
          width:var(--arrow-size); height:var(--arrow-size);
          border:0; border-radius:50%;
          background:linear-gradient(145deg,#fff,#f1f1f1);
          color:#111;
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 6px 16px rgba(0,0,0,.2);
          cursor:pointer; user-select:none; backdrop-filter: blur(2px);
          transition: all .25s ease; z-index:3;
        }
        .carousel-btn:hover, .carousel-btn:focus-visible{
          background:linear-gradient(145deg,#fff,#e6e6e6);
          transform:translateY(-50%) scale(1.08);
        }
        .carousel-btn:active{ transform:translateY(-50%) scale(.96); }
        .carousel-btn.prev{ left:18px; }
        .carousel-btn.next{ right:18px; }
        .carousel-btn svg{ width:var(--arrow-icon); height:var(--arrow-icon); display:block; }

        /* ===== Responsive ===== */
        @media (max-width: 900px){
          .carousel{ height:70vh; }
          .carousel-caption{ bottom:28px; padding:22px 24px; }
          .carousel-caption .heart{ width:50px; top:-8px; right:-8px; }
        }
        @media (max-width: 520px){
          .carousel{ height:60vh; }
          .carousel-caption{ padding:14px 16px; border-radius:14px; bottom:12px; }
          .carousel-caption .title{ font-size: clamp(18px, 5vw, 24px); }
          .carousel-caption .sub{
            font-size: clamp(12px, 3.6vw, 14px);
            display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:3; overflow:hidden;
          }
          .carousel-meta{ flex-direction:column; gap:6px; font-size:13px; }
          .carousel-caption .heart{ width:40px; top:-6px; right:-6px; }
          .carousel-btn.prev{ left:8px; } .carousel-btn.next{ right:8px; }
        }
      `}</style>

      <div
        className="carousel-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
        aria-live="polite"
      >
        {items.map((it, i) => {
          let src = it.hero_image || it.cover_image || '/images/placeholder.jpg'
          if (src?.endsWith('?')) src = src.slice(0, -1) // limpiar el "?"

          const author = it.author?.name ?? 'Puka Comfort'
          const category = it.category?.name ?? 'General'
          const date = it.published_at
            ? new Date(it.published_at).toLocaleDateString('es-PE', {
                year: 'numeric', month: 'short', day: 'numeric'
              })
            : null

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

              {/* === Contenido principal === */}
              <div className="carousel-caption">
                <img
                  className="heart"
                  src="/ilustraciones/Ilustraciones_Mesa de trabajo 1 copia 2.png"
                  alt=""
                  aria-hidden="true"
                />
                <div className="title">{it.title}</div>
                {!!it.excerpt && <p className="sub">{it.excerpt}</p>}

                {/* Meta información discreta */}
                <div className="carousel-meta">
                  {date && <span>📅 {date}</span>}
                  <span className="dot" />
                  <span>✍️ {author}</span>
                  <span className="dot" />
                  <span>🏷️ {category}</span>
                </div>
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
