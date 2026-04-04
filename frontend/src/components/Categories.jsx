// frontend/src/components/Categories.jsx
const CAT_META = {
  Dresses    : { emoji:'👗', color:'#C8C5E8' },
  Tops       : { emoji:'👚', color:'#C4D4C8' },
  Bottoms    : { emoji:'👖', color:'#C8C4D4' },
  Outerwear  : { emoji:'🧥', color:'#D4CCBC' },
  Accessories: { emoji:'🧣', color:'#D0C8C0' },
};

export default function Categories({ categories = [], onFilter }) {
  const cats = categories.length
    ? categories
    : Object.keys(CAT_META).map(name => ({ name, count: 0 }));

  const handleClick = (name) => {
    onFilter?.(name);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="categories" className="section" style={{ background:'var(--cream)' }}>
      <div className="section-header">
        <div>
          <div className="section-label">Browse by</div>
          <h2 className="section-title">Shop by <em>Category</em></h2>
        </div>
        <a
          href="#"
          onClick={e => { e.preventDefault(); handleClick('all'); }}
          style={{ fontSize:12, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--warm-gray)', textDecoration:'none', cursor:'none', transition:'color .2s' }}
          onMouseEnter={e => e.target.style.color='var(--black)'}
          onMouseLeave={e => e.target.style.color='var(--warm-gray)'}
        >
          View all →
        </a>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gridTemplateRows:'320px 200px', gap:14 }}>
        {cats.map((cat, i) => {
          const meta = CAT_META[cat.name] || { emoji:'👗', color:'#D4CCBC' };
          return (
            <div
              key={cat.name}
              onClick={() => handleClick(cat.name)}
              data-cursor="pointer"
              style={{
                position:'relative', overflow:'hidden',
                borderRadius:'var(--card-radius)', cursor:'none',
                background: meta.color,
                gridRow: i === 0 ? '1 / 3' : 'auto',
              }}
            >
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:70, transition:'transform .6s' }}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.07)'}
                onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
              >
                {meta.emoji}
              </div>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(26,22,96,.65) 0%,transparent 55%)' }} />
              <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'22px 18px' }}>
                <div style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:300, color:'#fff', marginBottom:4 }}>{cat.name}</div>
                {cat.count > 0 && <div style={{ fontSize:11, color:'rgba(255,255,255,.55)', letterSpacing:'.07em' }}>{cat.count} piece{cat.count !== 1 ? 's' : ''}</div>}
                <div style={{ fontSize:10, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--accent)', marginTop:8, opacity:.9 }}>Shop now →</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
