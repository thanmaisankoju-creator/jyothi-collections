// frontend/src/components/SearchOverlay.jsx
import { useState, useEffect, useRef } from 'react';
import { useUIStore } from '../utils/store';

export default function SearchOverlay({ products = [], onProductClick }) {
  const [query, setQuery]   = useState('');
  const { closeSearch }     = useUIStore();
  const inputRef            = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
    const onKey = (e) => e.key === 'Escape' && closeSearch();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const results = query.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleClick = (p) => {
    closeSearch();
    onProductClick?.(p);
  };

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,.78)',
      backdropFilter:'blur(20px)', zIndex:2000,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      animation:'fadeIn .3s both',
    }}>
      <button onClick={closeSearch}
        style={{ position:'absolute', top:28, right:48, background:'none', border:'none', fontSize:28, cursor:'none', color:'rgba(255,255,255,.5)', transition:'color .2s,transform .2s' }}
        onMouseEnter={e => { e.target.style.color='#fff'; e.target.style.transform='rotate(90deg)'; }}
        onMouseLeave={e => { e.target.style.color='rgba(255,255,255,.5)'; e.target.style.transform='rotate(0)'; }}
      >✕</button>

      {/* Input */}
      <div style={{ width:'100%', maxWidth:640, borderBottom:'2px solid rgba(255,255,255,.55)', display:'flex', alignItems:'center', gap:14, paddingBottom:12 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search products…"
          style={{ flex:1, background:'none', border:'none', outline:'none', fontFamily:'var(--font-display)', fontSize:36, fontWeight:300, color:'#fff', caretColor:'var(--accent)' }}
        />
      </div>

      {/* Results */}
      <div style={{ width:'100%', maxWidth:640, marginTop:28, display:'flex', flexDirection:'column', gap:10, maxHeight:340, overflowY:'auto' }}>
        {results.length === 0 && query && (
          <div style={{ color:'rgba(255,255,255,.5)', fontSize:14, padding:'12px 0' }}>No results for "{query}"</div>
        )}
        {results.map(p => (
          <div
            key={p.id}
            onClick={() => handleClick(p)}
            data-cursor="pointer"
            style={{ display:'flex', alignItems:'center', gap:14, padding:12, borderRadius:8, background:'rgba(255,255,255,.06)', cursor:'none', transition:'background .2s' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,.12)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,.06)'}
          >
            <div style={{ width:50, height:62, borderRadius:4, background:'rgba(255,255,255,.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
              {p.images?.[0] ? <img src={p.images[0]} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:4 }} /> : p.emoji}
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:500, color:'#fff' }}>{p.name}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', textTransform:'uppercase', letterSpacing:'.08em' }}>{p.category}</div>
              <div style={{ fontSize:13, color:'var(--accent)', marginTop:2 }}>₹{p.price?.toLocaleString('en-IN')}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
