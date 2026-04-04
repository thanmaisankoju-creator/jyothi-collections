// frontend/src/components/ProductGrid.jsx
import { useState } from 'react';
import { useCartStore } from '../utils/store';

const FILTERS = ['All','Dresses','Tops','Bottoms','Outerwear','Accessories'];
const BADGE_COLORS = { new:'var(--black)', sale:'#C0392B', hot:'var(--accent)' };

function avgRating(reviews = []) {
  if (!reviews.length) return null;
  return (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
}
function stars(r) {
  const n = Math.round(r);
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

export default function ProductGrid({ products, filter, onFilter, loading, onProductClick, onAddToCart }) {
  const { addItem } = useCartStore();
  const [hoveredId, setHoveredId] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    addItem(product, product.sizes?.[0] || 'M');
    onAddToCart?.(`${product.name} added to cart`);
  };

  const toggleWish = (e, id) => {
    e.stopPropagation();
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section id="products" className="section" style={{ background:'var(--white)' }}>
      <div className="section-header">
        <div>
          <div className="section-label">Our Collection</div>
          <h2 className="section-title">
            {filter === 'all' ? <>All <em>Products</em></> : <em>{filter}</em>}
          </h2>
        </div>
        <a href="#" onClick={e => { e.preventDefault(); onFilter('all'); }}
          style={{ fontSize:12, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--warm-gray)', textDecoration:'none', cursor:'none' }}
          onMouseEnter={e => e.target.style.color='var(--black)'}
          onMouseLeave={e => e.target.style.color='var(--warm-gray)'}
        >View all →</a>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:3, background:'var(--cream)', border:'var(--card-border)', borderRadius:4, padding:3, width:'fit-content', marginBottom:44 }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => onFilter(f === 'All' ? 'all' : f)}
            style={{
              padding:'8px 18px', background: (filter === 'all' ? 'All' : filter) === f ? 'var(--black)' : 'none',
              color: (filter === 'all' ? 'All' : filter) === f ? 'var(--white)' : 'var(--warm-gray)',
              border:'none', borderRadius:2, fontFamily:'var(--font-body)',
              fontSize:11, letterSpacing:'.08em', textTransform:'uppercase',
              cursor:'none', transition:'all .25s',
            }}
          >{f}</button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign:'center', padding:'60px 0', color:'var(--warm-gray)', fontSize:14 }}>Loading products…</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'32px 22px' }}>
          {products.map((p, i) => {
            const avg = avgRating(p.reviews);
            const isHovered = hoveredId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => onProductClick?.(p)}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                data-cursor="pointer"
                style={{
                  cursor:'none',
                  opacity:1,
                  animation:`fadeUp .5s ${i * 0.06}s both`,
                }}
              >
                {/* Frame */}
                <div className="product-frame">
                  {/* Product image / emoji */}
                  <div style={{
                    width:'100%', height:'100%',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:68, background:'var(--card-bg)',
                    transition:'transform .5s',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  }}>
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : p.emoji || '👗'
                    }
                  </div>

                  {/* Badge */}
                  {p.badge && (
                    <div style={{
                      position:'absolute', top:11, left:11,
                      padding:'3px 9px', borderRadius:2,
                      fontSize:9, fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase',
                      background: BADGE_COLORS[p.badge] || 'var(--black)', color:'#fff',
                    }}>{p.badge}</div>
                  )}

                  {/* Hover actions */}
                  <div style={{
                    position:'absolute', bottom:0, left:0, right:0,
                    padding:9, display:'flex', gap:7,
                    transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
                    transition:'transform .35s cubic-bezier(.4,0,.2,1)',
                  }}>
                    <button
                      onClick={e => handleQuickAdd(e, p)}
                      style={{ flex:1, padding:10, background:'var(--black)', color:'var(--white)', border:'none', borderRadius:2, fontFamily:'var(--font-body)', fontSize:10, fontWeight:500, letterSpacing:'.12em', textTransform:'uppercase', cursor:'none' }}
                    >Add to Cart</button>
                    <button
                      onClick={e => toggleWish(e, p.id)}
                      style={{ width:38, height:38, background:'var(--white)', border:'none', borderRadius:2, cursor:'none', fontSize:15, display:'flex', alignItems:'center', justifyContent:'center', color: wishlist.has(p.id) ? '#C0392B' : 'var(--black)' }}
                    >
                      {wishlist.has(p.id) ? '♥' : '♡'}
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding:'12px 4px 0' }}>
                  <div style={{ fontSize:10, color:'var(--warm-gray)', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:4 }}>{p.category}</div>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:400, color:'var(--black)', marginBottom:5, lineHeight:1.2 }}>{p.name}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:3 }}>
                    <span style={{ fontSize:15, fontWeight:500, color:'var(--black)' }}>₹{p.price?.toLocaleString('en-IN')}</span>
                    {p.originalPrice && <span style={{ fontSize:12, color:'var(--warm-gray)', textDecoration:'line-through' }}>₹{p.originalPrice.toLocaleString('en-IN')}</span>}
                  </div>
                  {avg && (
                    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                      <span style={{ fontSize:11, color:'var(--accent)', letterSpacing:1 }}>{stars(avg)}</span>
                      <span style={{ fontSize:10, color:'var(--warm-gray)' }}>({p.reviews?.length})</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
