// frontend/src/components/Footer.jsx
import logo from '/images/logo.png';

const LINKS = {
  Shop   : ['Dresses','Tops','Bottoms','Outerwear','Accessories'],
  Help   : ['Size Guide','Returns','Shipping Info','Track Order','Contact Us'],
  Company: ['About Us','Sustainability','Careers','Press','Privacy Policy'],
};

export default function Footer() {
  return (
    <footer style={{ background:'var(--black)', color:'rgba(255,255,255,.45)', padding:'56px 44px 28px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:44, marginBottom:44 }}>

        {/* Brand */}
        <div>
          <img src={logo} alt="Jyothi Collections"
            style={{ height:38, width:'auto', filter:'brightness(0) invert(1)', opacity:.65, marginBottom:14, display:'block' }} />
          <p style={{ fontSize:13, lineHeight:1.7, maxWidth:240 }}>
            Jyothi Collections — your destination for premium fashion. Explore the fashion world with us.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([col, links]) => (
          <div key={col}>
            <h4 style={{ fontSize:10, letterSpacing:'.18em', textTransform:'uppercase', color:'#fff', marginBottom:16, fontWeight:500 }}>{col}</h4>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:9 }}>
              {links.map(l => (
                <li key={l}>
                  <a href="#" onClick={e=>e.preventDefault()}
                    style={{ fontSize:13, color:'rgba(255,255,255,.4)', textDecoration:'none', cursor:'none', transition:'color .2s' }}
                    onMouseEnter={e=>e.target.style.color='#fff'}
                    onMouseLeave={e=>e.target.style.color='rgba(255,255,255,.4)'}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ paddingTop:24, borderTop:'1px solid rgba(255,255,255,.06)', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12 }}>
        <span>© 2025 Jyothi Collections. All rights reserved.</span>
        <span>Made with care in India 🇮🇳</span>
      </div>
    </footer>
  );
}
