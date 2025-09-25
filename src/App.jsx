import { NavLink, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import QuienesSomos from './pages/QuienesSomos';
import NuestroTrabajo from './pages/NuestroTrabajo';
import Equipo from './pages/Equipo';
import Tienda from './pages/Tienda';
import Convocatoria from './pages/Convocatoria';
import NoticiasList from './pages/NoticiasList';
import NoticiaDetalle from './pages/NoticiaDetalle';
import ScrollToTop from './components/ScrollToTop';

export default function App(){
  const nav = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(()=>{ setOpen(false) }, [location.pathname]); // cierra al navegar

  return (
    <div>
      <ScrollToTop />
      <style>{`
        /* ===== Tipografías ===== */
        @font-face{
          font-family:'Agelia';
          src:
            url('/fonts/Agelia.otf') format('opentype'),
            url('/fonts/Agelia-DEMO-BF68006a24edc80.otf') format('opentype');
          font-weight:400; font-style:normal; font-display:swap;
        }
        @font-face{
          font-family:'Cobbler Sans';
          src:
            url('/fonts/CobblerSansTest-Regular.otf') format('opentype'),
            url('/fonts/CobblerSansTest-Regular-BF67590d214469d.otf') format('opentype');
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
        body{ margin:0; color:var(--text); font:16px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,Arial; }

        /* ===== HEADER ===== */
        header.nav{
          position:sticky; top:0; z-index:2000;
          background:var(--pink);
          border-bottom:1px solid rgba(0,0,0,.05);
          box-shadow:0 2px 10px rgba(0,0,0,.04);
        }
        .container{ max-width:var(--container); margin:0 auto; padding:0 24px; }

        .nav-bar{
          display:grid; grid-template-columns:auto 1fr auto;
          align-items:center; min-height:96px; gap:28px;
        }
        .nav-left{ cursor:pointer; display:flex; align-items:center; }
        .nav-logo{ height:100px; width:auto; object-fit:contain; display:block; }

        /* ===== MENÚ DESKTOP (>= 900px) ===== */
        .menu-desktop{ display:flex; justify-content:flex-start; gap:48px; }
        .menu-desktop a{
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px;
          text-decoration:none; color:var(--text);
          font-family:'Agelia',system-ui,sans-serif; font-size:24px; line-height:1.1;
          padding:10px 12px 18px; min-height:64px; max-width:180px; text-align:center;
          position:relative; border-radius:12px; transition:color .18s ease;
        }
        .menu-desktop a:hover, .menu-desktop a:focus-visible{ color:#000; }
        .menu-desktop a[aria-current="page"]{ color:#000; }
        .menu-desktop a[aria-current="page"]::after{
          content:""; position:absolute; left:50%; transform:translateX(-50%);
          bottom:8px; width:52px; height:4px; background:var(--pink-strong); border-radius:999px;
        }

        /* Botón hamburguesa (solo móvil) */
        .nav-toggle{
          display:none; background:none; border:none; padding:8px 10px; font-size:28px; line-height:1;
          cursor:pointer; color:#222;
        }

        /* ===== ESTADO BASE drawer/overlay (desktop): OCULTOS ===== */
        .drawer{ display:none; }
        .overlay{ display:none; }

        /* ===== MENÚ MÓVIL (< 900px) ===== */
        @media (max-width:900px){
          .nav-bar{ grid-template-columns:auto auto auto; min-height:72px; gap:12px; }
          .nav-logo{ height:72px; }
          .menu-desktop{ display:none; }
          .nav-toggle{ display:block; }

          .drawer{
            display:block;
            position:fixed; left:0; right:0; top:72px;
            background:var(--pink);
            border-bottom:1px solid rgba(0,0,0,.06);
            transform:translateY(-12px);
            opacity:0; pointer-events:none;
            transition:opacity .2s ease, transform .2s ease;
            z-index:2100;
          }
          .drawer.open{ transform:translateY(0); opacity:1; pointer-events:auto; }

          .menu-mobile{ display:flex; flex-direction:column; gap:10px; padding:12px 16px 16px; }
          .menu-mobile a{
            display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px;
            text-decoration:none; color:var(--text);
            font-family:'Agelia',system-ui,sans-serif; font-size:22px; line-height:1.1;
            min-height:52px; padding:10px 12px 16px; text-align:center; border-radius:12px; position:relative;
          }
          .menu-mobile a[aria-current="page"]{ color:#000; }
          .menu-mobile a[aria-current="page"]::after{
            content:""; position:absolute; left:50%; transform:translateX(-50%);
            bottom:6px; width:44px; height:4px; background:var(--pink-strong); border-radius:999px;
          }

          .overlay{
            display:block;
            position:fixed; inset:0; background:rgba(0,0,0,.25);
            opacity:0; pointer-events:none; transition:opacity .2s ease;
            z-index:1900;
          }
          .overlay.open{ opacity:1; pointer-events:auto; }
        }

        main{ min-height:60vh; }

        /* ===== Banda info ===== */
        .info-band{
          --bg:#F9C7CF; --pattern-size:140px;
          background-color:var(--bg);
          background-image:
            linear-gradient(rgba(249,199,207,0.65), rgba(249,199,207,0.65)),
            url('/ilustraciones/Ilustraciones-08.png');
          background-repeat:repeat; background-position:0 0; background-size:var(--pattern-size) auto;
          padding:36px 0 48px; border-top:1px solid #eee;
        }

        /* Aquí el cambio: solo DOS columnas => texto (1fr) + social (auto) */
        .info-inner{
          display:grid;
          grid-template-columns: 1fr auto;
          gap:40px;
          align-items:flex-start;
        }

        .info-text{ font-family:'Cobbler Sans',system-ui,sans-serif; font-size:15px; line-height:1.55; }
        .info-text p{ margin:8px 0; color:#2b2b2b }
        .info-text p strong{ display:block; font-family:'Agelia',system-ui,sans-serif; font-size:22px; line-height:1.15; margin-bottom:8px; }
        .info-logo{ max-width:320px; width:100%; height:auto }

        /* A la derecha y en columna */
        .social-col{
          justify-self:center;   /* centrar dentro de la grid */
          text-align:center;     /* texto centrado */
          display:flex;
          flex-direction:column;
          align-items:center;    /* centra los íconos */
          gap:12px;
        }

        .social-title{ font-family:'Cobbler Sans',system-ui,sans-serif; font-size:16px; margin:0 0 6px; }
        .social-col img{ width:52px; height:52px; display:block; }

        @media (max-width:880px){
          .info-inner{ grid-template-columns:1fr; gap:24px; }
          .social-col{ justify-self:center; align-items:center; text-align:center; }
        }
      `}</style>

      <header className="nav" role="banner">
        <div className="container nav-bar">
          <div className="nav-left" onClick={()=>nav('/')}>
            <img className="nav-logo" src="/images/Logo/Logos_Mesa de trabajo 1 copia 2.png" alt="Puka Comfort" />
          </div>

          <nav className="menu-desktop" aria-label="Navegación principal">
            <NavLink to="/nuestro-trabajo">Nuestro trabajo</NavLink>
            <NavLink to="/equipo">Nuestro equipo</NavLink>
            <NavLink to="/tienda">Tienda Puka</NavLink>
            <NavLink to="/convocatoria">Convocatoria</NavLink>
            <NavLink to="/noticias">Noticias</NavLink>
          </nav>

          <button
            className="nav-toggle"
            aria-label="Abrir/cerrar menú"
            aria-expanded={open}
            onClick={()=>setOpen(o=>!o)}
          >
            ☰
          </button>
        </div>

        {/* Drawer móvil */}
        <div className={`drawer ${open ? 'open' : ''}`}>
          <div className="container">
            <nav className="menu-mobile" aria-label="Navegación móvil">
              <NavLink to="/nuestro-trabajo">Nuestro trabajo</NavLink>
              <NavLink to="/equipo">Nuestro equipo</NavLink>
              <NavLink to="/tienda">Tienda Puka</NavLink>
              <NavLink to="/convocatoria">Convocatoria</NavLink>
              <NavLink to="/noticias">Noticias</NavLink>
            </nav>
          </div>
        </div>

        {/* Overlay para cerrar tocando fuera */}
        <div
          className={`overlay ${open ? 'open' : ''}`}
          onClick={()=>setOpen(false)}
          aria-hidden="true"
        />
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
        <div style={{ width:'100%', textAlign:'center', marginBottom:32 }}>
          <img
            src="/images/Logo/Logos_Mesa de trabajo 1.png"
            alt="Logo principal"
            style={{ maxWidth:'600px', width:'100%', height:'auto', display:'inline-block' }}
          />
        </div>

        <div className="container info-inner">
          <div className="info-text">
            <p><strong>Comunícate con nosotros</strong></p>
            <p>Correo general: <a href="mailto:pukacomfort@gmail.com">pukacomfort@outlook.com</a></p>
            <p>De lunes a viernes de 9 am a 7:30 pm y los sábados de 9 am a 2:30 pm.</p><br/>
            <p>Si eres empresa y deseas hacer una alianza escríbenos a <a href="mailto:pukacomfort@gmail.com">pukacomfort@outlook.com</a></p>
            <p>Si tienes alguna observación escríbenos a <a href="mailto:pukacomfort@gmail.com">pukacomfort@outlook.com</a></p>
          </div>

          <aside className="social-col">
            <p className="social-title">Nuestras redes sociales</p>
            <a href="https://www.tiktok.com/@TU_USUARIO" target="_blank" rel="noopener noreferrer">
              <img src="/icons/tiktok.png" alt="TikTok" />
            </a>
            <a href="https://www.instagram.com/pukacomfort/" target="_blank" rel="noopener noreferrer">
              <img src="/icons/instagram.png" alt="Instagram" />
            </a>
            <a href="https://www.linkedin.com/company/puka-comfort" target="_blank" rel="noopener noreferrer">
              <img src="/icons/linkedin.png" alt="LinkedIn" />
            </a>
          </aside>
        </div>
      </section>
    </div>
  );
}
