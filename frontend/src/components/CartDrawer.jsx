// frontend/src/components/CartDrawer.jsx
import { useCartStore, useUIStore } from '../utils/store';

export default function CartDrawer({ onToast }) {
  const { items, changeQty, removeItem, total } = useCartStore();
  const { closeCart, openAdminLock }            = useUIStore();

  // prevent body scroll
  if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';

  const handleClose = () => {
    document.body.style.overflow = '';
    closeCart();
  };

  return (
    <>
      {/* Overlay */}
      <div onClick={handleClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:2999, cursor:'none' }} />

      {/* Drawer */}
      <div style={{
        position:'fixed', top:0, right:0, width:420, height:'100vh',
        background:'var(--white)', zIndex:3000,
        boxShadow:'-8px 0 48px rgba(0,0,0,.13)',
        display:'flex', flexDirection:'column',
        animation:'slideInRight .45s cubic-bezier(.4,0,.2,1)',
      }}>
        <style>{`@keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* Header */}
        <div style={{ padding:'26px 30px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:400, color:'var(--black)' }}>Your Cart</div>
          <button onClick={handleClose} style={{ background:'none', border:'none', fontSize:22, cursor:'none', color:'var(--warm-gray)' }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex:1, overflowY:'auto', padding:'18px 30px', display:'flex', flexDirection:'column', gap:18 }}>
          {!items.length ? (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, color:'var(--warm-gray)', marginTop:80 }}>
              <div style={{ fontSize:48, opacity:.3 }}>🛍</div>
              <p style={{ fontSize:15 }}>Your cart is empty</p>
            </div>
          ) : items.map(item => (
            <div key={`${item.id}-${item.size}`} style={{ display:'flex', gap:14, animation:'slideIn .3s both' }}>
              <div style={{ width:70, height:86, background:'var(--cream)', borderRadius:6, fontSize:24, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:'var(--card-border)' }}>
                {item.images?.[0] ? <img src={item.images[0]} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:6 }} /> : item.emoji}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:500, marginBottom:3, color:'var(--black)' }}>{item.name}</div>
                <div style={{ fontSize:12, color:'var(--warm-gray)', marginBottom:8 }}>Size: {item.size}</div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    {[-1,1].map(d => (
                      <button key={d} onClick={() => changeQty(item.id, item.size, d)}
                        style={{ width:26, height:26, border:'1px solid var(--border)', background:'none', borderRadius:'50%', cursor:'none', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--black)' }}>
                        {d === -1 ? '−' : '+'}
                      </button>
                    ))}
                    <span style={{ fontSize:14, fontWeight:500, minWidth:16, textAlign:'center', color:'var(--black)' }}>{item.qty}</span>
                  </div>
                  <span style={{ fontSize:14, fontWeight:500, color:'var(--accent-dark)' }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                </div>
                <button onClick={() => removeItem(item.id, item.size)}
                  style={{ background:'none', border:'none', fontSize:11, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--warm-gray)', cursor:'none', marginTop:5 }}
                  onMouseEnter={e => e.target.style.color='#C0392B'}
                  onMouseLeave={e => e.target.style.color='var(--warm-gray)'}
                >Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding:'18px 30px 26px', borderTop:'1px solid var(--border)' }}>
            {[['Subtotal', `₹${total().toLocaleString('en-IN')}`], ['Shipping', 'Free']].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontSize:13, color:'var(--warm-gray)' }}>{l}</span>
                <span style={{ fontSize:13, fontWeight:500, color:'var(--black)' }}>{v}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', margin:'8px 0 18px', paddingTop:8, borderTop:'1px solid var(--border)' }}>
              <span style={{ fontSize:16, fontWeight:500, color:'var(--black)' }}>Total</span>
              <span style={{ fontSize:18, fontWeight:600, color:'var(--black)' }}>₹{total().toLocaleString('en-IN')}</span>
            </div>
            <button
              onClick={() => { handleClose(); document.getElementById('order-modal-trigger')?.click(); }}
              style={{ width:'100%', padding:15, background:'var(--black)', color:'var(--white)', border:'none', borderRadius:'var(--card-radius)', fontFamily:'var(--font-body)', fontSize:13, fontWeight:500, letterSpacing:'.12em', textTransform:'uppercase', cursor:'none' }}>
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
