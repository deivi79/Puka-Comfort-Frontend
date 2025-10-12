import { useEffect, useState } from 'react'
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
    let alive = true
    ;(async () => {
      try {
        const res = await api('/api/news/articles/')
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.results)
          ? res.results
          : Array.isArray(res?.data)
          ? res.data
          : []

        const found = list.find((a) => a.slug === slug)
        if (!found) throw new Error('Artículo no encontrado')

        const detail = await api(`/api/news/articles/id/${found.id}/`)
        if (alive) setPost(detail)
      } catch (err) {
        if (alive) setError(err.message)
      }
    })()
    return () => {
      alive = false
    }
  }, [slug])

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

  const portada =
    absUrl(post.imagen_principal || post.imagen_cover) || '/images/placeholder.jpg'

  return (
    <main className="news-container">
      <style>{`
        @font-face {
          font-family: 'Cobbler Sans';
          src: url('/fonts/CobblerSansTest-Regular-BF67590d214469d.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
        }

        .news-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 20px;
          font-family: 'Cobbler Sans', system-ui, sans-serif;
          line-height: 1.65;
          color: #2b2b2b;
        }

        .news-header { text-align: center; margin-bottom: 24px; }
        .news-header h1 {
          font-family: 'Agelia', serif;
          font-size: 36px;
          line-height: 1.1;
          margin-bottom: 12px;
        }

        .news-meta { font-size: 15px; color: #666; margin-bottom: 24px; }

        .news-hero img {
          width: 100%;
          border-radius: 12px;
          margin-bottom: 28px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .news-content-box {
          background: #fff;
          border-radius: 12px;
          padding: 28px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          margin-bottom: 32px;
        }

        .news-content p {
          margin-bottom: 18px;
          font-size: 17px;
          font-family: 'Cobbler Sans', system-ui, sans-serif;
          white-space: pre-line;
          color: #333;
        }
        .news-content p.centrado { text-align: center; }
        .news-content p.izquierda { text-align: left; }
        .news-content p.derecha { text-align: right; }
        .news-content p.negrita { font-weight: bold; }
        .news-content p.cursiva { font-style: italic; }

        .news-image {
          text-align: center;
          margin: 32px 0;
        }
        .news-image img {
          max-width: 100%;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .news-image span {
          display: block;
          font-size: 14px;
          color: #777;
          margin-top: 6px;
        }

        .news-video {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
          margin: 32px 0;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .news-video iframe {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          border: 0;
        }

        /* ===== Autor (actualizado con fondo rosa) ===== */
        .news-author {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          border-top: 1px solid #eee;
          padding: 24px;
          margin-top: 36px;
          background: #fde7ef;                /* 🎨 Fondo rosa */
          border-radius: 16px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }

        .news-author img {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #f9c7cf;          /* Borde rosa suave */
          flex-shrink: 0;
        }

        .news-author-info { flex: 1; }

        .news-author-info strong {
          display: block;
          font-size: 19px;
          color: #c40050;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .news-author-info strong:hover {
          color: #a90045;
          text-decoration: underline;
        }

        .news-author-info span {
          font-size: 15px;
          color: #555;
        }

        .news-author-bio {
          font-size: 15px;
          color: #444;
          margin-top: 6px;
          text-align: justify;
        }

        /* ===== Redes sociales del autor ===== */
        .author-socials {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .author-socials img {
          width: 28px;
          height: 28px;
          border-radius: 0;
          transition: transform 0.2s ease;
        }

        .author-socials img:hover {
          transform: scale(1.1);
        }
      `}</style>

      {/* Imagen principal */}
      <Reveal className="news-hero">
        <img src={portada} alt={post.titulo} />
      </Reveal>

      {/* Cabecera */}
      <section className="news-header">
        {post.categoria && (
          <div
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: '#fde7ef',
              color: '#c40050',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '8px'
            }}
          >
            {post.categoria.nombre}
          </div>
        )}
        <Reveal as="h1">{post.titulo}</Reveal>
        <div className="news-meta">
          {post.fecha_publicacion && (
            <span>
              🗓️{' '}
              {new Date(post.fecha_publicacion).toLocaleDateString('es-PE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          )}
        </div>
      </section>

      {/* Cuerpo del artículo */}
      <Reveal className="news-content-box" delay={80}>
        <div className="news-content">
          {/* Párrafos */}
          {post.parrafos
            ?.sort((a, b) => a.orden - b.orden)
            .map((p) =>
              p.contenido
                .replace(/\\n/g, '\n')
                .split(/\n{2,}/)
                .map((segment, i) => (
                  <p
                    key={`${p.id}-${i}`}
                    className={[
                      p.id_centrado,
                      p.negrita ? 'negrita' : '',
                      p.cursiva ? 'cursiva' : ''
                    ].join(' ')}
                  >
                    {segment.trim()}
                  </p>
                ))
            )}

          {/* Imágenes intercaladas */}
          {post.imagenes?.map((img) => (
            <div key={img.id} className="news-image">
              <img src={absUrl(img.url)} alt={img.origen || 'Imagen del artículo'} />
              {img.origen && <span>📸 {img.origen}</span>}
            </div>
          ))}

          {/* Videos */}
          {post.videos?.map((vid) => (
            <div key={vid.id} className="news-video">
              <iframe
                src={vid.url.replace('watch?v=', 'embed/')}
                title={vid.titulo}
                allowFullScreen
              ></iframe>
            </div>
          ))}

          {/* Autor */}
          {post.autor && (
            <div className="news-author">
              {post.autor.foto && (
                <img src={absUrl(post.autor.foto)} alt={post.autor.nombre} />
              )}
              <div className="news-author-info">
                <strong onClick={() => nav(`/autor/${post.autor.slug}`)}>
                  {post.autor.nombre}
                </strong>
                {post.autor.cargo && <span>{post.autor.cargo}</span>}
                {/*post.autor.bio && <p className="news-author-bio">{post.autor.bio}</p>*/}

                {/* Redes sociales del autor */}
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
      </Reveal>
    </main>
  )
}
