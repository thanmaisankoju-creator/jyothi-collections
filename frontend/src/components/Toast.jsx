// frontend/src/components/Toast.jsx
export default function Toast({ show, msg }) {
  return (
    <div style={{
      position:'fixed', bottom:36, left:'50%',
      transform:`translateX(-50%) translateY(${show ? 0 : 80}px)`,
      background:'var(--black)', color:'var(--white)',
      padding:'13px 28px', borderRadius:4,
      fontSize:13, zIndex:9000,
      transition:'transform .4s cubic-bezier(.4,0,.2,1)',
      whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:10,
      pointerEvents:'none',
    }}>
      <span style={{ color:'var(--success)', fontSize:15 }}>✓</span>
      {msg}
    </div>
  );
}
