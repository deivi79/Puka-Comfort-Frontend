import { useEffect, useState } from 'react'
import { api } from '../api'
import { absUrl } from '../url'
import { useNavigate } from 'react-router-dom'
import Reveal from '../components/Reveal'

export default function NoticiasList() {
  const [data, setData] = useState({ results: [] })
  const [authors, setAuthors] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    author__id: '',
    category__id: '',
    published_at__gte: '',
    published_at__lte: '',
  })
  const nav = useNavigate()

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [a, c] = await Promise.all([
          api('/api/news/authors/'),
          api('/api/news/categories/')
        ])
        setAuthors(Array.isArray(a) ? a : a.results || [])
        setCategories(Array.isArray(c) ? c : c.results || [])
      } catch (e) {
        console.error('Error cargando autores o categorías:', e)
      }
    }
    fetchOptions()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = new URLSearchParams(
          Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
        ).toString()
        const res = await api(`/api/news/posts/?${query}`)
        setData(Array.isArray(res) ? { results: res } : (res || { results: [] }))
      } catch (e) {
        console.error('Error cargando noticias:', e)
      }
    }
    fetchData()
  }, [filters])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters(f => ({ ...f, [name]: value }))
  }

  const clearFilters = () =>
    setFilters({
      search: '',
      author__id: '',
      category__id: '',
      published_at__gte: '',
      published_at__lte: '',
    })

  return (
    <main>
      <style>{`
        .news-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px;
        }

        .news-title {
          font-family:'Agelia', system-ui, sans-serif;
          font-size: 34px;
          line-height:1.05;
          margin: 20px 0 12px;
        }

        /* --- FILTROS --- */
        .filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 12px;
        }

        .filters label {
          font-size: 14px;
          display: block;
          margin-bottom: 4px;
          color: #444;
        }

        .filters input, .filters select {
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
          transition: background .3s;
          margin: 16px 0 28px;
          display: inline-block;
        }

        .clear-btn:hover {
          background: #c14b4b;
        }

        /* --- GRILLA DE NOTICIAS --- */
        .news-grid {
          display:grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 28px;
          align-items: stretch;
        }

        .news-card {
          display:flex;
          flex-direction:column;
          overflow:hidden;
          border-radius: 12px;
          height:100%;
          box-shadow: 0 2px 8px rgba(0,0,0,.08);
        }

        .news-figure {
          margin:0;
          height:260px;
          overflow:hidden;
          border-bottom:1px solid #f0d0d8;
        }

        .news-figure img {
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
        }

        .news-body {
          padding:14px 16px 16px;
          display:flex;
          flex-direction:column;
          gap:8px;
          flex:1;
          justify-content:space-between;
          text-align:center; /* 🔹 centramos el texto y el botón */
        }

        .news-meta {
          font-size: 13px;
          color:#777;
        }

        .news-h3 {
          font-family:'Cobbler Sans', system-ui, sans-serif;
          font-weight:700;
          font-size:18px;
          margin:0;
        }

        .news-excerpt {
          font-family:'Cobbler Sans', system-ui, sans-serif;
          font-size:15px;
          line-height:1.45;
          color:#444;
          margin:0;
          flex:1;
        }

        .news-btn {
          margin-top:12px;
          margin-left:auto;
          margin-right:auto; /* 🔹 centra el botón horizontalmente */
          display:inline-block;
          align-self:center;
        }

        @media (max-width:820px){
          .news-grid { grid-template-columns:1fr; gap:22px; }
          .news-figure{ height:220px; }
        }
      `}</style>

      <div className="news-wrap">
        <Reveal as="h1" className="news-title">Noticias</Reveal>

        {/* FILTROS */}
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
            <select name="author__id" value={filters.author__id} onChange={handleChange}>
              <option value="">Todos</option>
              {authors.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Categoría</label>
            <select name="category__id" value={filters.category__id} onChange={handleChange}>
              <option value="">Todas</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Desde</label>
            <input
              type="date"
              name="published_at__gte"
              value={filters.published_at__gte}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Hasta</label>
            <input
              type="date"
              name="published_at__lte"
              value={filters.published_at__lte}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="clear-btn" onClick={clearFilters}>Limpiar filtros</button>

        {/* LISTADO DE NOTICIAS */}
        <div className="news-grid">
          {(data.results || []).map((p, i) => {
            const img = p.hero_image ? absUrl(p.hero_image) : '/images/placeholder.jpg'
            return (
              <Reveal key={p.slug || p.id || i} className="card news-card" delay={70*i}>
                <figure className="news-figure">
                  {img && <img src={img} alt={p.title} loading="lazy" decoding="async" />}
                </figure>

                <div className="news-body">
                  <h3 className="news-h3">{p.title}</h3>
                  <p className="news-meta">
                    {p.author?.name && <>Por {p.author.name}</>}
                    {p.category?.name && <> · {p.category.name}</>}
                    {p.published_at && <> · {new Date(p.published_at).toLocaleDateString()}</>}
                  </p>
                  {p.excerpt && <p className="news-excerpt">{p.excerpt}</p>}
                  <button
                    className="btn-donar news-btn"
                    onClick={() => nav(`/noticias/${p.slug || p.id}`)}
                    aria-label={`Leer más: ${p.title}`}
                  >
                    Leer más
                  </button>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </main>
  )
}
