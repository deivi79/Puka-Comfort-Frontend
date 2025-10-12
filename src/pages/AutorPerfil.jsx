import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { absUrl } from '../url'
import Reveal from '../components/Reveal'

export default function AutorPerfil() {
  const { slug } = useParams()
  const [autor, setAutor] = useState(null)
  const [articulos, setArticulos] = useState([])
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  // 👇 Scroll al inicio al montar el componente
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api('/api/news/authors/')
        const list = Array.isArray(res?.results)
          ? res.results
          : Array.isArray(res)
          ? res
          : []
        const found = list.find((a) => a.slug === slug)
        if (!found) throw new Error('Autor no encontrado')

        setAutor(found)
        const artRes = await api(`/api/news/articles/?author__id=${found.id}`)
        setArticulos(Array.isArray(artRes.results) ? artRes.results : artRes)
      } catch (err) {
        console.error('Error cargando autor:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  if (loading)
    return <p style={{ textAlign: 'center', padding: 40 }}>Cargando perfil...</p>
  if (!autor)
    return (
      <p style={{ textAlign: 'center', color: 'crimson', padding: 40 }}>
        Autor no encontrado.
      </p>
    )

  return (
    <main className="autor-container">
      <style>{`
        .autor-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 24px;
          font-family: 'Cobbler Sans', system-ui, sans-serif;
        }

        /* === PERFIL (FONDO ROSA) === */
        .autor-box {
          display: flex;
          align-items: flex-start;
          gap: 24px;
          flex-wrap: wrap;
          background-color: #ffe6f0;
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 50px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }

        .autor-col-foto {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .autor-foto {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #f9c7cf;
        }

        .autor-socials {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        .autor-socials img {
          width: 28px;
          height: 28px;
          object-fit: contain;
          border: none;
          transition: transform 0.2s ease;
        }

        .autor-socials img:hover {
          transform: scale(1.1);
        }

        .autor-info {
          flex: 1;
          min-width: 280px;
        }

        .autor-info h1 {
          margin: 0;
          font-family: 'Agelia', serif;
          font-size: 28px;
          color: #c40050;
        }

        .autor-info strong {
          color: #222;
        }

        .autor-info p {
          margin: 6px 0;
          color: #333;
          line-height: 1.6;
        }

        .autor-info em {
          color: #555;
        }

        .autor-meta {
          margin-top: 12px;
          font-size: 14px;
          color: #444;
        }

        .autor-meta p {
          margin: 4px 0;
        }

        /* === PUBLICACIONES === */
        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .news-card {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,.08);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .news-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0,0,0,.12);
        }

        .news-figure {
          margin: 0;
          height: 180px;
          overflow: hidden;
        }

        .news-figure img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* === CUERPO DE LA TARJETA === */
        .news-body {
          padding: 14px 16px 18px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .news-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px; /* 🔹 pequeño margen natural */
        }

        .news-category {
          font-size: 13px;
          color: #c40050;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 4px;
        }

        .news-h3 {
          font-family: 'Cobbler Sans', sans-serif;
          font-size: 17px;
          font-weight: 700;
          margin: 0;
          color: #222;
          line-height: 1.4;
          max-height: 3.8em;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .news-meta {
          font-size: 13px;
          color: #777;
          margin-top: 4px;
        }

        /* === BOTÓN === */
        .news-btn {
          background: #E9B21E;
          color: #000;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          cursor: pointer;
          margin-top: 8px;
          transition: all 0.3s ease;
        }

        .news-btn:hover {
          background: #d4a11a;
          transform: scale(1.05);
        }
      `}</style>

      {/* === PERFIL DEL AUTOR === */}
      <Reveal className="autor-box">
        <div className="autor-col-foto">
          <img className="autor-foto" src={absUrl(autor.foto)} alt={autor.nombre} />

          <div className="autor-socials">
            {autor.linkedin && (
              <a href={autor.linkedin} target="_blank" rel="noopener noreferrer">
                <img src="/icons/linkedin.png" alt="LinkedIn" />
              </a>
            )}
            {autor.twitter && (
              <a href={autor.twitter} target="_blank" rel="noopener noreferrer">
                <img src="/icons/twitter.png" alt="Twitter" />
              </a>
            )}
            {autor.instagram && (
              <a href={autor.instagram} target="_blank" rel="noopener noreferrer">
                <img src="/icons/instagram.png" alt="Instagram" />
              </a>
            )}
            {autor.facebook && (
              <a href={autor.facebook} target="_blank" rel="noopener noreferrer">
                <img src="/icons/facebook.png" alt="Facebook" />
              </a>
            )}
            {autor.web_personal && (
              <a href={autor.web_personal} target="_blank" rel="noopener noreferrer">
                <img src="/icons/web.png" alt="Sitio web" />
              </a>
            )}
          </div>
        </div>

        <div className="autor-info">
          <h1>{autor.nombre}</h1>
          {autor.cargo && <p><strong>{autor.cargo}</strong></p>}
          {autor.bio && <p>{autor.bio}</p>}
          {autor.frase_personal && (
            <p><em>{autor.frase_personal}</em></p>
          )}

          <div className="autor-meta">
            {autor.ubicacion && <p><strong>Ubicación:</strong> {autor.ubicacion}</p>}
            {autor.especialidad && <p><strong>Especialidad:</strong> {autor.especialidad}</p>}
            {autor.institucion && <p><strong>Institución:</strong> {autor.institucion}</p>}
            {autor.intereses && <p><strong>Intereses:</strong> {autor.intereses}</p>}
            {autor.email && (
              <p>
                <strong>Contacto:</strong>{' '}
                <a href={`mailto:${autor.email}`}>{autor.email}</a>
              </p>
            )}
          </div>
        </div>
      </Reveal>

      {/* === PUBLICACIONES === */}
      <Reveal
        as="h2"
        style={{
          fontFamily: 'Agelia',
          color: '#c40050',
          marginBottom: '20px'
        }}
      >
        Publicaciones de {autor.nombre}
      </Reveal>

      <div className="news-grid">
        {articulos.length === 0 ? (
          <p>No hay artículos publicados por este autor aún.</p>
        ) : (
          articulos.map((p, i) => (
            <Reveal key={p.id || i} className="news-card" delay={70 * i}>
              <figure className="news-figure">
                <img
                  src={absUrl(p.imagen_cover || p.imagen_principal)}
                  alt={p.titulo}
                />
              </figure>

              <div className="news-body">
                <div className="news-header">
                  {p.categoria && (
                    <p className="news-category">
                      {typeof p.categoria === 'object'
                        ? p.categoria.nombre
                        : p.categoria}
                    </p>
                  )}
                  <h3 className="news-h3">{p.titulo}</h3>
                  <p className="news-meta">
                    {p.fecha_publicacion &&
                      new Date(p.fecha_publicacion).toLocaleDateString('es-PE')}
                  </p>
                </div>

                <button
                  className="news-btn"
                  onClick={() => nav(`/noticias/${p.slug}`)}
                >
                  Leer más
                </button>
              </div>
            </Reveal>
          ))
        )}
      </div>
    </main>
  )
}
