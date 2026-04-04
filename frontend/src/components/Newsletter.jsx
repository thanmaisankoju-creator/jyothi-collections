// frontend/src/components/Newsletter.jsx
import { useState } from 'react';
export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done,  setDone]  = useState(false);
  return (
    <section style={{ background:'var(--charcoal,#0D0A4A)', textAlign:'center', padding:'72px 44px' }}>
      <div style={{ fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', color:'var(--accent)', marginBottom:10 }}>Stay in the Loop</div>
      <h2 style={{ fontFamily:'var(--font-display)', fontSize:40, fontWeight:300, color:'var(--white,#fff)', marginBottom:10 }}>
        Get <em style={{ fontStyle:'italic', color:'var(--accent)' }}>Early Access</em>
      </h2>
      <p style={{ fontSize:14, color:'rgba(255,255,255,.45)', marginBottom:30 }}>New arrivals, exclusive offers, and style notes — delivered to your inbox.</p>
      {done ? (
        <div style={{ fontSize:15, color:'var(--accent)', fontFamily:'var(--font-display)', fontStyle:'italic' }}>Subscribed! Welcome to Jyothi Collections ✓</div>
      ) : (
        <div style={{ display:'flex', maxWidth:440, margin:'0 auto' }}>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
            style={{ flex:1, padding:'13px 17px', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRight:'none', color:'#fff', fontFamily:'var(--font-body)', fontSize:13, outline:'none', borderRadius:'2px 0 0 2px' }} />
          <button onClick={() => { if(email) setDone(true); }}
            style={{ padding:'13px 22px', background:'var(--accent)', color:'#fff', border:'none', borderRadius:'0 2px 2px 0', fontFamily:'var(--font-body)', fontSize:11, fontWeight:500, letterSpacing:'.12em', textTransform:'uppercase', cursor:'none' }}>
            Subscribe
          </button>
        </div>
      )}
    </section>
  );
}
