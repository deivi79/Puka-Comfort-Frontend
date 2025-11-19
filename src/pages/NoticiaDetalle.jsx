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

  // ============================
  // Cargar artículo
  // ============================
  useEffect(() => {
    const ctrl = new AbortController()

    ;(async () => {
      try {
        setError(null)
        setPost(null)

        let detail = null

        // Intentar por slug directamente
        try {
          detail = await api(`/api/news/articles/slug/${encodeURIComponent(slug)}/`, {
            signal: ctrl.signal,
          })
        } catch {
          // fallback: buscar por listado
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
        if (!ctrl.signal.aborted) {
          setError(err?.message || 'No se pudo cargar la noticia')
        }
      }
    })()

    return () => ctrl.abort()
  }, [slug])

  // ============================
  // Ordenar contenido (párrafos + imágenes + videos)
  // ============================
  const blocks = useMemo(() => {
    if (!post) return []

    const items = []

    // --- Párrafos ---
    if (post.parrafos) {
      post.parrafos.forEach(p => {
        const segments = (p.contenido || '')
          .replace(/\\n/g, '\n')
          .split(/\n{2,}/)
          .map(t => t.trim())
          .filter(Boolean)

        segments.forEach((text, idx) => {
          items.push({
            type: 'paragraph',
            orden: p.orden + idx * 0.01,
            key: `p-${p.id}-${idx}`,
            text,
            className: [
              p.id_centrado ? 'centrado' : '',
              p.negrita ? 'negrita' : '',
              p.cursiva ? 'cursiva' : '',
            ]
              .filter(Boolean)
              .join(' '),
          })
        })
      })
    }

    // --- Imágenes ---
    if (post.imagenes) {
      post.imagenes.forEach(img => {
        items.push({
          type: 'image',
          orden: img.orden,
          key: `img-${img.id}`,
          url: absUrl(img.url),
          origen: img.origen,
        })
      })
    }

    // --- Videos ---
    if (post.videos) {
      post.videos.forEach(vid => {
        const embed = vid.url.includes('watch?v=')
          ? vid.url.replace('watch?v=', 'embed/')
          : vid.url

        items.push({
          type: 'video',
          orden: vid.orden,
          key: `vid-${vid.id}`,
          url: embed,
        })
      })
    }

    return items.sort((a, b) => a.orden - b.orden)
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

  const portada = absUrl(post.imagen_principal || post.imagen_cover)

  // ============================
  // Render
  // ============================
  return (
    <main className="news-container">
      <style>{`
        :root{
          --radius:14px;
          --shadow:0 6px 18px rgba(0,0,0,.12);
          --bg:#fff;
          --maxHero: 840px;
          --maxCard: 860px;
        }

        body{
          background: var(--bg);
        }

        /* CONTENEDOR GENERAL */
        .news-container{
          max-width: 1200px;
          margin: 0 auto;
          padding: 28px 16px 40px;
          color:#2b2b2b;
          line-height:1.65;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, 'Cobbler Sans', sans-serif;
          background:#fff;
        }

        /* HERO */
        .news-hero{
          max-width: var(--maxHero);
          margin: 24px auto 14px;
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow);
        }

        .news-hero img{
          width: 100%;
          height: 260px; 
          object-fit: cover;
          object-position: center;
          border-radius: var(--radius);
        }

        /* HEADER */
        .news-header{
          max-width: var(--maxHero);
          margin: 10px auto 8px;
          text-align: center;
        }

        .pill{
          display:inline-block;
          padding:6px 12px;
          background:#fde7ef;
          color:#c40050;
          border-radius:999px;
          font-size:14px;
          margin-bottom:10px;
        }

        .news-header h1{
          font-family:'Agelia', serif;
          font-weight:800;
          font-size: clamp(22px, 3.2vw, 36px);
          line-height: 1.06;
          letter-spacing:-.02em;
          margin: 4px 0 8px;
        }

        .news-meta{
          display:flex;
          gap:8px;
          justify-content:center;
          color:#6b6b6b;
          font-size:15px;
        }

        /* TARJETA DE CONTENIDO */
        .news-card{
          max-width: var(--maxCard);
          margin: 20px auto;
          background:#fff;
          border-radius: var(--radius);
          padding: 28px;
          box-shadow: 0 4px 14px rgba(0,0,0,.08);
        }

        .news-content p{
          margin-bottom:18px;
          font-size:17px;
          white-space: pre-line;
          color:#333;
        }

        .centrado { text-align:center; }
        .izquierda { text-align:left; }
        .derecha { text-align:right; }
        .negrita { font-weight:700; }
        .cursiva { font-style:italic; }

        /* IMÁGENES INTERMEDIAS */
        .news-image{
          margin: 30px 0;
          text-align: center;
        }

        .news-image img{
          width: 70%;
          max-width: 600px;
          border-radius: 12px;
          display: block;
          margin: 0 auto;
          box-shadow: 0 2px 10px rgba(0,0,0,.1);
        }

        .news-image-caption{
          margin-top: 8px;
          font-size: 14px;
          color: #777;
          text-align: center;
        }

        /* VIDEOS */
        .news-video{
          margin:32px 0;
          position:relative;
          padding-bottom:56.25%;
          height:0;
          border-radius:12px;
          overflow:hidden;
          box-shadow:0 2px 10px rgba(0,0,0,.1);
        }
        .news-video iframe{
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          border:0;
        }

        /* AUTOR (ESTILO ORIGINAL) */
        .news-author{
          display:flex;
          gap:18px;
          align-items:flex-start;
          border-top:1px solid #eee;
          padding:24px;
          margin-top:36px;
          background:#fde7ef;
          border-radius:16px;
          box-shadow:0 3px 10px rgba(0,0,0,.1);
        }
        .news-author img{
          width:90px;
          height:90px;
          border-radius:50%;
          object-fit:cover;
          border:3px solid #f9c7cf;
        }
        .news-author-info{ flex:1; }
        .news-author-info strong{
          display:block;
          font-size:19px;
          color:#c40050;
          cursor:pointer;
          transition: color .2s;
        }
        .news-author-info strong:hover{
          color:#a90045;
          text-decoration:underline;
        }
        .news-author-info span{
          display:block;
          margin-top:4px;
        }
        .author-socials{
          display:flex;
          gap:10px;
          margin-top:10px;
        }
        .author-socials img{
          width:28px;
          height:28px;
        }
      `}</style>

      {/* HERO */}
      <Reveal className="news-hero">
        <img src={portada} alt={post.titulo} />
      </Reveal>

      {/* HEADER */}
      <section className="news-header">
        {post.categoria && <div className="pill">{post.categoria.nombre}</div>}
        <Reveal as="h1">{post.titulo}</Reveal>

        <div className="news-meta">
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

      {/* CONTENIDO */}
      <section className="news-card">
        <div className="news-content">
          {blocks.map(b => {
            if (b.type === 'paragraph') {
              return <p key={b.key} className={b.className}>{b.text}</p>
            }

            if (b.type === 'image') {
              return (
                <div key={b.key} className="news-image">
                  <img src={b.url} alt={b.origen || 'Imagen del artículo'} />
                  {b.origen && <div className="news-image-caption">{b.origen}</div>}
                </div>
              )
            }

            if (b.type === 'video') {
              return (
                <div key={b.key} className="news-video">
                  <iframe src={b.url} allowFullScreen />
                </div>
              )
            }

            return null
          })}

          {/* AUTOR */}
          {post.autor && (
            <div className="news-author">
              {post.autor.foto && (
                <img
                  src={absUrl(post.autor.foto)}
                  alt={post.autor.nombre}
                  loading="lazy"
                  decoding="async"
                />
              )}

              <div className="news-author-info">
                <strong onClick={() => nav(`/autor/${post.autor.slug}`)}>
                  {post.autor.nombre}
                </strong>

                {post.autor.cargo && <span>{post.autor.cargo}</span>}

                <div className="author-socials">
                  {post.autor.linkedin && (
                    <a href={post.autor.linkedin} target="_blank" rel="noopener noreferrer">
                      <img src="/icons/linkedin.png" alt="LinkedIn" />
                    </a>
                  )}
                  {post.autor.instagram && (
                    <a href={post.autor.instagram} target="_blank" rel="noopener noreferrer">
                      <img src="/icons/instagram.png" alt="Instagram" />
                    </a>
                  )}
                  {post.autor.twitter && (
                    <a href={post.autor.twitter} target="_blank" rel="noopener noreferrer">
                      <img src="/icons/twitter.png" alt="Twitter" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </main>
  )
}
