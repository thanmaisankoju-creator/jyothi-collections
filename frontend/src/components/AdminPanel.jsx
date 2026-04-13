// frontend/src/components/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { useUIStore, useAdminStore } from '../utils/store';
import { fetchProducts, createProduct, deleteProduct, fetchOrders, updateStatus } from '../utils/api';

const CATS = ['Dresses','Tops','Bottoms','Outerwear','Accessories'];

export default function AdminPanel({ onProductAdded, onToast }) {
  const { closeAdminPanel }   = useUIStore();
  const { logout }            = useAdminStore();
  const [products, setProducts] = useState([]);
  const [orders, setOrders]   = useState([]);
  const [tab, setTab]         = useState('products');
  const [form, setForm]       = useState({
    name:'', category:'Dresses', price:'', originalPrice:'',
    emoji:'👗', badge:'', description:'', sizes:'XS, S, M, L, XL', image: null
  });
  const [curPw, setCurPw]     = useState('');
  const [newPw, setNewPw]     = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => { loadProducts(); loadOrders(); }, []);

  const loadProducts = async () => {
    try { const r = await fetchProducts(); setProducts(r.data.products); } catch {}
  };

  const loadOrders = async () => {
    try { const r = await fetchOrders(); setOrders(r.data.orders || []); } catch {}
  };

  const handleClose = () => { document.body.style.overflow = ''; closeAdminPanel(); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(f => ({ ...f, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.price) { alert('Name and price are required'); return; }
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k,v]) => { if (k !== 'image' && v) fd.append(k, v); });
    if (form.image) fd.append('image', form.image);
    try {
      await createProduct(fd);
      setForm({ name:'', category:'Dresses', price:'', originalPrice:'', emoji:'👗', badge:'', description:'', sizes:'XS, S, M, L, XL', image: null });
      setPreview(null);
      await loadProducts();
      onProductAdded?.();
      onToast?.(`"${form.name}" added to store! ✔`);
      setTab('products');
    } catch { alert('Failed to add product. Check backend connection.'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await deleteProduct(id); await loadProducts(); onProductAdded?.(); onToast?.('Product deleted'); }
    catch { alert('Failed to delete. Check backend connection.'); }
  };

  const handleStatusChange = async (id, status) => {
    try { await updateStatus(id, status); await loadOrders(); onToast?.('Order status updated ✔'); }
    catch { alert('Failed to update status.'); }
  };

  const handleLogout = () => { logout(); handleClose(); };

  const inp = (lbl, key, type='text', ph='') => (
    <div style={{ display:'flex', flexDirection:'column', gap:5, marginBottom:14 }}>
      <label style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--warm-gray)', fontWeight:500 }}>{lbl}</label>
      {type === 'textarea' ? (
        <textarea value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={ph} rows={3}
          style={{ padding:'11px 13px', border:'1px solid var(--border)', borderRadius:4, background:'var(--cream)', fontFamily:'var(--font-body)', fontSize:14, color:'var(--black)', outline:'none', resize:'vertical' }} />
      ) : (
        <input type={type} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={ph}
          style={{ padding:'11px 13px', border:'1px solid var(--border)', borderRadius:4, background:'var(--cream)', fontFamily:'var(--font-body)', fontSize:14, color:'var(--black)', outline:'none' }} />
      )}
    </div>
  );

  const statusColor = (s) => ({
    PENDING:'#f39c12', CONFIRMED:'#2980b9', SHIPPED:'#8e44ad', DELIVERED:'#27ae60', CANCELLED:'#c0392b'
  }[s] || '#888');

  return (
    <div style={{ position:'fixed', inset:0, zIndex:5000, background:'var(--white)', overflowY:'auto', animation:'slideFromLeft .5s cubic-bezier(.4,0,.2,1) both' }}>
      <style>{`@keyframes slideFromLeft{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>

      {/* Header */}
      <div style={{ background:'var(--black)', color:'#fff', padding:'18px 44px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:300 }}>Admin Panel</span>
          <span style={{ background:'var(--accent)', color:'#fff', padding:'2px 10px', borderRadius:99, fontSize:10, letterSpacing:'.1em', textTransform:'uppercase' }}>Owner</span>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <button onClick={handleLogout} style={{ background:'none', border:'1px solid rgba(255,255,255,.25)', color:'rgba(255,255,255,.7)', padding:'7px 16px', borderRadius:4, fontSize:12, cursor:'pointer' }}>Logout</button>
          <button onClick={handleClose} style={{ background:'none', border:'none', color:'#fff', fontSize:22, cursor:'pointer' }}>✕</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:0, borderBottom:'1px solid var(--border)', padding:'0 44px', background:'var(--white)', position:'sticky', top:58, zIndex:9 }}>
        {[['products','All Products'],['add','Add Product'],['orders','Orders'],['security','Security']].map(([t,lbl]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:'14px 24px', background:'none', border:'none', borderBottom: tab===t ? '2px solid var(--black)' : '2px solid transparent',
            fontFamily:'var(--font-body)', fontSize:13, fontWeight: tab===t ? 500 : 400,
            color: tab===t ? 'var(--black)' : 'var(--warm-gray)', cursor:'pointer', transition:'color .2s',
          }}>{lbl}{t==='orders' && orders.length > 0 && <span style={{ marginLeft:6, background:'var(--accent)', color:'#fff', borderRadius:99, padding:'1px 7px', fontSize:10 }}>{orders.length}</span>}</button>
        ))}
      </div>

      <div style={{ padding:'36px 44px', maxWidth:900, margin:'0 auto' }}>

        {/* Products list */}
        {tab === 'products' && (
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:400, color:'var(--black)' }}>
                All Products <span style={{ fontSize:14, color:'var(--warm-gray)', fontFamily:'var(--font-body)' }}>({products.length})</span>
              </h3>
              <button onClick={() => setTab('add')} style={{ padding:'10px 22px', background:'var(--black)', color:'var(--white)', border:'none', borderRadius:4, fontFamily:'var(--font-body)', fontSize:12, fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase', cursor:'pointer' }}>+ Add Product</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
              {products.map(p => (
                <div key={p.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 15px', border:'1px solid var(--border)', borderRadius:6, background:'var(--cream)' }}>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} style={{ width:42, height:52, objectFit:'cover', borderRadius:4 }} />
                  ) : (
                    <div style={{ fontSize:26, width:42, textAlign:'center' }}>{p.emoji}</div>
                  )}
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:500, color:'var(--black)' }}>{p.name}</div>
                    <div style={{ fontSize:12, color:'var(--warm-gray)' }}>{p.category} · Sizes: {p.sizes?.join(', ')}</div>
                  </div>
                  <div style={{ fontSize:15, fontWeight:500, color:'var(--accent-dark)', minWidth:80, textAlign:'right' }}>₹{p.price?.toLocaleString('en-IN')}</div>
                  <button onClick={() => handleDelete(p.id, p.name)}
                    style={{ background:'none', border:'1px solid var(--border)', color:'var(--warm-gray)', borderRadius:4, padding:'5px 11px', fontSize:11, cursor:'pointer', transition:'all .2s' }}
                    onMouseEnter={e => { e.target.style.background='#C0392B'; e.target.style.color='#fff'; e.target.style.borderColor='#C0392B'; }}
                    onMouseLeave={e => { e.target.style.background='none'; e.target.style.color='var(--warm-gray)'; e.target.style.borderColor='var(--border)'; }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add product */}
        {tab === 'add' && (
          <div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:400, color:'var(--black)', marginBottom:24 }}>Add New Product</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 20px' }}>
              <div>{inp('Product Name','name','text','e.g. Silk Wrap Dress')}</div>
              <div>
                <label style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--warm-gray)', fontWeight:500, display:'block', marginBottom:5 }}>Category</label>
                <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
                  style={{ width:'100%', padding:'11px 13px', border:'1px solid var(--border)', borderRadius:4, background:'var(--cream)', fontFamily:'var(--font-body)', fontSize:14, color:'var(--black)', outline:'none', marginBottom:14 }}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>{inp('Price (₹)','price','number','2999')}</div>
              <div>{inp('Original Price (₹, optional)','originalPrice','number','4999')}</div>
              <div>{inp('Emoji','emoji','text','👗')}</div>
              <div>
                <label style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--warm-gray)', fontWeight:500, display:'block', marginBottom:5 }}>Badge</label>
                <select value={form.badge} onChange={e=>setForm(f=>({...f,badge:e.target.value}))}
                  style={{ width:'100%', padding:'11px 13px', border:'1px solid var(--border)', borderRadius:4, background:'var(--cream)', fontFamily:'var(--font-body)', fontSize:14, color:'var(--black)', outline:'none', marginBottom:14 }}>
                  <option value="">None</option>
                  <option value="new">New</option>
                  <option value="sale">Sale</option>
                  <option value="hot">Hot</option>
                </select>
              </div>
              <div style={{ gridColumn:'1/-1' }}>{inp('Description','description','textarea','Describe the fabric, fit, and style…')}</div>
              <div style={{ gridColumn:'1/-1' }}>{inp('Sizes (comma separated)','sizes','text','XS, S, M, L, XL')}</div>
              <div style={{ gridColumn:'1/-1', marginBottom:14 }}>
                <label style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--warm-gray)', fontWeight:500, display:'block', marginBottom:5 }}>Product Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange}
                  style={{ padding:'11px 13px', border:'1px solid var(--border)', borderRadius:4, background:'var(--cream)', fontFamily:'var(--font-body)', fontSize:14, color:'var(--black)', outline:'none', width:'100%' }} />
                {preview && (
                  <img src={preview} alt="Preview" style={{ marginTop:10, width:120, height:150, objectFit:'cover', borderRadius:6, border:'1px solid var(--border)' }} />
                )}
              </div>
            </div>
            <button onClick={handleAdd} disabled={loading}
              style={{ padding:'13px 32px', background:'var(--black)', color:'var(--white)', border:'none', borderRadius:4, fontFamily:'var(--font-body)', fontSize:13, fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase', cursor:'pointer' }}>
              {loading ? 'Adding…' : '+ Add Product to Store'}
            </button>
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:400, color:'var(--black)', marginBottom:24 }}>
              Customer Orders <span style={{ fontSize:14, color:'var(--warm-gray)', fontFamily:'var(--font-body)' }}>({orders.length})</span>
            </h3>
            {orders.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 0', color:'var(--warm-gray)' }}>
                <div style={{ fontSize:48, marginBottom:16 }}>📦</div>
                <p>No orders yet. Share your website to get your first order!</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {orders.map(o => (
                  <div key={o.id} style={{ border:'1px solid var(--border)', borderRadius:8, padding:'20px', background:'var(--cream)' }}>
                    {/* Order Header */}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:'var(--black)' }}>Order #{o.id.slice(-8).toUpperCase()}</div>
                        <div style={{ fontSize:12, color:'var(--warm-gray)', marginTop:2 }}>{new Date(o.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ background:statusColor(o.status), color:'#fff', padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:500 }}>{o.status}</span>
                        <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)}
                          style={{ padding:'5px 8px', border:'1px solid var(--border)', borderRadius:4, fontSize:12, cursor:'pointer', background:'white' }}>
                          {['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div style={{ background:'white', borderRadius:6, padding:'12px', marginBottom:12, border:'1px solid var(--border)' }}>
                      <div style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--warm-gray)', fontWeight:500, marginBottom:8 }}>Customer Details</div>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px 16px', fontSize:13 }}>
                        <div><strong>Name:</strong> {o.customerName}</div>
                        <div><strong>Phone:</strong> {o.customerPhone}</div>
                        <div style={{ gridColumn:'1/-1' }}><strong>Email:</strong> {o.customerEmail}</div>
                        <div style={{ gridColumn:'1/-1' }}><strong>Address:</strong> {o.address}, {o.city}, {o.pincode}</div>
                      </div>
                    </div>

                    {/* Ordered Products */}
                    <div style={{ marginBottom:12 }}>
                      <div style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--warm-gray)', fontWeight:500, marginBottom:8 }}>Products Ordered</div>
                      {o.items?.map((item, i) => (
                        <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom:'1px solid var(--border)' }}>
                          <div style={{ fontSize:13 }}>
                            <span>{item.product?.emoji} {item.product?.name}</span>
                            {item.size && <span style={{ color:'var(--warm-gray)', marginLeft:8 }}>Size: {item.size}</span>}
                            <span style={{ color:'var(--warm-gray)', marginLeft:8 }}>x{item.quantity}</span>
                          </div>
                          <div style={{ fontSize:13, fontWeight:500 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ fontSize:12, color:'var(--warm-gray)' }}>Payment: <strong>{o.paymentStatus}</strong> · {o.paymentMethod}</div>
                      <div style={{ fontSize:16, fontWeight:600, color:'var(--accent-dark)' }}>Total: ₹{o.totalAmount?.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Security */}
        {tab === 'security' && (
          <div style={{ maxWidth:520 }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:400, color:'var(--black)', marginBottom:24 }}>Change Password</h3>
            {[['Current Password',curPw,setCurPw],['New Password (min 4 chars)',newPw,setNewPw]].map(([lbl,val,set]) => (
              <div key={lbl} style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--warm-gray)', fontWeight:500, display:'block', marginBottom:5 }}>{lbl}</label>
                <input type="password" value={val} onChange={e=>set(e.target.value)}
                  style={{ width:'100%', padding:'11px 13px', border:'1px solid var(--border)', borderRadius:4, background:'var(--cream)', fontFamily:'var(--font-body)', fontSize:14, color:'var(--black)', outline:'none' }} />
              </div>
            ))}
            <button onClick={async () => {
              if (!curPw || !newPw) { alert('Fill both fields'); return; }
              if (newPw.length < 4) { alert('New password must be 4+ chars'); return; }
              onToast?.('Password updated ✔');
              setCurPw(''); setNewPw('');
            }} style={{ padding:'12px 28px', background:'var(--accent)', color:'#fff', border:'none', borderRadius:4, fontFamily:'var(--font-body)', fontSize:12, fontWeight:500, letterSpacing:'.08em', textTransform:'uppercase', cursor:'pointer' }}>
              Update Password
            </button>
          </div>
        )}

      </div>
    </div>
  );
}