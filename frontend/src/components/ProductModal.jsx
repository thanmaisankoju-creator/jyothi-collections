// frontend/src/components/ProductModal.jsx
import { useState } from 'react';
import { useCartStore } from '../utils/store';
import { postReview } from '../utils/api';

const EMOJI_OPTS = [
  { v:5, e:'😍' }, { v:4, e:'😊' }, { v:3, e:'😐' }, { v:2, e:'😕' }, { v:1, e:'😞' }
];

function stars(r) { const n=Math.round(+r); return '★'.repeat(n)+'☆'.repeat(5-n); }
function avgRating(reviews=[]) {
  if (!reviews.length) return null;
  return (reviews.reduce((a,r)=>a+r.rating,0)/reviews.length).toFixed(1);
}

export default function ProductModal({ product: initial, onClose, onAddToCart, onReviewPosted }) {
  const [product, setProduct] = useState(initial);
  const [selSize, setSelSize] = useState('');
  const [selEmoji, setSelEmoji] = useState(0);
  const [revName,  setRevName]  = useState('');
  const [revText,  setRevText]  = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addItem } = useCartStore();

  if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';

  const handleClose = () => {
    document.body.style.overflow = '';
    onClose();
  };

  const handleAddToCart = () => {
    if (!selSize) { alert('Please select a size'); return; }
    addItem(product, selSize);
    onAddToCart?.(`${product.name} added to cart`);
    handleClose();
  };

  const handleReview = async () => {
    if (!revName.trim()) { alert('Please enter your name'); return; }
    if (!selEmoji)       { alert('Please select a rating'); return; }
    if (!revText.trim()) { alert('Please write your review'); return; }
    setSubmitting(true);
    const emojiChar = EMOJI_OPTS.find(e => e.v === selEmoji)?.e || '😊';
    try {
      await postReview({ productId: product.id, name: revName, emoji: emojiChar, rating: selEmoji, text: revText });
      // Optimistic update
      setProduct(prev => ({
        ...prev,
        reviews: [...(prev.reviews||[]), { name:revName, emoji:emojiChar, rating:selEmoji, text:revText, createdAt:new Date().toISOString() }]
      }));
      setRevName(''); setRevText(''); setSelEmoji(0);
      onReviewPosted?.();
      alert('Review posted! Thank you ✓');
    } catch {
      alert('Failed to post review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const avg = avgRating(product.reviews);

  return (
    <div style={{ position:'fixed', inset:0, zIndex:4000, display:'flex', alignItems:'center', justifyContent:'center', padding:24, animation:'fadeIn .35s both' }}>
      <div onClick={handleClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.65)', backdropFilter:'blur(8px)', cursor:'none' }} />
      <div style={{
        position:'relative', zIndex:1, background:'var(--white)', borderRadius:'var(--card-radius)',
        width:'100%', maxWidth:860, maxHeight:'90vh', overflowY:'auto',
        display:'grid', gridTemplateColumns:'1fr 1fr', boxShadow:'var(--shadow-lg)',
        animation:'scaleIn .35s cubic-bezier(.16,1,.3,1) both',
      }}>
        <style>{`@keyframes scaleIn{from{opacity:0;transform:scale(.95) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        {/* Visual */}
        <div style={{ background:'var(--card-bg)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:110, minHeight:400, position:'relative', borderRight:'1px solid var(--border)', borderRadius:'var(--card-radius) 0 0 var(--card-radius)' }}>
          {product.images?.[0]
            ? <img src={product.images[0]} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'var(--card-radius) 0 0 var(--card-radius)' }} />
            : product.emoji || '👗'
          }
          <div style={{ position:'absolute', inset:14, border:'1px solid var(--border)', borderRadius:2, opacity:.5, pointerEvents:'none' }} />
        </div>

        {/* Info */}
        <div style={{ padding:'32px 28px', display:'flex', flexDirection:'column', overflowY:'auto' }}>
          <button onClick={handleClose} style={{ position:'absolute', top:12, right:12, width:30, height:30, background:'var(--white)', border:'1px solid var(--border)', borderRadius:'50%', fontSize:14, cursor:'none', color:'var(--black)' }}>✕</button>

          <div style={{ fontSize:10, letterSpacing:'.15em', textTransform:'uppercase', color:'var(--warm-gray)', marginBottom:7 }}>{product.category}</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:300, marginBottom:8, color:'var(--black)', lineHeight:1.1 }}>{product.name}</div>

          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <span style={{ fontSize:13, color:'var(--accent)', letterSpacing:1 }}>{avg ? stars(avg) : 'No reviews yet'}</span>
            {avg && <span style={{ fontSize:12, color:'var(--warm-gray)' }}>{avg} · {product.reviews?.length} review{product.reviews?.length !== 1 ? 's' : ''}</span>}
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
            <span style={{ fontSize:22, fontWeight:500, color:'var(--black)' }}>₹{product.price?.toLocaleString('en-IN')}</span>
            {product.originalPrice && <span style={{ fontSize:15, color:'var(--warm-gray)', textDecoration:'line-through' }}>₹{product.originalPrice.toLocaleString('en-IN')}</span>}
          </div>

          <p style={{ fontSize:13, color:'var(--warm-gray)', lineHeight:1.7, marginBottom:18 }}>{product.description}</p>

          {/* Sizes */}
          <div style={{ fontSize:10, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--black)', fontWeight:500, marginBottom:9 }}>Select Size</div>
          <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:16 }}>
            {(product.sizes || []).map(s => (
              <button key={s} onClick={() => setSelSize(s)} style={{
                width:42, height:42, border: selSize===s ? 'none' : '1px solid var(--border)',
                borderRadius:2, background: selSize===s ? 'var(--black)' : 'none',
                color: selSize===s ? 'var(--white)' : 'var(--black)',
                cursor:'none', fontSize:12, fontFamily:'var(--font-body)', transition:'all .2s',
              }}>{s}</button>
            ))}
          </div>

          <button onClick={handleAddToCart} style={{ width:'100%', padding:14, background:'var(--black)', color:'var(--white)', border:'none', borderRadius:2, fontFamily:'var(--font-body)', fontSize:12, fontWeight:500, letterSpacing:'.15em', textTransform:'uppercase', cursor:'none', marginBottom:16 }}>
            Add to Cart
          </button>

          {/* Reviews */}
          <div style={{ borderTop:'1px solid var(--border)', paddingTop:14 }}>
            <div style={{ fontSize:11, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--black)', fontWeight:500, marginBottom:10 }}>Customer Reviews</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:130, overflowY:'auto', marginBottom:12 }}>
              {!product.reviews?.length ? (
                <div style={{ fontSize:12, color:'var(--warm-gray)', padding:'6px 0' }}>No reviews yet — be the first!</div>
              ) : product.reviews.map((r,i) => (
                <div key={i} style={{ background:'var(--card-bg)', borderRadius:5, padding:'9px 11px', border:'var(--card-border)' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:3 }}>
                    <span style={{ fontSize:12, fontWeight:500, color:'var(--black)' }}>{r.name}</span>
                    <span style={{ fontSize:16 }}>{r.emoji}</span>
                  </div>
                  <div style={{ fontSize:12, color:'var(--warm-gray)', lineHeight:1.5 }}>{r.text}</div>
                  <div style={{ fontSize:10, color:'var(--warm-gray)', marginTop:3 }}>
                    {new Date(r.createdAt).toLocaleDateString('en-IN',{month:'short',year:'numeric'})}
                  </div>
                </div>
              ))}
            </div>

            {/* Write review */}
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <div style={{ fontSize:10, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--warm-gray)', fontWeight:500 }}>Write a Review</div>
              <input value={revName} onChange={e=>setRevName(e.target.value)} placeholder="Your name"
                style={{ padding:'8px 10px', border:'1px solid var(--border)', borderRadius:4, background:'var(--card-bg)', fontFamily:'var(--font-body)', fontSize:12, color:'var(--black)', outline:'none' }} />
              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                <span style={{ fontSize:10, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--warm-gray)', marginRight:2 }}>Rate:</span>
                {EMOJI_OPTS.map(opt => (
                  <button key={opt.v} onClick={() => setSelEmoji(opt.v)} style={{
                    fontSize:21, cursor:'none', background:'none', border:'none', padding:1,
                    opacity: selEmoji===opt.v ? 1 : .3,
                    transform: selEmoji===opt.v ? 'scale(1.3)' : 'scale(1)',
                    transition:'transform .15s,opacity .15s',
                  }}>{opt.e}</button>
                ))}
              </div>
              <textarea value={revText} onChange={e=>setRevText(e.target.value)} rows={2} placeholder="Share your experience…"
                style={{ padding:'8px 10px', border:'1px solid var(--border)', borderRadius:4, background:'var(--card-bg)', fontFamily:'var(--font-body)', fontSize:12, color:'var(--black)', outline:'none', resize:'none' }} />
              <button onClick={handleReview} disabled={submitting} style={{ padding:'9px 18px', background:'var(--black)', color:'var(--white)', border:'none', borderRadius:2, fontFamily:'var(--font-body)', fontSize:10, fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase', cursor:'none', alignSelf:'flex-start' }}>
                {submitting ? 'Posting…' : 'Post Review'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
