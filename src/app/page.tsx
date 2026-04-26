export default function TestPage() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ color: '#0070f3' }}>Çözsen Deneme Yayında! 🚀</h1>
      <p>Eğer bu sayfayı görüyorsanız, Vercel projenizi başarıyla okuyor demektir.</p>
      <p style={{ color: '#666' }}>Şimdi ana sayfayı geri yükleyebiliriz.</p>
    </div>
  )
}
