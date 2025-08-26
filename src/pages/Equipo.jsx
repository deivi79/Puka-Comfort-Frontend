// src/pages/Equipo.jsx
import Reveal from '../components/Reveal'
import { useEffect, useState } from 'react';
import { api } from '../api';
import { absUrl } from '../url';

export default function Equipo() {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api('/api/team/members/')
      .then(res => setMembers(Array.isArray(res) ? res : (res.results || [])))
      .catch(setError);
  }, []);

  if (error) {
    return <main style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>Ups: {error.message}</main>
  }

  const S = {
    page: { maxWidth: 1100, margin: '0 auto', padding: 24 },

    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 28,
      marginTop: 12,
      alignItems: 'stretch',            // estira todas las tarjetas a la misma altura
    },

    card: {
      height: '100%',
      borderRadius: 16,
      background: '#fff',
      border: '1px solid #f0d0d8',
      boxShadow: '0 1px 0 rgba(0,0,0,.03)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },

    media: {
      margin: 0,
      width: '100%',
      height: 320,
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
    },

    img: {
      maxWidth: '100%',
      maxHeight: '100%',
      width: 'auto',
      height: 'auto',
      objectFit: 'contain',
      objectPosition: 'center',
      display: 'block',
    },

    body: {
      padding: '12px 16px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      flex: 1,                          // ocupa el alto restante
    },

    // tipografía pedida: "Cobbler Sans" en negrita
    name: {
      fontFamily: "'Cobbler Sans', system-ui, sans-serif",
      fontWeight: 700,
      marginBottom: 2,
    },
    role: {
      fontFamily: "'Cobbler Sans', system-ui, sans-serif",
      fontWeight: 700,
      color: '#555',
      marginBottom: 4,
    },

    bio: { color: '#555', marginTop: 4 },

    // contenedor de iconos centrado y pegado al fondo
    socialWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginTop: 'auto',                // empuja estos iconos al fondo de la tarjeta
    },

    socialIcon: {
      width: 32,
      height: 32,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: '#fff',
      border: '1px solid #ccc',
    },

    socialImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
  };

  return (
    <main style={S.page}>
      <style>{`
      .shop-title{
          font-family:'Agelia', system-ui, sans-serif;
          font-size:34px; line-height:1.05; margin:22px 0 10px;
        }
      `}</style>
      <Reveal as="h1" className="shop-title">Nuestro equipo</Reveal>
      
      <div style={S.grid}>
        {members.map((m, i) => {
          const socialLinks = [
            m.linkedin_url && { url: m.linkedin_url, icon: '/public/icons/linkedin.png', alt: 'LinkedIn' },
            m.instagram_url && { url: m.instagram_url, icon: '/public/icons/instagram.png', alt: 'Instagram' },
            m.tiktok_url && { url: m.tiktok_url, icon: '/public/icons/tiktok.png', alt: 'TikTok' },
          ].filter(Boolean);

          return (
            <Reveal key={m.name + i} delay={i * 80} style={{ height: '100%' }}>
              <div style={S.card}>
                <figure style={S.media}>
                  {m.photo && (
                    <img
                      src={absUrl(m.photo)}
                      alt={m.name}
                      loading="lazy"
                      decoding="async"
                      style={S.img}
                    />
                  )}
                </figure>

                <div style={S.body}>
                  <div style={S.name}>{m.name}</div>
                  <div style={S.role}>{m.role}</div>
                  {m.bio && <p style={S.bio}>{m.bio}</p>}

                  {socialLinks.length > 0 && (
                    <div style={S.socialWrapper}>
                      {socialLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          style={S.socialIcon}
                          aria-label={link.alt}
                          title={link.alt}
                        >
                          <img src={link.icon} alt={link.alt} style={S.socialImg} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </main>
  );
}
