// frontend/src/components/AdminLock.jsx
import { useState, useRef } from 'react';
import { useUIStore, useAdminStore } from '../utils/store';
import { adminLogin } from '../utils/api';

export default function AdminLock() {
  const [pw, setPw]       = useState('');
  const [err, setErr]     = useState('');
  const [show, setShow]   = useState(false);
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const { closeAdminLock, openAdminPanel } = useUIStore();
  const { login } = useAdminStore();
  const boxRef = useRef(null);

  const handleClose = () => {
    document.body.style.overflow = '';
    closeAdminLock();
  };

  const handleUnlock = async () => {
    if (!pw) { setErr('Please enter password'); return; }
    setLoading(true);
    try {
      const res = await adminLogin({ password: pw });
      login(res.data.token);
      handleClose();
      openAdminPanel();
    } catch {
      setErr('Incorrect password. Please try again.');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setPw('');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:6000, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,.82)', backdropFilter:'blur(12px)', animation:'fadeIn .3s both' }}>
      <div
        ref={boxRef}
        style={{
          background:'var(--white)', borderRadius:12, padding:'44px 38px',
          width:'100%', maxWidth:360, textAlign:'center',
          boxShadow:'var(--shadow-lg)',
          animation: shaking ? 'shake .4s ease' : 'scaleIn .35s both',
        }}
      >
        <style>{`
          @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}
          @keyframes scaleIn{from{opacity:0;transform:scale(.95) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
        `}</style>

        <div style={{ fontSize:38, marginBottom:14 }}>🔐</div>
        <div style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:300, color:'var(--black)', marginBottom:6 }}>Admin Access</div>
        <div style={{ fontSize:13, color:'var(--warm-gray)', marginBottom:26 }}>Enter password to manage the store</div>

        <div style={{ position:'relative', marginBottom:10 }}>
          <input
            type={show ? 'text' : 'password'}
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUnlock()}
            placeholder="••••••••"
            style={{ width:'100%', padding:'13px 44px 13px 16px', border:'1px solid var(--border)', borderRadius:6, background:'var(--cream)', fontFamily:'var(--font-body)', fontSize:15, color:'var(--black)', outline:'none', textAlign:'center', letterSpacing:'.25em' }}
          />
          <button onClick={() => setShow(s => !s)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'none', fontSize:16, color:'var(--warm-gray)' }}>
            {show ? '🙈' : '👁'}
          </button>
        </div>

        <div style={{ fontSize:12, color:'#C0392B', minHeight:16, marginBottom:10 }}>{err}</div>

        <button
          onClick={handleUnlock}
          disabled={loading}
          style={{ width:'100%', padding:13, background:'var(--black)', color:'var(--white)', border:'none', borderRadius:6, fontFamily:'var(--font-body)', fontSize:13, fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase', cursor:'none', marginBottom:10 }}>
          {loading ? 'Checking…' : 'Unlock Admin Panel'}
        </button>
        <button onClick={handleClose} style={{ background:'none', border:'none', fontSize:12, color:'var(--warm-gray)', cursor:'none' }}>Cancel</button>
      </div>
    </div>
  );
}
