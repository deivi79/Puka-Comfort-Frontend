import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import QuienesSomos from './pages/QuienesSomos'
import NuestroTrabajo from './pages/NuestroTrabajo'
import Equipo from './pages/Equipo'
import Tienda from './pages/Tienda'
import Convocatoria from './pages/Convocatoria'
import NoticiasList from './pages/NoticiasList'
import NoticiaDetalle from './pages/NoticiaDetalle'

export default function App(){
  const nav = useNavigate()

  return (
    <div>
      <style>{`
        /* ===== Tipografías ===== */
        @font-face{
          font-family:'Agelia';
          src:url('/fonts/Agelia-DEMO-BF68006a24edc80.otf') format('opentype');
          font-weight:400; font-style:normal; font-display:swap;
        }
        @font-face{
          font-family:'Cobbler Sans';
          src:url('/fonts/CobblerSansTest-Regular-BF67590d214469d.otf') format('opentype');
          font-weight:400; font-style:normal; font-display:swap;
        }

        :root{
          --pink:#F9C7CF;
          --pink-strong:#F39EAB;
          --text:#161616;
          --container:1100px;
        }

        html,body,#root{height:100%}
        *{box-sizing:border-box}
        body{
          margin:0; color:var(--text);
          font:16px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,Arial;
          background:#fff;
        }

        /* ===== HEADER ===== */
        header.nav{ background:var(--pink); }
        .container{ max-width:var(--container); margin:0 auto; padding:0 24px; }

        /* 2 columnas: logo (auto) + menú (1fr) */
        .nav-inner{
          display:grid;
          grid-template-columns: auto 1fr;
          align-items:center;
          min-height:96px;
          gap:40px;
        }

        .nav-left{ cursor:pointer; }
        .nav-logo{
          height:100px;  /* fijo */
          width:auto; display:block; object-fit:contain; max-width:100%;
        }

        /* ===== MENÚ: grid 5 columnas iguales + wrap controlado ===== */
        .nav-menu{
          display:grid;
          grid-template-columns: repeat(5, minmax(140px, 1fr)); /* cada celda al menos 140px */
          align-items:center;
          justify-items:center;       /* centra cada ítem */
          column-gap:48px;            /* separación prudente entre ítems */
          width:100%;
          font-family:'Agelia',system-ui,sans-serif;
          font-size:24px; line-height:1.05;
        }
        .nav-menu a{
          display:inline-block;
          text-align:center;
          text-decoration:none;
          color:var(--text);

          /* ✅ permitir 2 líneas bien balanceadas (evita cortes feos) */
          white-space:normal;
          text-wrap:balance;          /* navegadores modernos */
          word-break:keep-all;        /* no partas palabras */

          /* limitar un poco el ancho para forzar el salto natural en frases largas */
          max-width:180px;

          padding:14px 6px 18px;
          position:relative;
          transition:color .18s ease;
        }
        .nav-menu a:hover,
        .nav-menu a:focus-visible{ color:#000; }
        .nav-menu a[aria-current="page"]{ color:#000; }
        .nav-menu a[aria-current="page"]::after{
          content:"";
          position:absolute; left:50%; transform:translateX(-50%);
          bottom:6px; width:56px; height:3px;
          background:var(--pink-strong); border-radius:2px;
        }

        main{ min-height:60vh; }

        /* ===== Banda info con patrón (más pequeña) ===== */
        .info-band{
          --bg: #F9C7CF;
          --pattern-size: 140px;
          background-color: var(--bg);
          background-image:
            linear-gradient(rgba(249,199,207,0.65), rgba(249,199,207,0.65)),
            url('/ilustraciones/Ilustraciones-08.png');
          background-repeat: repeat;
          background-position: 0 0;
          background-size: var(--pattern-size) auto;
          padding: 36px 0 48px;
          border-top:1px solid #eee;
        }
        .info-inner{
          display:grid; grid-template-columns:1.2fr 0.8fr 0.5fr; gap:40px; align-items:center;
        }
        .info-text{
          font-family:'Cobbler Sans', system-ui, sans-serif;
          font-size:15px; line-height:1.55;
        }
        .info-text p{ margin:8px 0; color:#2b2b2b; }
        .info-text p strong{
          display:block;
          font-family:'Agelia', system-ui, sans-serif;
          font-size:22px;
          line-height:1.15;
          margin-bottom:8px;
        }
        .info-logo{ max-width:320px; width:100%; height:auto; }

        .social-col{
          justify-self:end;
          text-align:center;
          display:flex; flex-direction:column;
          align-items:center; gap:12px;
        }
        .social-title{ font-family:'Cobbler Sans', system-ui, sans-serif; font-size:16px; margin:0 0 6px; }
        .social-col img{ width:52px; height:52px; display:block; }

        /* ===== Responsive ===== */
        @media (max-width:1200px){
          .nav-menu{ column-gap:36px; font-size:22px; }
        }
        @media (max-width:1000px){
          .nav-menu{
            grid-template-columns: repeat(5, minmax(120px, 1fr)); /* un pelo más angosto */
            column-gap:28px;
            font-size:21px;
          }
        }
        @media (max-width:880px){
          .nav-inner{ grid-template-columns:1fr; padding:12px 0 18px; gap:16px; }
          .nav-menu{
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); /* 2–3 columnas */
            column-gap:24px; row-gap:10px;
            font-size:20px;
          }
          .nav-menu a{ max-width:none; } /* que se adapte libremente en móvil */
          .nav-menu a[aria-current="page"]::after{ bottom:2px; }

          .info-inner{ grid-template-columns:1fr; gap:24px; }
          .social-col{ justify-self:center; }
        }
      `}</style>

      <header className="nav" role="banner">
        <div className="container nav-inner">
          <div className="nav-left" onClick={()=>nav('/')}>
            <img className="nav-logo" src="/images/Logo/Logos_Mesa de trabajo 1 copia 2.png" alt="Puka Comfort" />
          </div>

          <nav className="nav-menu" aria-label="Navegación principal">
            <NavLink to="/nuestro-trabajo">Nuestro trabajo</NavLink>
            <NavLink to="/equipo">Nuestro equipo</NavLink>
            <NavLink to="/tienda">Tienda Puka</NavLink>
            <NavLink to="/convocatoria">Convocatoria</NavLink>
            <NavLink to="/noticias">Noticias</NavLink>
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/quienes-somos" element={<QuienesSomos/>}/>
          <Route path="/nuestro-trabajo" element={<NuestroTrabajo/>}/>
          <Route path="/equipo" element={<Equipo/>}/>
          <Route path="/tienda" element={<Tienda/>}/>
          <Route path="/convocatoria" element={<Convocatoria/>}/>
          <Route path="/noticias" element={<NoticiasList/>}/>
          <Route path="/noticias/:slug" element={<NoticiaDetalle/>}/>
        </Routes>
      </main>

      <section className="info-band" id="donar">
        <div style={{ width: '100%', textAlign: 'center', marginBottom: 32 }}>
          <img
            src="/images/Logo/Logos_Mesa de trabajo 1.png"
            alt="Logo principal"
            style={{ maxWidth: '600px', width: '100%', height: 'auto', display: 'inline-block' }}
          />
        </div>

        <div className="container info-inner">
          <div className="info-text">
            <p><strong>Comunícate con nosotros</strong></p>
            <p>Correo general: <a href="mailto:pukacomfort@gmail.com">pukacomfort@gmail.com</a></p>
            <p>De lunes a viernes de 9 am a 7:30 pm y los sábados de 9 am a 2:30 pm.</p><br/>
            <p>Si eres empresa y deseas hacer una alianza escríbenos a <a href="mailto:pukacomfort@gmail.com">pukacomfort@gmail.com</a></p>
            <p>Si tienes alguna observación escríbenos a <a href="mailto:pukacomfort@gmail.com">pukacomfort@gmail.com</a></p>
          </div>

          <div style={{ textAlign:'center' }}>
            <img className="info-logo" src="/assets/branding/logo-extended.png" alt="Puka Comfort" />
          </div>

          <aside className="social-col">
            <p className="social-title">Nuestras redes sociales</p>
            <a href="https://www.tiktok.com/@TU_USUARIO" target="_blank" rel="noopener noreferrer">
              <img src="/icons/tiktok.png" alt="TikTok" />
            </a>
            <a href="https://www.instagram.com/TU_USUARIO" target="_blank" rel="noopener noreferrer">
              <img src="/icons/instagram.png" alt="Instagram" />
            </a>
            <a href="https://www.linkedin.com/company/TU_EMPRESA" target="_blank" rel="noopener noreferrer">
              <img src="/icons/linkedin.png" alt="LinkedIn" />
            </a>
          </aside>
        </div>
      </section>
    </div>
  )
}
