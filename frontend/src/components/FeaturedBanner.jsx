// frontend/src/components/FeaturedBanner.jsx
export default function FeaturedBanner() {
  return (
    <section style={{ background:'var(--black)', color:'var(--white)', padding:0, overflow:'hidden', display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:500 }}>
      <div style={{ background:'linear-gradient(135deg,#0D0A4A,#1A1660)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:130, position:'relative', overflow:'hidden' }}>
        🧣
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 60% 40%,rgba(43,45,181,.15),transparent 60%)' }} />
      </div>
      <div style={{ padding:'72px 56px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
        <div style={{ fontSize:10, letterSpacing:'.25em', textTransform:'uppercase', color:'rgba(155,127,212,.9)', marginBottom:16 }}>Limited Edition</div>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:44, fontWeight:300, lineHeight:1.05, marginBottom:16, color:'var(--white)' }}>
          The Winter <em style={{ fontStyle:'italic', color:'rgba(155,127,212,.9)' }}>Luxe</em><br />Collection
        </h2>
        <p style={{ fontSize:14, color:'rgba(255,255,255,.5)', lineHeight:1.8, maxWidth:340, marginBottom:32 }}>
          Hand-selected fabrics, impeccable tailoring, and designs that transcend seasons.
        </p>
        <div style={{ display:'flex', gap:32, marginBottom:32 }}>
          {[['48','Pieces'],['12','Designers'],['100%','Sustainable']].map(([n,l]) => (
            <div key={l}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:30, fontWeight:300, color:'var(--white)' }}>{n}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,.4)', letterSpacing:'.1em', textTransform:'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => document.getElementById('products')?.scrollIntoView({ behavior:'smooth' })}
          style={{ padding:'12px 26px', background:'rgba(155,127,212,.85)', color:'#fff', border:'none', borderRadius:2, fontFamily:'var(--font-body)', fontSize:11, fontWeight:500, letterSpacing:'.14em', textTransform:'uppercase', cursor:'none', width:'fit-content' }}>
          Explore Now
        </button>
      </div>
    </section>
  );
}
