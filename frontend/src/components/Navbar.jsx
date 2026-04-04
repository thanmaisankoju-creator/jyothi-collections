// frontend/src/components/Navbar.jsx
import { useEffect, useState } from 'react';
import logo from '/images/logo.png';
import { useUIStore, useCartStore, useThemeStore } from '../utils/store';

const CATS = ['All','Dresses','Tops','Bottoms','Outerwear','Accessories'];

export default function Navbar({ onFilter }) {
  const [scrolled, setScrolled] = useState(false);
  const { openCart, openSearch, openAdminLock } = useUIStore();
  const totalQty = useCartStore(s => s.totalQty());
  const { theme }  = useThemeStore();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Logo filter per theme
  const logoFilter = {
    classic : 'none',
    midnight: 'brightness(0) invert(1)',
    rose    : 'hue-rotate(200deg) saturate(1.4) brightness(.85)',
    forest  : 'hue-rotate(140deg) saturate(1.2) brightness(.8)',
    obsidian: 'sepia(1) saturate(3) hue-rotate(10deg) brightness(.85)',
  }[theme] || 'none';

  return (
    <nav style={{
      position     : 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding      : '0 48px', height: 72,
      display      : 'flex', alignItems: 'center', justifyContent: 'space-between',
      background   : 'var(--nav-bg)', backdropFilter: 'blur(16px)',
      borderBottom : scrolled ? '1px solid var(--border)' : '1px solid transparent',
      boxShadow    : scrolled ? 'var(--shadow)' : 'none',
      transition   : 'border-color .3s, box-shadow .3s, background .5s',
    }}>
      {/* Logo — clickable, opens store top */}
      <a
        href="/"
        onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        style={{ display: 'flex', alignItems: 'center', height: 52, cursor: 'none' }}
      >
        <img
          src={logo}
          alt="Jyothi Collections"
          style={{ height: 46, width: 'auto', filter: logoFilter, transition: 'filter .5s' }}
        />
      </a>

      {/* Nav links */}
      <ul style={{ display: 'flex', gap: 32, listStyle: 'none', alignItems: 'center' }}>
        {CATS.map(cat => (
          <li key={cat}>
            <a
              href="#products"
              onClick={e => { e.preventDefault(); onFilter?.(cat.toLowerCase()); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}
              style={{
                fontSize: 11, fontWeight: 500, letterSpacing: '.1em',
                textTransform: 'uppercase', color: 'var(--warm-gray)',
                textDecoration: 'none', cursor: 'none',
                transition: 'color .25s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--black)'}
              onMouseLeave={e => e.target.style.color = 'var(--warm-gray)'}
            >
              {cat}
            </a>
          </li>
        ))}
      </ul>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {/* Search */}
        <NavBtn onClick={openSearch} title="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </NavBtn>

        {/* Admin lock */}
        <NavBtn onClick={openAdminLock} title="Admin">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        </NavBtn>

        {/* Cart */}
        <NavBtn onClick={openCart} title="Cart" style={{ position: 'relative' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {totalQty > 0 && (
            <span style={{
              position: 'absolute', top: 2, right: 2,
              width: 16, height: 16, background: 'var(--accent)', color: 'var(--white)',
              borderRadius: '50%', fontSize: 9, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{totalQty}</span>
          )}
        </NavBtn>
      </div>
    </nav>
  );
}

function NavBtn({ children, style, ...props }) {
  return (
    <button
      {...props}
      style={{
        background: 'none', border: 'none', color: 'var(--black)',
        cursor: 'none', padding: '6px 8px', borderRadius: 4,
        display: 'flex', alignItems: 'center', transition: 'background .2s',
        ...style,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(128,128,128,.08)'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      {children}
    </button>
  );
}
