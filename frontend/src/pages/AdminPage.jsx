// frontend/src/pages/AdminPage.jsx
// Standalone admin page at /admin route (alternative to modal admin panel)
import { useState, useEffect } from 'react';
import { useAdminStore } from '../utils/store';
import { adminLogin, fetchProducts, createProduct, deleteProduct, fetchOrders, updateStatus, getDashboard } from '../utils/api';
import logo from '/images/logo.png';

export default function AdminPage() {
  const { isAuthenticated, login, logout, token } = useAdminStore();
  const [pw, setPw]     = useState('');
  const [err, setErr]   = useState('');
  const [tab, setTab]   = useState('dashboard');
  const [data, setData] = useState({ stats:{}, products:[], orders:[], recentOrders:[] });
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (isAuthenticated) loadData(); }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dash, prods, ords] = await Promise.all([getDashboard(), fetchProducts(), fetchOrders()]);
      setData({ stats: dash.data.stats, recentOrders: dash.data.recentOrders, products: prods.data.products, orders: ords.data.orders });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleLogin = async () => {
    try { const r = await adminLogin({ password: pw }); login(r.data.token); setErr(''); }
    catch { setErr('Incorrect password'); setPw(''); }
  };

  if (!isAuthenticated) return (
    <div style={{ minHeight:'100vh', background:'#F7F5FF', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fff', borderRadius:12, padding:'44px 38px', width:340, textAlign:'center', boxShadow:'0 16px 64px rgba(43,45,181,.15)' }}>
        <img src={logo} alt="Jyothi Collections" style={{ height:48, marginBottom:20 }} />
        <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:22, fontWeight:300, marginBottom:20, color:'#1A1660' }}>Admin Login</div>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} placeholder="Enter password"
          style={{ width:'100%', padding:'12px 14px', border:'1px solid #D8D6F0', borderRadius:6, fontSize:15, textAlign:'center', letterSpacing:'.2em', marginBottom:8, outline:'none' }} />
        {err && <div style={{ fontSize:12, color:'#C0392B', marginBottom:8 }}>{err}</div>}
        <button onClick={handleLogin} style={{ width:'100%', padding:13, background:'#1A1660', color:'#fff', border:'none', borderRadius:6, fontSize:13, fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase', cursor:'pointer' }}>Login</button>
        <a href="/" style={{ display:'block', marginTop:14, fontSize:12, color:'#8B89C0', textDecoration:'none' }}>← Back to Store</a>
      </div>
    </div>
  );

  const TABS = [['dashboard','Dashboard'],['products','Products'],['orders','Orders']];

  return (
    <div style={{ minHeight:'100vh', background:'#F7F5FF', fontFamily:'DM Sans,sans-serif' }}>
      {/* Nav */}
      <div style={{ background:'#1A1660', padding:'16px 44px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <img src={logo} alt="" style={{ height:36, filter:'brightness(0) invert(1)', opacity:.8 }} />
          <span style={{ color:'rgba(255,255,255,.5)', fontSize:12 }}>Admin Dashboard</span>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <a href="/" style={{ color:'rgba(255,255,255,.6)', fontSize:13, textDecoration:'none' }}>← View Store</a>
          <button onClick={logout} style={{ background:'none', border:'1px solid rgba(255,255,255,.25)', color:'rgba(255,255,255,.7)', padding:'6px 14px', borderRadius:4, fontSize:12, cursor:'pointer' }}>Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background:'#fff', borderBottom:'1px solid #D8D6F0', padding:'0 44px', display:'flex', gap:0 }}>
        {TABS.map(([t,l]) => (
          <button key={t} onClick={()=>setTab(t)} style={{ padding:'14px 22px', background:'none', border:'none', borderBottom: tab===t ? '2px solid #1A1660' : '2px solid transparent', fontSize:13, fontWeight: tab===t ? 500 : 400, color: tab===t ? '#1A1660' : '#8B89C0', cursor:'pointer' }}>{l}</button>
        ))}
      </div>

      <div style={{ padding:'36px 44px', maxWidth:1100, margin:'0 auto' }}>
        {loading && <div style={{ textAlign:'center', padding:60, color:'#8B89C0' }}>Loading…</div>}

        {/* Dashboard */}
        {!loading && tab === 'dashboard' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18, marginBottom:36 }}>
              {[
                ['Total Products', data.stats.totalProducts || 0, '📦'],
                ['Total Orders',   data.stats.totalOrders   || 0, '🛍'],
                ['Revenue (Paid)', `₹${(data.stats.totalRevenue||0).toLocaleString('en-IN')}`, '💰'],
                ['Categories',     data.stats.categoryCounts?.length || 0, '🗂'],
              ].map(([lbl,val,icon]) => (
                <div key={lbl} style={{ background:'#fff', border:'1px solid #D8D6F0', borderRadius:8, padding:'20px 22px' }}>
                  <div style={{ fontSize:26, marginBottom:8 }}>{icon}</div>
                  <div style={{ fontSize:26, fontWeight:500, color:'#1A1660', marginBottom:4 }}>{val}</div>
                  <div style={{ fontSize:12, color:'#8B89C0', letterSpacing:'.06em' }}>{lbl}</div>
                </div>
              ))}
            </div>
            <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:20, fontWeight:400, color:'#1A1660', marginBottom:16 }}>Recent Orders</h3>
            {data.recentOrders.map(o => (
              <div key={o.id} style={{ background:'#fff', border:'1px solid #D8D6F0', borderRadius:6, padding:'14px 18px', marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:500, color:'#1A1660' }}>{o.customerName}</div>
                  <div style={{ fontSize:12, color:'#8B89C0' }}>{o.id.slice(0,8).toUpperCase()} · {o.items?.length} items · {new Date(o.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                  <span style={{ fontSize:15, fontWeight:500, color:'#1A1660' }}>₹{o.totalAmount?.toLocaleString('en-IN')}</span>
                  <span style={{ padding:'3px 10px', borderRadius:99, fontSize:10, fontWeight:500, letterSpacing:'.08em', textTransform:'uppercase', background: o.status==='DELIVERED'?'#e8f5e9':o.status==='SHIPPED'?'#e3f2fd':o.status==='CANCELLED'?'#ffebee':'#fff9c4', color: o.status==='DELIVERED'?'#2e7d32':o.status==='SHIPPED'?'#1565c0':o.status==='CANCELLED'?'#c62828':'#f57f17' }}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products */}
        {!loading && tab === 'products' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:22 }}>
              <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:20, fontWeight:400, color:'#1A1660' }}>All Products ({data.products.length})</h3>
            </div>
            {data.products.map(p => (
              <div key={p.id} style={{ background:'#fff', border:'1px solid #D8D6F0', borderRadius:6, padding:'13px 16px', marginBottom:10, display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ fontSize:26, width:40, textAlign:'center' }}>{p.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:500, color:'#1A1660' }}>{p.name}</div>
                  <div style={{ fontSize:12, color:'#8B89C0' }}>{p.category} · {p.sizes?.join(', ')}</div>
                </div>
                <div style={{ fontSize:15, fontWeight:500, color:'#2B2DB5' }}>₹{p.price?.toLocaleString('en-IN')}</div>
                <button onClick={async ()=>{ if(confirm(`Delete "${p.name}"?`)){ await deleteProduct(p.id); loadData(); }}} style={{ background:'none', border:'1px solid #D8D6F0', color:'#8B89C0', borderRadius:4, padding:'5px 12px', fontSize:11, cursor:'pointer' }}>Delete</button>
              </div>
            ))}
          </div>
        )}

        {/* Orders */}
        {!loading && tab === 'orders' && (
          <div>
            <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:20, fontWeight:400, color:'#1A1660', marginBottom:22 }}>All Orders ({data.orders.length})</h3>
            {data.orders.map(o => (
              <div key={o.id} style={{ background:'#fff', border:'1px solid #D8D6F0', borderRadius:6, padding:'16px 18px', marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:500, color:'#1A1660' }}>{o.customerName} · {o.phone}</div>
                    <div style={{ fontSize:12, color:'#8B89C0', marginTop:2 }}>#{o.id.slice(0,8).toUpperCase()} · {new Date(o.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</div>
                    <div style={{ fontSize:12, color:'#8B89C0', marginTop:2 }}>📍 {o.address}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:16, fontWeight:600, color:'#1A1660' }}>₹{o.totalAmount?.toLocaleString('en-IN')}</div>
                    <select value={o.status} onChange={async e=>{ await updateStatus(o.id,e.target.value); loadData(); }}
                      style={{ marginTop:6, padding:'5px 10px', border:'1px solid #D8D6F0', borderRadius:4, fontSize:12, color:'#1A1660', cursor:'pointer', background:'#F7F5FF' }}>
                      {['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {o.items?.map((it,i) => (
                    <span key={i} style={{ fontSize:11, background:'#F7F5FF', border:'1px solid #D8D6F0', borderRadius:3, padding:'3px 8px', color:'#1A1660' }}>
                      {it.product?.name} ({it.size}) ×{it.quantity}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
