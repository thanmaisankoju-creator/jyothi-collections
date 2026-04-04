// frontend/src/components/ThemeBar.jsx
import { useThemeStore } from '../utils/store';

const THEMES = [
  { id:'classic',  label:'Classic',  swatch:'linear-gradient(135deg,#F7F5FF,#2B2DB5)' },
  { id:'midnight', label:'Midnight', swatch:'linear-gradient(135deg,#111118,#9B7FD4)' },
  { id:'rose',     label:'Rose',     swatch:'linear-gradient(135deg,#FFF5F5,#E8718A)' },
  { id:'forest',   label:'Forest',   swatch:'linear-gradient(135deg,#F2F5F0,#5D8A5E)' },
  { id:'obsidian', label:'Obsidian', swatch:'linear-gradient(135deg,#0A0A0A,#D4AF70)' },
];

export default function ThemeBar() {
  const { theme, setTheme } = useThemeStore();
  return (
    <div style={{
      position:'fixed', top:80, right:0, zIndex:800,
      padding:'9px 7px 5px', background:'var(--white)',
      border:'var(--card-border)', borderRight:'none',
      borderRadius:'9px 0 0 9px', boxShadow:'var(--shadow)',
      display:'flex', flexDirection:'column', gap:6, alignItems:'center',
    }}>
      {THEMES.map(t => (
        <div
          key={t.id}
          title={t.label}
          data-cursor="pointer"
          onClick={() => setTheme(t.id)}
          style={{
            width:19, height:19, borderRadius:'50%',
            background:t.swatch, cursor:'none',
            border: theme===t.id ? '2.5px solid var(--black)' : '2.5px solid transparent',
            transform: theme===t.id ? 'scale(1.25)' : 'scale(1)',
            transition:'transform .2s, border-color .2s',
          }}
        />
      ))}
      <div style={{ fontSize:8, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--warm-gray)', marginTop:2 }}>Theme</div>
    </div>
  );
}
