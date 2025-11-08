import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import Reveal from '../components/Reveal'
import { absUrl } from '../url'

export default function NoticiaDetalle() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)
  const nav = useNavigate()

  useEffect(() => {
    const ctrl = new AbortController()
    ;(async () => {
      try {
        setError(null)
        setPost(null)

        // 1) Intento directo por slug
        let detail = null
        try {
          detail = await api(`/api/news/articles/slug/${encodeURIComponent(slug)}/`, {
            signal: ctrl.signal,
          })
        } catch {
          // 2) Fallback: lista -> buscar -> detalle
          if (ctrl.signal.aborted) return
          const res = await api('/api/news/articles/', { signal: ctrl.signal })
          const list = Array.isArray(res)
            ? res
            : Array.isArray(res?.results)
            ? res.results
            : Array.isArray(res?.data)
            ? res.data
            : []
          const found = list.find(a => a.slug === slug)
          if (!found) throw new Error('Artículo no encontrado')
          detail = await api(`/api/news/articles/id/${found.id}/`, { signal: ctrl.signal })
        }

        if (!ctrl.signal.aborted) setPost(detail)
      } catch (err) {
        if (!ctrl.signal.aborted) setError(err?.message || 'No se pudo cargar la noticia')
      }
    })()
    return () => ctrl.abort()
  }, [slug])

  // Párrafos procesados una sola vez
  const blocks = useMemo(() => {
    if (!post?.parrafos) return []
    return post.parrafos
      .slice()
      .sort((a, b) => a.orden - b.orden)
      .flatMap(p =>
        (p.contenido || '')
          .replace(/\\n/g, '\n')
          .split(/\n{2,}/)
          .map((segment, i) => ({
            key: `${p.id}-${i}`,
            className: [
              p.id_centrado ? 'centrado' : '',
              p.negrita ? 'negrita' : '',
              p.cursiva ? 'cursiva' : '',
            ].filter(Boolean).join(' '),
            text: segment.trim(),
          }))
      )
  }, [post])

  if (error) {
    return (
      <main className="container py-5">
        <p style={{ color: 'crimson' }}>⚠️ Error: {error}</p>
      </main>
    )
  }
  if (!post) {
    return (
      <main className="container py-5">
        <p>Cargando…</p>
      </main>
    )
  }

  const portada = absUrl(post.imagen_principal || post.imagen_cover) || '/images/placeholder.jpg'

  return (
    <main className="news-container">
      {/* Prioriza la imagen LCP */}
      <link rel="preload" as="image" href={portada} imagesizes="100vw" />

      <style>{`
        :root{
          --radius:14px;
          --shadow:0 6px 18px rgba(0,0,0,.12);
          --bg:#fff;           /* fondo general blanco */
          --maxHero: 840px;    /* ancho del hero y del header */
          --maxCard: 860px;    /* ancho de la tarjeta de contenido */
        }

        /* Fondo blanco en toda la vista */
        body{ background: var(--bg); }

        .news-container{
          max-width: 1200px;
          margin: 0 auto;
          padding: 28px 16px 40px;
          color:#2b2b2b;
          line-height:1.65;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, 'Cobbler Sans', sans-serif;
          background: #fff; /* asegura lienzo blanco */
        }

        /* HERO pequeño, centrado, con sombra y bordes redondeados */
        .news-hero{
          max-width: var(--maxHero);
          margin: 24px auto 14px;
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow);
        }
        .news-hero picture,.news-hero img{ display:block; width:100%; height:auto; }
        .news-hero img{
          aspect-ratio: 21/9;   /* mantiene proporciones */
          object-fit: cover;
          border-radius: var(--radius);
        }

        /* Header con el mismo ancho del hero */
        .news-header{
          max-width: var(--maxHero);
          margin: 10px auto 8px;
          text-align: center;
          padding: 0 8px;
        }
        .pill{
          display:inline-block;
          padding:6px 12px;
          background:#fde7ef;
          color:#c40050;
          border-radius:999px;
          font-size:14px;
          margin: 10px auto 8px;
        }
        .news-header h1{
          font-family:'Agelia', serif;
          font-weight:800;
          font-size: clamp(22px, 3.2vw, 36px); /* ↓ menor en móvil y desktop */
          line-height: 1.06;                   /* un pelín más compacto */
          letter-spacing:-.02em;
          margin: 4px 0 8px;
        }
        .news-meta{
          display:flex; align-items:center; justify-content:center;
          gap:8px; color:#6b6b6b; font-size:15px; margin-bottom: 10px;
        }
        .news-meta svg{ width:18px; height:18px; color:#5f73ff; flex-shrink:0; }

        /* Tarjeta de contenido */
        .news-card{
          max-width: var(--maxCard);
          margin: 12px auto 0;
          background:#fff;
          border-radius: var(--radius);
          padding: 28px;
          box-shadow: 0 4px 14px rgba(0,0,0,.08);
        }
        .news-content p{
          margin-bottom:18px; font-size:17px; color:#333; white-space: pre-line;
        }
        .news-content p.centrado{text-align:center;}
        .news-content p.izquierda{text-align:left;}
        .news-content p.derecha{text-align:right;}
        .news-content p.negrita{font-weight:700;}
        .news-content p.cursiva{font-style:italic;}

        .news-image{ text-align:center; margin:32px 0; }
        .news-image img{
          max-width:100%;
          border-radius:12px;
          box-shadow:0 2px 10px rgba(0,0,0,.1);
        }
        .news-image span{ display:block; font-size:14px; color:#777; margin-top:6px; }

        .news-video{
          position:relative; padding-bottom:56.25%; height:0;
          overflow:hidden; margin:32px 0; border-radius:12px;
          box-shadow:0 2px 10px rgba(0,0,0,.1);
        }
        .news-video iframe{ position:absolute; inset:0; width:100%; height:100%; border:0; }

        /* Autor */
        .news-author{
          display:flex; gap:18px; align-items:flex-start;
          border-top:1px solid #eee; padding:24px; margin-top:36px;
          background:#fde7ef; border-radius:16px; box-shadow:0 3px 10px rgba(0,0,0,.1);
        }
        .news-author img{ width:90px; height:90px; border-radius:50%; object-fit:cover; border:3px solid #f9c7cf; }
        .news-author-info{ flex:1; }
        .news-author-info strong{ display:block; font-size:19px; color:#c40050; cursor:pointer; transition:color .2s; }
        .news-author-info strong:hover{ color:#a90045; text-decoration:underline; }
        .author-socials{ display:flex; gap:10px; margin-top:10px; }
        .author-socials img{ width:28px; height:28px; }

        @media (max-width: 900px){
          :root{ --maxHero: 92vw; --maxCard: 94vw; }
          .news-card{ padding:22px; }
        }
      `}</style>

      {/* HERO */}
      <Reveal className="news-hero">
        <picture>
          <source srcSet={portada} type="image/avif" />
          <source srcSet={portada} type="image/webp" />
          <img
            src={portada}
            alt={post.titulo}
            width={1600}
            height={685}
            decoding="async"
            loading="eager"
            fetchpriority="high"
            sizes="(max-width: 900px) 92vw, 840px"  /* pide tamaño acorde al nuevo ancho */
            onError={(e) => { e.currentTarget.src = '/images/placeholder.jpg' }}
          />
        </picture>
      </Reveal>

      {/* Header (mismo ancho que hero) */}
      <section className="news-header">
        {post.categoria && <div className="pill">{post.categoria.nombre}</div>}
        <Reveal as="h1">{post.titulo}</Reveal>

        <div className="news-meta">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 2v3M17 2v3M3 9h18M5 6h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {post.fecha_publicacion && (
            <span>
              {new Date(post.fecha_publicacion).toLocaleDateString('es-PE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
      </section>

      {/* Contenido */}
      <section className="news-card">
        <div className="news-content">
          {blocks.map(b => (
            <p key={b.key} className={b.className}>{b.text}</p>
          ))}

          {post.imagenes?.map((img) => {
            const u = absUrl(img.url)
            return (
              <div key={img.id} className="news-image">
                <picture>
                  <source srcSet={u} type="image/avif" />
                  <source srcSet={u} type="image/webp" />
                  <img
                    src={u}
                    alt={img.origen || 'Imagen del artículo'}
                    loading="lazy"
                    decoding="async"
                    width={1200}
                    height={800}
                    onError={(e)=>{ e.currentTarget.src='/images/placeholder.jpg' }}
                  />
                </picture>
                {img.origen && <span>📸 {img.origen}</span>}
              </div>
            )
          })}

          {post.videos?.map((vid) => {
            const embed = (vid.url || '').includes('watch?v=') ? vid.url.replace('watch?v=','embed/') : vid.url
            return (
              <div key={vid.id} className="news-video">
                <iframe
                  src={embed}
                  title={vid.titulo || 'Video'}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )
          })}

          {post.autor && (
            <div className="news-author">
              {post.autor.foto && (
                <img
                  src={absUrl(post.autor.foto)}
                  alt={post.autor.nombre}
                  width={90} height={90}
                  loading="lazy" decoding="async"
                  onError={(e)=>{ e.currentTarget.src='/images/placeholder.jpg' }}
                />
              )}
              <div className="news-author-info">
                <strong onClick={() => nav(`/autor/${post.autor.slug}`)}>{post.autor.nombre}</strong>
                {post.autor.cargo && <span>{post.autor.cargo}</span>}
                <div className="author-socials">
                  {post.autor.linkedin && <a href={post.autor.linkedin} target="_blank" rel="noopener noreferrer"><img src="/icons/linkedin.png" alt="LinkedIn" loading="lazy" /></a>}
                  {post.autor.instagram && <a href={post.autor.instagram} target="_blank" rel="noopener noreferrer"><img src="/icons/instagram.png" alt="Instagram" loading="lazy" /></a>}
                  {post.autor.twitter && <a href={post.autor.twitter} target="_blank" rel="noopener noreferrer"><img src="/icons/twitter.png" alt="Twitter" loading="lazy" /></a>}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
