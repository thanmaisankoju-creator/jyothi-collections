// frontend/src/components/Testimonials.jsx
const REVIEWS = [
  { stars:'★★★★★', text:"The quality is unlike anything I've found at this price point. Every piece feels handcrafted.", avatar:'👩', name:'Priya Sharma', loc:'Mumbai' },
  { stars:'★★★★★', text:"Jyothi Collections has completely transformed my wardrobe. Timeless, elegant and versatile.", avatar:'👩‍🦱', name:'Ananya Reddy', loc:'Hyderabad' },
  { stars:'★★★★☆', text:"Fast shipping, beautiful packaging, and pieces look even better in person!", avatar:'🧕', name:'Fatima Sheikh', loc:'Chennai' },
];

export default function Testimonials() {
  return (
    <section style={{padding:'2rem', textAlign:'center'}}>
      <h2>What Our Customers Say</h2>
      <div style={{display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap'}}>
        {REVIEWS.map((r, i) => (
          <div key={i} style={{border:'1px solid #ddd', borderRadius:'8px', padding:'1rem', maxWidth:'280px'}}>
            <div>{r.stars}</div>
            <p>{r.text}</p>
            <div>{r.avatar} <strong>{r.name}</strong> — {r.loc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}