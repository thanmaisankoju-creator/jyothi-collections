// frontend/src/pages/SplashPage.jsx
import { useEffect, useRef, useState } from 'react';
import logo from '/images/logo.png';   // put your logo in frontend/public/images/logo.png

const LOGO_STYLE = {
  width     : 'clamp(240px,28vw,360px)',
  height    : 'auto',
  display   : 'block',
  cursor    : 'none',
};

export default function SplashPage({ onEnter }) {
  const canvasRef       = useRef(null);
  const [entered, setEntered] = useState(false);
  const [curtain, setCurtain] = useState(false); // curtains closing
  const [curtainOpen, setCurtainOpen] = useState(false); // curtains opening
  const [curtainLogo, setCurtainLogo] = useState(false);  // logo on curtain

  // ── Canvas particle animation ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], raf;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x     = Math.random() * W;
        this.y     = initial ? Math.random() * H : H + 20;
        this.r     = Math.random() * 2.5 + 0.5;
        this.speed = Math.random() * 0.5 + 0.2;
        this.drift = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.35 + 0.08;
      }
      update() {
        this.y -= this.speed;
        this.x += this.drift;
        if (this.y < -10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(43,45,181,${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 55; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ── Ripple on click ──
  const addRipple = (e) => {
    const el   = document.createElement('div');
    const size = 120;
    Object.assign(el.style, {
      position    : 'absolute',
      width       : size + 'px',
      height      : size + 'px',
      left        : (e.clientX - size / 2) + 'px',
      top         : (e.clientY - size / 2) + 'px',
      borderRadius: '50%',
      background  : 'radial-gradient(circle,rgba(43,45,181,.18) 0%,transparent 70%)',
      transform   : 'scale(0)',
      animation   : 'ripple .8s ease-out forwards',
      pointerEvents: 'none',
    });
    document.getElementById('splash-wrap')?.appendChild(el);
    setTimeout(() => el.remove(), 900);
  };

  // ── Enter website transition ──
  const handleEnter = (e) => {
    if (entered) return;
    setEntered(true);
    addRipple(e);

    setTimeout(() => setCurtain(true),       0);     // curtains close
    setTimeout(() => setCurtainLogo(true),   250);   // logo on curtain
    setTimeout(() => setCurtainLogo(false),  750);   // logo fades
    setTimeout(() => {
      setCurtain(false);
      setCurtainOpen(true);                           // curtains open
    }, 1050);
    setTimeout(() => onEnter(), 1200);               // reveal website
  };

  const curtainBase = {
    position  : 'fixed', top: 0, bottom: 0,
    width     : '50%', zIndex: 9500,
    background: '#1A1660',
    transition: 'transform .9s cubic-bezier(.76,0,.24,1)',
  };

  return (
    <>
      {/* ── Curtain panels ── */}
      <div style={{
        ...curtainBase, left: 0,
        transform: curtain ? 'translateX(0)' : curtainOpen ? 'translateX(-100%)' : 'translateX(-100%)',
      }} />
      <div style={{
        ...curtainBase, right: 0,
        transform: curtain ? 'translateX(0)' : curtainOpen ? 'translateX(100%)' : 'translateX(100%)',
      }} />

      {/* ── Logo on curtain ── */}
      <img
        src={logo}
        alt="Jyothi Collections"
        style={{
          position  : 'fixed', top: '50%', left: '50%',
          transform : curtainLogo
            ? 'translate(-50%,-50%) scale(1)'
            : 'translate(-50%,-50%) scale(.9)',
          zIndex    : 9600,
          width     : 'clamp(180px,20vw,240px)',
          opacity   : curtainLogo ? 1 : 0,
          transition: 'opacity .3s .2s, transform .5s .2s cubic-bezier(.16,1,.3,1)',
          filter    : 'brightness(0) invert(1)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Splash screen ── */}
      <div
        id="splash-wrap"
        onClick={handleEnter}
        style={{
          position        : 'fixed', inset: 0, zIndex: 9000,
          background      : '#F7F5FF',
          display         : 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection   : 'column',
          cursor          : 'none',
          overflow        : 'hidden',
          opacity         : entered ? 0 : 1,
          transition      : entered ? 'opacity .4s .9s ease' : 'none',
          pointerEvents   : entered ? 'none' : 'all',
        }}
      >
        {/* Canvas particles */}
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, opacity: .4, pointerEvents: 'none' }}
        />

        {/* Pulse rings */}
        {[0, 0.6, 1.2].map((delay, i) => (
          <div key={i} style={{
            position     : 'absolute', top: '50%', left: '50%',
            border       : '1.5px solid rgba(43,45,181,.14)',
            borderRadius : '50%',
            animation    : `ringExpand 2.4s ${delay}s ease-out infinite`,
            pointerEvents: 'none',
          }} />
        ))}

        {/* Corner brackets */}
        {[
          { top: 28, left: 28, borderTop:'1.5px solid #2B2DB5', borderLeft:'1.5px solid #2B2DB5' },
          { top: 28, right:28, borderTop:'1.5px solid #2B2DB5', borderRight:'1.5px solid #2B2DB5'},
          { bottom:28,left:28, borderBottom:'1.5px solid #2B2DB5',borderLeft:'1.5px solid #2B2DB5'},
          { bottom:28,right:28,borderBottom:'1.5px solid #2B2DB5',borderRight:'1.5px solid #2B2DB5'},
        ].map((s, i) => (
          <div key={i} style={{ position:'absolute', width:36, height:36, opacity:.25, ...s }} />
        ))}

        {/* Year label */}
        <div style={{
          position   : 'absolute', top: 32, right: 32,
          fontFamily : "'Cormorant Garamond',serif",
          fontSize   : 13, fontWeight: 300, letterSpacing: '.18em',
          color      : '#8B89C0',
          animation  : 'fadeUpIn .6s 1.2s ease both',
        }}>2025</div>

        {/* Logo glow + image */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Glow */}
          <div style={{
            position   : 'absolute', top: '50%', left: '50%',
            width      : 320, height: 320,
            transform  : 'translate(-50%,-50%)',
            borderRadius:'50%',
            background : 'radial-gradient(circle,rgba(43,45,181,.07) 0%,transparent 65%)',
            animation  : 'glowPulse 3s ease-in-out infinite',
            pointerEvents: 'none',
          }} />

          <img
            src={logo}
            alt="Jyothi Collections"
            style={{
              ...LOGO_STYLE,
              opacity   : 1,
              filter    : 'drop-shadow(0 8px 32px rgba(43,45,181,.15))',
              animation : 'logoReveal 1.2s .4s cubic-bezier(.16,1,.3,1) both',
              transition: 'transform .3s, filter .3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.04)';
              e.currentTarget.style.filter    = 'drop-shadow(0 12px 40px rgba(43,45,181,.28))';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.filter    = 'drop-shadow(0 8px 32px rgba(43,45,181,.15))';
            }}
          />

          {/* Tagline */}
          <div style={{
            fontFamily   : "'DM Sans',sans-serif",
            fontSize     : 'clamp(11px,1.2vw,13px)',
            letterSpacing: '.32em', textTransform: 'lowercase',
            color        : '#8B89C0', marginTop: 10,
            animation    : 'fadeUpIn .8s 1s ease both',
          }}>
            explore the fashion world
          </div>
        </div>

        {/* Click hint */}
        <div style={{
          position       : 'absolute',
          bottom         : 'clamp(36px,5vh,60px)',
          left           : '50%', transform: 'translateX(-50%)',
          display        : 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          animation      : 'fadeUpIn .8s 1.6s ease both',
        }}>
          <div style={{
            width     : 1, height: 36,
            background: 'linear-gradient(to bottom,#2B2DB5,transparent)',
            animation : 'lineGrow 1.8s 1.8s ease-out infinite',
            transformOrigin: 'top',
          }} />
          <div style={{
            fontFamily  : "'DM Sans',sans-serif",
            fontSize    : 11, letterSpacing: '.22em', textTransform: 'uppercase',
            color       : '#8B89C0',
            animation   : 'blink 2.2s 2s ease-in-out infinite',
          }}>
            click anywhere to enter
          </div>
        </div>
      </div>

      {/* ── Keyframe injections ── */}
      <style>{`
        @keyframes logoReveal {
          0%  { opacity:0; transform:scale(.85) translateY(20px) }
          60% { opacity:1; transform:scale(1.03) translateY(-4px) }
          100%{ opacity:1; transform:scale(1) translateY(0) }
        }
        @keyframes fadeUpIn {
          from{ opacity:0; transform:translateY(10px) }
          to  { opacity:1; transform:translateY(0) }
        }
        @keyframes glowPulse {
          0%,100%{ transform:translate(-50%,-50%) scale(1);   opacity:.6 }
          50%    { transform:translate(-50%,-50%) scale(1.15); opacity:1  }
        }
        @keyframes ringExpand {
          0%  { width:180px;height:180px;opacity:.7; margin-top:-90px; margin-left:-90px }
          100%{ width:600px;height:600px;opacity:0; margin-top:-300px;margin-left:-300px }
        }
        @keyframes lineGrow {
          0%  { transform:scaleY(0);opacity:0 }
          50% { transform:scaleY(1);opacity:1 }
          100%{ transform:scaleY(1);opacity:0 }
        }
        @keyframes blink {
          0%,100%{ opacity:.4 } 50%{ opacity:1 }
        }
        @keyframes ripple {
          0%  { transform:scale(0);opacity:1 }
          100%{ transform:scale(8);opacity:0 }
        }
      `}</style>
    </>
  );
}
