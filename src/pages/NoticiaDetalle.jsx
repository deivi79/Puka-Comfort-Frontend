import { useEffect, useState } from 'react'
import { api } from '../api'
import { useParams } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { absUrl } from '../url'

export default function NoticiaDetalle() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)

  useEffect(() => {
    api(`/api/news/posts/${slug}/`).then(setPost)
  }, [slug])

  if (!post) {
    return (
      <main className="container py-5">
        <p>Cargando…</p>
      </main>
    )
  }

  return (
    <main className="news-container">
      <style>{`
        .news-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 20px;
          font-family: 'Cobbler Sans', system-ui, sans-serif;
          line-height: 1.65;
          color: #2b2b2b;
        }
        .news-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .news-header h1 {
          font-family: 'Agelia', serif;
          font-size: 36px;
          line-height: 1.1;
          margin-bottom: 12px;
        }
        .news-meta {
          font-size: 15px;
          color: #666;
          margin-bottom: 24px;
        }
        .news-meta span {
          margin-right: 10px;
        }
        .news-hero {
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          margin: 0 auto 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .news-hero img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }
        .news-content {
          background: #fff;
          border-radius: 12px;
          padding: 24px 28px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }
        .news-content p {
          margin-bottom: 18px;
          font-size: 17px;
        }
        .news-content h2 {
          font-size: 22px;
          margin: 32px 0 14px;
        }

        /* ===== Autor ===== */
        .news-author {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          border-top: 1px solid #eee;
          padding-top: 24px;
          margin-top: 36px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          padding: 20px;
        }
        .news-author img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #f2f2f2;
          flex-shrink: 0;
        }
        .news-author-info {
          flex: 1;
          line-height: 1.5;
        }
        .news-author-info strong {
          display: block;
          font-size: 18px;
          color: #c40050;
        }
        .news-author-info span {
          display: block;
          font-size: 15px;
          color: #777;
          margin-bottom: 4px;
        }
        .news-author-bio {
          font-size: 15px;
          color: #555;
          margin-top: 6px;
          text-align: justify;
        }
        .news-author-links {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .news-author-links a {
          font-size: 14px;
          color: #c40050;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .news-author-links a:hover {
          color: #9a0040;
          text-decoration: underline;
        }

        /* ===== Imagen final ===== */
        .news-end {
          margin-top: 40px;
          text-align: center;
        }
        .news-end img {
          max-width: 100%;
          border-radius: 12px;
        }
        .news-end-caption {
          font-size: 14px;
          color: #777;
          margin-top: 6px;
        }
      `}</style>

      {/* Imagen de portada */}
      {post.hero_image && (
        <Reveal className="news-hero">
          <img src={absUrl(post.hero_image)} alt={post.title} />
        </Reveal>
      )}

      {/* Cabecera */}
      <section className="news-header">
        {post.category && (
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
            {post.category.name}
          </div>
        )}
        <Reveal as="h1">{post.title}</Reveal>
        <div className="news-meta">
          {post.published_at && (
            <span>
              🗓️{' '}
              {new Date(post.published_at).toLocaleDateString('es-PE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          )}
        </div>
      </section>

      {/* Cuerpo */}
      <Reveal className="news-content" delay={80}>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* Autor */}
        {post.author && (
          <div className="news-author">
            {/* Foto del autor */}
            {post.author.photo && (
              <img src={absUrl(post.author.photo)} alt={post.author.name} />
            )}

            {/* Información del autor */}
            <div className="news-author-info">
              <strong>{post.author.name}</strong>
              {post.author.position && (
                <span>{post.author.position}</span>
              )}

              {/* Biografía o descripción */}
              {post.author.bio && (
                <p className="news-author-bio">{post.author.bio}</p>
              )}

              {/* Redes sociales */}
              {(post.author.linkedin ||
                post.author.twitter ||
                post.author.instagram ||
                post.author.facebook ||
                post.author.website) && (
                <div className="news-author-links">
                  {post.author.website && (
                    <a
                      href={post.author.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      🌐 Sitio web
                    </a>
                  )}
                  {post.author.linkedin && (
                    <a
                      href={post.author.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      💼 LinkedIn
                    </a>
                  )}
                  {post.author.instagram && (
                    <a
                      href={post.author.instagram}
                      target="_blank"
                      rel="noreferrer"
                    >
                      📸 Instagram
                    </a>
                  )}
                  {post.author.twitter && (
                    <a
                      href={post.author.twitter}
                      target="_blank"
                      rel="noreferrer"
                    >
                      🐦 Twitter
                    </a>
                  )}
                  {post.author.facebook && (
                    <a
                      href={post.author.facebook}
                      target="_blank"
                      rel="noreferrer"
                    >
                      👍 Facebook
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Reveal>

      {/* Imagen final */}
      {post.end_image && (
        <Reveal className="news-end" delay={120}>
          <img src={absUrl(post.end_image)} alt="Imagen final" />
          <p className="news-end-caption">Fotografía: Puka Comfort</p>
        </Reveal>
      )}
    </main>
  )
}
