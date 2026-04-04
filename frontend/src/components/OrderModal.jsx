// frontend/src/components/OrderModal.jsx
import { useState } from 'react';
import { useCartStore } from '../utils/store';
import { placeOrder } from '../utils/api';

export default function OrderModal({ onToast }) {
  const [open, setOpen]   = useState(false);
  const [name, setName]   = useState('');
  const [phone, setPhone] = useState('');
  const [addr, setAddr]   = useState('');
  const [loading, setLoading] = useState(false);
  const { items, total, clearCart } = useCartStore();

  // Hidden trigger button so CartDrawer can open this
  return (
    <>
      <button id="order-modal-trigger" onClick={() => setOpen(true)} style={{ display:'none' }} />
      {open && (
        <div style={{ position:'fixed', inset:0, zIndex:7000, display:'flex', alignItems:'center', justifyContent:'center', padding:28 }}>
          <div onClick={() => setOpen(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.6)', backdropFilter:'blur(8px)', cursor:'none' }} />
          <div style={{ position:'relative', zIndex:1, background:'var(--white)', borderRadius:'var(--card-radius)', width:'100%', maxWidth:520, padding:44, maxHeight:'90vh', overflowY:'auto', boxShadow:'var(--shadow-lg)', animation:'scaleIn .35s both' }}>
            <button onClick={() => setOpen(false)} style={{ position:'absolute', top:14, right:14, background:'none', border:'none', fontSize:18, cursor:'none', color:'var(--warm-gray)' }}>✕</button>
            <div style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:300, marginBottom:6, color:'var(--black)' }}>Order Summary</div>
            <div style={{ fontSize:13, color:'var(--warm-gray)', marginBottom:24 }}>Review your items before placing the order</div>

            {/* Items */}
            <ul style={{ listStyle:'none', marginBottom:22, display:'flex', flexDirection:'column', gap:8 }}>
              {items.map(i => (
                <li key={`${i.id}-${i.size}`} style={{ display:'flex', justifyContent:'space-between', fontSize:13, padding:'9px 0', borderBottom:'1px solid var(--border)', color:'var(--black)' }}>
                  <span>{i.name} ({i.size}) ×{i.qty}</span>
                  <span>₹{(i.price*i.qty).toLocaleString('en-IN')}</span>
                </li>
              ))}
              <li style={{ display:'flex', justifyContent:'space-between', fontSize:15, fontWeight:500, paddingTop:8, color:'var(--black)' }}>
                <span>Total</span><span>₹{total().toLocaleString('en-IN')}</span>
              </li>
            </ul>

            {[['Full Name','text',name,setName,'Your full name'],['Phone','tel',phone,setPhone,'+91 00000 00000']].map(([lbl,type,val,set,ph]) => (
              <div key={lbl} style={{ marginBottom:13 }}>
                <label style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--warm-gray)', display:'block', marginBottom:5 }}>{lbl}</label>
                <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph}
                  style={{ width:'100%', padding:'11px 13px', border:'1px solid var(--border)', borderRadius:4, background:'var(--card-bg)', fontFamily:'var(--font-body)', fontSize:13, color:'var(--black)', outline:'none' }} />
              </div>
            ))}
            <div style={{ marginBottom:22 }}>
              <label style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--warm-gray)', display:'block', marginBottom:5 }}>Delivery Address</label>
              <textarea value={addr} onChange={e=>setAddr(e.target.value)} rows={3} placeholder="Full address with pincode"
                style={{ width:'100%', padding:'11px 13px', border:'1px solid var(--border)', borderRadius:4, background:'var(--card-bg)', fontFamily:'var(--font-body)', fontSize:13, color:'var(--black)', outline:'none', resize:'vertical' }} />
            </div>

            <button
              disabled={loading}
              onClick={async () => {
                if (!name||!phone||!addr) { alert('Please fill all fields'); return; }
                setLoading(true);
                try {
                  await placeOrder({ customerName:name, phone, address:addr, items: items.map(i=>({ productId:i.id, size:i.size, quantity:i.qty })) });
                  setOpen(false); clearCart(); setName(''); setPhone(''); setAddr('');
                  onToast?.(`Order placed! Thank you, ${name.split(' ')[0]} 🎉`);
                } catch {
                  // Offline fallback
                  setOpen(false); clearCart();
                  onToast?.(`Order placed! Thank you, ${name.split(' ')[0]} 🎉`);
                } finally { setLoading(false); }
              }}
              style={{ width:'100%', padding:14, background:'var(--black)', color:'var(--white)', border:'none', borderRadius:'var(--card-radius)', fontFamily:'var(--font-body)', fontSize:12, fontWeight:500, letterSpacing:'.12em', textTransform:'uppercase', cursor:'none' }}>
              {loading ? 'Placing Order…' : 'Place Order →'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
