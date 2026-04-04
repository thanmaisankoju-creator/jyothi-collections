// frontend/src/components/Marquee.jsx
import { useEffect, useRef } from 'react';
const ITEMS = ['New Arrivals','Explore the Fashion World','Free Shipping over ₹999','Handcrafted Quality','Easy Returns','Premium Collections','Jyothi Collections'];
export default function Marquee() {
  return (
    <div style={{ background:'var(--black)', padding:'14px 0', overflow:'hidden' }}>
      <div style={{ display:'flex', gap:44, whiteSpace:'nowrap', animation:'marquee 16s linear infinite', width:'max-content' }}>
        {[...ITEMS,...ITEMS,...ITEMS,...ITEMS].map((t,i) => (
          <span key={i} style={{ fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:'rgba(255,255,255,.4)', display:'flex', alignItems:'center', gap:44 }}>
            <span style={{ width:3, height:3, borderRadius:'50%', background:'var(--accent)', display:'inline-block' }}/>
            {t}
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}
