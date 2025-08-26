import Reveal from '../components/Reveal'

export default function NuestroTrabajo(){
  return (
    <main>
      <style>{`
        /* ===== Contenedor base ===== */
        .nt-container{ max-width:1100px; margin:0 auto; padding:0 24px; }

        /* ===== ¿Qué hacemos? (2 columnas, alturas iguales) ===== */
        .nt-what{ padding: 48px 0 28px; }
        .nt-what-wrap{
          display:grid;
          grid-template-columns: 1fr 1fr;   /* tarjeta | imagen */
          gap:28px;
          align-items: stretch;             /* <- estira ambas columnas a la misma altura */
          min-height: 420px;                /* alto mínimo cómodo del bloque */
        }

        /* Tarjeta (mismo alto que la imagen) */
        .nt-what-card{
          background:#ececec;
          border-radius:14px;
          box-shadow:0 10px 28px rgba(0,0,0,.12);
          padding:28px 32px;

          /* alturas iguales + centrado del contenido */
          height:100%;
          display:flex;
          flex-direction:column;
          justify-content:center;
        }
        .nt-what-title{
          font-family:'Agelia', system-ui, sans-serif;
          font-size:42px; line-height:1.05;
          margin:0 0 16px;
        }
        .nt-what-desc{
          font-family:'Cobbler Sans', system-ui, sans-serif;
          font-size:18px; color:#444; margin:0;
          text-align:justify;                  /* texto justificado */
        }
        .nt-what-list{ margin:12px 0 0; padding-left:18px; }
        .nt-what-list li{ margin:6px 0; text-align:justify; }

        /* Imagen (mismo alto que la tarjeta) */
        .nt-what-image{
          border-radius:14px; overflow:hidden;
          box-shadow:0 14px 36px rgba(0,0,0,.10);
          height:100%;                         /* <- iguala altura a la del grid */
        }
        .nt-what-image img{
          display:block; width:100%; height:100%;
          object-fit:cover; object-position:center;
        }

        /* ===== Nuestro trabajo (banda con 3 círculos) ===== */
        .nt-work-band{
          --pattern-size: 240px;
          background-color:#ececec;
          background-image:
            radial-gradient(transparent 62%, rgba(0,0,0,0.03) 62%),
            linear-gradient(rgba(236,236,236,.85), rgba(236,236,236,.85)),
            url('/assets/ilustraciones/Ilustraciones-08.png');
          background-repeat:no-repeat, no-repeat, repeat;
          background-position:center top, 0 0, 0 0;
          background-size:100% 100%, 100% 100%, var(--pattern-size) auto;
          padding:36px 0 48px;
          border-top:1px solid #eee;
        }
        .nt-work-title{
          font-family:'Agelia', system-ui, sans-serif;
          font-size:40px; margin:0 0 20px;
        }
        .nt-work-list{
          list-style:none; margin:0; padding:0;
          display:grid; grid-template-columns:repeat(3, minmax(0,1fr));
          gap:28px; align-items:start;
        }
        .nt-work-item{ text-align:center; }
        .nt-figure{
          width:220px; height:220px; margin:0 auto 10px;
          border-radius:50%; overflow:hidden; background:#ddd;
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 10px 30px rgba(0,0,0,.08);
        }
        .nt-figure img{ width:100%; height:100%; object-fit:cover; display:block; }
        .nt-caption{ display:grid; gap:6px; }
        .nt-caption strong{
          font-family:'Cobbler Sans', system-ui, sans-serif;
          font-weight:700; font-size:18px; color:#000;
        }
        .nt-caption span{ font-size:14px; color:#5a5a5a; }

        /* ===== Responsive ===== */
        @media (max-width:1060px){
          .nt-what-title{ font-size:38px; }
        }
        @media (max-width:900px){
          .nt-what-wrap{
            grid-template-columns:1fr;         /* apila tarjeta e imagen */
            gap:16px; min-height:unset;
          }
          .nt-what-card{ height:auto; }        /* deja de forzar igual altura */
          .nt-what-image{ height:320px; }      /* alto razonable en móvil */
        }
        @media (max-width:880px){
          .nt-work-band{ --pattern-size:180px; }
          .nt-work-list{ grid-template-columns:1fr; gap:22px; }
          .nt-figure{ width:200px; height:200px; }
          .nt-work-title{ font-size:34px; }
        }
      `}</style>

      {/* ===== ¿Qué hacemos? ===== */}
      <section className="nt-what">
        <div className="nt-container">
          <div className="nt-what-wrap">

            {/* Tarjeta (mismo alto que la imagen) */}
            <Reveal className="nt-what-card" delay={20}>
              <h2 className="nt-what-title">¿Qué hacemos?</h2>
              <p className="nt-what-desc">
                Acompañamos a niñas en su etapa menstrual para que vivan este proceso natural con dignidad y confianza.
              </p>
              <ul className="nt-what-list nt-what-desc">
                <li>Educamos y sensibilizamos para derribar mitos y tabúes.</li>
                <li>Facilitamos acceso a productos de higiene y baños adecuados.</li>
                <li>Impulsamos el empoderamiento y liderazgo de adolescentes.</li>
              </ul>
            </Reveal>

            {/* Imagen */}
            <Reveal className="nt-what-image" delay={60}>
              {/* Coloca las imágenes en public/images/ y referencia como /images/... */}
              <img src="/images/chica-estudiante.jpg" alt="Niña en escuela" loading="lazy" decoding="async" />
            </Reveal>

          </div>
        </div>
      </section>

      {/* ===== Nuestro trabajo (3 círculos) ===== */}
      <section className="nt-work-band">
        <div className="nt-container">
          <Reveal as="h2" className="nt-work-title">Nuestro trabajo</Reveal>

          <ul className="nt-work-list">
            <Reveal as="li" className="nt-work-item" delay={60}>
              <figure className="nt-figure">
                <img src="/images/charla.jpg" alt="Charlas informativas" />
              </figure>
              <figcaption className="nt-caption">
                <strong>Charlas informativas</strong>
                <span>Educación menstrual.</span>
              </figcaption>
            </Reveal>

            <Reveal as="li" className="nt-work-item" delay={120}>
              <figure className="nt-figure">
                <img src="/images/entrega.jpg" alt="Entrega de calzones menstruales" />
              </figure>
              <figcaption className="nt-caption">
                <strong>Entrega de calzones menstruales</strong>
                <span>Acceso a productos.</span>
              </figcaption>
            </Reveal>

            <Reveal as="li" className="nt-work-item" delay={180}>
              <figure className="nt-figure">
                <img src="/images/monitoreo.jpg" alt="Monitoreo" />
              </figure>
              <figcaption className="nt-caption">
                <strong>Monitoreo</strong>
                <span>Seguimiento de impacto.</span>
              </figcaption>
            </Reveal>
          </ul>
        </div>
      </section>
    </main>
  )
}
