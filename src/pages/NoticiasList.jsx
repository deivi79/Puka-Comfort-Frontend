import { useEffect, useState } from 'react'
import { api } from '../api'
import { absUrl } from '../url'
import { useNavigate } from 'react-router-dom'
import Reveal from '../components/Reveal'

export default function NoticiasList() {
  const [data, setData] = useState({ results: [], count: 0 })
  const [authors, setAuthors] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    author__id: '',
    category__id: '',
  })
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const pageSize = 8

  // ==========================================================
  // 🔹 Cargar autores y categorías
  // ==========================================================
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [a, c] = await Promise.all([
          api('/api/news/authors/'),
          api('/api/news/categories/'),
        ])
        setAuthors(Array.isArray(a.results) ? a.results : a)
        setCategories(Array.isArray(c.results) ? c.results : c)
      } catch (e) {
        console.error('Error cargando autores o categorías:', e)
      }
    }
    fetchOptions()
  }, [])

  // ==========================================================
  // 🔹 Cargar artículos
  // ==========================================================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const query = new URLSearchParams({
          page,
          page_size: pageSize,
          ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
        }).toString()

        const res = await api(`/api/news/articles/?${query}`)
        const list = Array.isArray(res.results)
          ? res
          : { results: Array.isArray(res) ? res : [], count: res.count || 0 }

        setData(list)
      } catch (e) {
        console.error('Error cargando artículos:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [filters, page])

  // ==========================================================
  // 🔹 Manejar filtros
  // ==========================================================
  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters((f) => ({ ...f, [name]: value }))
    setPage(1)

    if (name === 'author__id') {
      const found = authors.find((a) => String(a.id) === value)
      setSelectedAuthor(found || null)
    }
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      author__id: '',
      category__id: '',
    })
    setSelectedAuthor(null)
    setPage(1)
  }

  const totalPages = Math.ceil((data.count || 0) / pageSize)
  const prevPage = () => setPage((p) => Math.max(1, p - 1))
  const nextPage = () => setPage((p) => Math.min(totalPages, p + 1))

  // ==========================================================
  // 🔹 Render
  // ==========================================================
  return (
    <main>
      <style>{`
        .news-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px;
          font-family: 'Cobbler Sans', system-ui, sans-serif;
        }

        .news-title {
          font-family: 'Agelia', serif;
          font-size: 34px;
          color: #c40050;
          margin: 20px 0 24px;
          text-align: center;
        }

        /* === FILTROS === */
        .filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 12px;
        }
        .filters label {
          font-size: 14px;
          margin-bottom: 4px;
          color: #444;
          display: block;
        }
        .filters input,
        .filters select {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
        }
        .clear-btn {
          background: #e25d5d;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 14px;
          cursor: pointer;
          transition: background 0.3s;
          margin: 16px 0 28px;
          display: inline-block;
        }
        .clear-btn:hover {
          background: #c14b4b;
        }

        /* === TARJETAS === */
        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 28px;
        }

        .news-card {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .news-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .news-figure {
          margin: 0;
          height: 200px;
          overflow: hidden;
        }

        .news-figure img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .news-card:hover .news-figure img {
          transform: scale(1.05);
        }

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
          margin-bottom: 10px;
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

        .news-meta .autor-link {
          color: #c40050;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
        }

        .news-meta .autor-link:hover {
          text-decoration: underline;
        }

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

        /* === PAGINACIÓN === */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 28px;
        }

        .pagination button {
          background: #c40050;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 8px 14px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .pagination button:hover {
          background: #a90045;
        }

        .pagination button:disabled {
          background: #ccc;
          cursor: default;
        }
      `}</style>

      <div className="news-wrap">
        <Reveal as="h1" className="news-title">Noticias</Reveal>

        {/* === FILTROS === */}
        <div className="filters">
          <div>
            <label>Buscar por título</label>
            <input
              type="text"
              name="search"
              placeholder="Ej. menstruación..."
              value={filters.search}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Autor</label>
            <select
              name="author__id"
              value={filters.author__id}
              onChange={handleChange}
            >
              <option value="">Todos</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Categoría</label>
            <select
              name="category__id"
              value={filters.category__id}
              onChange={handleChange}
            >
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="clear-btn" onClick={clearFilters}>
          Limpiar filtros
        </button>

        {/* === ARTÍCULOS === */}
        {loading ? (
          <p>Cargando artículos...</p>
        ) : (
          <div className="news-grid">
            {(data.results || []).map((p, i) => {
              const img =
                absUrl(p.imagen_cover || p.hero_image || p.cover_image) ||
                '/images/placeholder.jpg'
              return (
                <Reveal key={p.slug || p.id || i} className="news-card" delay={70 * i}>
                  <figure className="news-figure">
                    <img src={img} alt={p.titulo || p.title} />
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
                      <h3 className="news-h3">{p.titulo || p.title}</h3>

                      {/* 🔹 Meta: autor clickeable, categoría y fecha */}
                      <p className="news-meta">
                        {p.autor?.nombre && (
                          <span
                            className="autor-link"
                            onClick={() => nav(`/autor/${p.autor.slug}`)}
                          >
                            {p.autor.nombre}
                          </span>
                        )}
                        {p.categoria?.nombre && <> · {p.categoria.nombre}</>}
                        {p.fecha_publicacion && (
                          <> · {new Date(p.fecha_publicacion).toLocaleDateString('es-PE')}</>
                        )}
                      </p>
                    </div>

                    <button
                      className="news-btn"
                      onClick={() => nav(`/noticias/${p.slug || p.id}`)}
                    >
                      Leer más
                    </button>
                  </div>
                </Reveal>
              )
            })}
          </div>
        )}

        {/* === PAGINACIÓN === */}
        <div className="pagination">
          <button onClick={prevPage} disabled={page === 1}>
            Anterior
          </button>
          <span>
            Página {page} de {totalPages || 1}
          </span>
          <button onClick={nextPage} disabled={page >= totalPages}>
            Siguiente
          </button>
        </div>
      </div>
    </main>
  )
}
