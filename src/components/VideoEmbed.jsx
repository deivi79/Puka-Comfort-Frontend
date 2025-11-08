// src/components/VideoEmbed.jsx
export default function VideoEmbed({ url, title = 'Video', ratio = '56.25%' }) {
  // Acepta URLs tipo https://www.youtube.com/watch?v=... y las convierte a /embed/
  const src = (url || '').includes('watch?v=')
    ? url.replace('watch?v=', 'embed/')
    : url

  return (
    <div
      style={{
        position: 'relative',
        paddingBottom: ratio, // 16/9 = 56.25%
        height: 0,
        overflow: 'hidden',
        borderRadius: 12,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        margin: '32px 0'
      }}
    >
      <iframe
        src={src}
        title={title}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
      />
    </div>
  )
}
