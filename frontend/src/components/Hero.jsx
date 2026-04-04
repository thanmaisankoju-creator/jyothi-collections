// frontend/src/components/Hero.jsx
export default function Hero() {
  const scrollToProducts = () =>
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section style={{
      height: '100vh', minHeight: 600, position: 'relative',
      overflow: 'hidden', display: 'flex', alignItems: 'flex-end',
      padding: '0 48px 80px', background: 'var(--hero-bg)',
      transition: 'background .6s',
    }}>
      {/* Blobs */}
      <div style={{ position:'absolute', width:700, height:700, top:-200, right:-100, borderRadius:'50%', background:'radial-gradient(circle,rgba(43,45,181,.12) 0%,transparent 70%)', animation:'float 8s ease-in-out infinite', opacity:.18, pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:400, height:400, bottom:-100, left:'20%', borderRadius:'50%', background:'radial-gradient(circle,var(--accent-dark) 0%,transparent 70%)', animation:'float 10s ease-in-out infinite reverse', opacity:.14, pointerEvents:'none' }} />

      {/* Side tag */}
      <div style={{ position:'absolute', top:120, right:48, writingMode:'vertical-rl', fontSize:11, letterSpacing:'.2em', textTransform:'uppercase', color:'var(--warm-gray)' }}>
        Collection 2025
      </div>

      {/* Big number */}
      <div style={{ position:'absolute', bottom:80, right:48, fontFamily:'var(--font-display)', fontSize:120, fontWeight:300, color:'rgba(128,128,128,.06)', lineHeight:1, userSelect:'none' }}>
        25
      </div>

      {/* Content */}
      <div style={{ position:'relative', zIndex:2, maxWidth:640 }}>
        <div style={{ fontSize:11, letterSpacing:'.28em', textTransform:'lowercase', color:'var(--accent)', marginBottom:6, animation:'fadeUp .8s .1s both' }}>
          explore the fashion world
        </div>
        <div style={{ fontSize:11, letterSpacing:'.22em', textTransform:'uppercase', color:'var(--warm-gray)', marginBottom:18, animation:'fadeUp .8s .2s both' }}>
          New Arrivals — Spring / Summer 2025
        </div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(52px,7vw,96px)', fontWeight:300, lineHeight:.95, color:'var(--black)', marginBottom:22, animation:'fadeUp .8s .4s both' }}>
          Where Style<br /><em style={{ fontStyle:'italic', color:'var(--accent)' }}>Meets Soul</em>
        </h1>
        <p style={{ fontSize:15, color:'var(--warm-gray)', maxWidth:360, lineHeight:1.7, marginBottom:36, animation:'fadeUp .8s .6s both' }}>
          Premium fashion curated for every woman. From ethnic elegance to modern chic — explore the fashion world.
        </p>
        <div style={{ display:'flex', gap:16, flexWrap:'wrap', animation:'fadeUp .8s .8s both' }}>
          <button className="btn-primary" onClick={scrollToProducts}>
            <span>Shop Collection</span><span>→</span>
          </button>
          <a href="#categories" className="btn-outline">Browse Categories</a>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8, color:'var(--warm-gray)', fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', animation:'fadeIn 1s 1.2s both' }}>
        <div style={{ width:1, height:40, background:'var(--warm-gray)', animation:'scrollLine 2s ease-in-out infinite' }} />
        <span>Scroll</span>
      </div>

      <style>{`
        @keyframes scrollLine {
          0%  { transform:scaleY(0); transform-origin:top }
          50% { transform:scaleY(1); transform-origin:top }
          51% { transform:scaleY(1); transform-origin:bottom }
          100%{ transform:scaleY(0); transform-origin:bottom }
        }
      `}</style>
    </section>
  );
}
