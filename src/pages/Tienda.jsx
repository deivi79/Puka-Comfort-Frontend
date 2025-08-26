import { useEffect, useState } from 'react'
import { api } from '../api'
import { absUrl } from '../url'
import Reveal from '../components/Reveal'

export default function Tienda(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    api('/api/shop/products/')
      .then(res => {
        if (!mounted) return
        setItems(Array.isArray(res) ? res : (res?.results || []))
      })
      .catch(e => mounted && setError(e))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  return (
    <main>
      <style>{`
        .shop-container{ max-width:1100px; margin:0 auto; padding:0 24px 40px; }

        .shop-title{
          font-family:'Agelia', system-ui, sans-serif;
          font-size:34px; line-height:1.05; margin:22px 0 10px;
        }

        .shop-grid{
          display:grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap:42px; align-items:start; justify-items:center;
          margin-top: 12px;
        }

        .shop-item{ text-align:center; }

        .shop-figure{
          width: 280px;         /* ajusta según tus fotos */
          height: 220px;
          margin: 0 auto 16px;
          display:flex; align-items:center; justify-content:center;
          overflow:hidden;
        }
        .shop-figure img{
          max-width:100%; max-height:100%;
          width:auto; height:auto; object-fit:contain; display:block;
        }

        .shop-name{
          font-family:'Cobbler Sans', system-ui, sans-serif;
          font-weight:700; font-size:18px; margin:0 0 4px;
        }
        .shop-price{
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          font-weight:700; font-size:16px; margin:0;
        }

        /* estados */
        .shop-note{ margin: 12px 0; color:#444; }

        /* responsive */
        @media (max-width: 980px){
          .shop-grid{ grid-template-columns: repeat(2, minmax(0,1fr)); gap:32px; }
          .shop-figure{ width: 260px; height: 200px; }
        }
        @media (max-width: 640px){
          .shop-grid{ grid-template-columns: 1fr; gap:26px; }
          .shop-figure{ width: 240px; height: 180px; }
        }
      `}</style>

      <div className="shop-container">
        <Reveal as="h1" className="shop-title">Tienda Puka</Reveal>

        {loading && <p className="shop-note">Cargando productos…</p>}
        {error && <p className="shop-note">Ups, no pudimos cargar la tienda: {error.message}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="shop-note">No hay productos disponibles por ahora.</p>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="shop-grid">
            {items.map((p, i) => {
              const priceNum = typeof p.price === 'number' ? p.price : parseFloat(p.price)
              const priceText = Number.isFinite(priceNum) ? `${priceNum % 1 ? priceNum.toFixed(2) : priceNum} S/.` : '—'
              const img = p.image ? (absUrl ? absUrl(p.image) : p.image) : ''

              return (
                <Reveal key={p.slug || p.id || i} as="article" className="shop-item" delay={60*i}>
                  <figure className="shop-figure">
                    {img && <img src={img} alt={p.name} loading="lazy" decoding="async" />}
                  </figure>
                  <h3 className="shop-name">{p.name}</h3>
                  <p className="shop-price">{priceText}</p>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
