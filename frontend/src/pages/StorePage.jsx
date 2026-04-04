// frontend/src/pages/StorePage.jsx
import { useState, useEffect } from 'react';
import Navbar       from '../components/Navbar';
import Hero         from '../components/Hero';
import Marquee      from '../components/Marquee';
import Categories   from '../components/Categories';
import ProductGrid  from '../components/ProductGrid';
import FeaturedBanner from '../components/FeaturedBanner';
import Testimonials from '../components/Testimonials';
import Newsletter   from '../components/Newsletter';
import Footer       from '../components/Footer';
import CartDrawer   from '../components/CartDrawer';
import SearchOverlay from '../components/SearchOverlay';
import AdminLock    from '../components/AdminLock';
import AdminPanel   from '../components/AdminPanel';
import ProductModal from '../components/ProductModal';
import OrderModal   from '../components/OrderModal';
import ThemeBar     from '../components/ThemeBar';
import Toast        from '../components/Toast';
import { useUIStore } from '../utils/store';
import { fetchProducts, fetchCategories } from '../utils/api';

export default function StorePage() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter,     setFilter]     = useState('all');
  const [loading,    setLoading]    = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast,      setToast]      = useState({ show: false, msg: '' });

  const { cartOpen, searchOpen, adminLockOpen, adminPanelOpen } = useUIStore();

  // ── Load products ──
  const loadProducts = async (cat = 'all') => {
    setLoading(true);
    try {
      const params = cat !== 'all' ? { category: cat } : {};
      const res    = await fetchProducts(params);
      setProducts(res.data.products);
    } catch {
      // Fallback to mock data if backend not running
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  // ── Load categories ──
  const loadCategories = async () => {
    try {
      const res = await fetchCategories();
      setCategories(res.data.categories);
    } catch {
      setCategories(MOCK_CATEGORIES);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const handleFilter = (cat) => {
    setFilter(cat);
    loadProducts(cat);
  };

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 2800);
  };

  const handleProductAdded = () => {
    loadProducts(filter);
    loadCategories();
  };

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <ThemeBar />
      <Navbar />
      <Hero />
      <Marquee />
      <Categories categories={categories} onFilter={handleFilter} />
      <ProductGrid
        products={products}
        filter={filter}
        onFilter={handleFilter}
        loading={loading}
        onProductClick={setSelectedProduct}
        onAddToCart={showToast}
      />
      <FeaturedBanner />
      <Testimonials />
      <Newsletter />
      <Footer />

      {/* Overlays */}
      {cartOpen        && <CartDrawer onToast={showToast} />}
      {searchOpen      && <SearchOverlay products={products} onProductClick={setSelectedProduct} />}
      {adminLockOpen   && <AdminLock />}
      {adminPanelOpen  && <AdminPanel onProductAdded={handleProductAdded} onToast={showToast} />}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={showToast}
          onReviewPosted={() => loadProducts(filter)}
        />
      )}
      <OrderModal onToast={showToast} />
      <Toast show={toast.show} msg={toast.msg} />

      {/* Back to top */}
      <BackToTop />
    </div>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed', bottom: 36, right: 52,
        width: 48, height: 48,
        background: 'var(--black)', color: 'var(--white)',
        border: 'none', borderRadius: '50%', cursor: 'none',
        fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, transition: 'background .2s',
      }}
    >↑</button>
  );
}

// ── Mock data (used when backend is offline) ─────────────
const MOCK_PRODUCTS = [
  { id:'1', name:'Silk Wrap Dress',     category:'Dresses',     price:3499, originalPrice:5999, emoji:'👗', badge:'sale', sizes:['XS','S','M','L','XL'], reviews:[], images:[] },
  { id:'2', name:'Linen Blazer',        category:'Outerwear',   price:4999, originalPrice:null,  emoji:'🧥', badge:'new',  sizes:['S','M','L','XL'],    reviews:[], images:[] },
  { id:'3', name:'Ribbed Knit Top',     category:'Tops',        price:1299, originalPrice:null,  emoji:'👚', badge:'hot',  sizes:['XS','S','M','L'],    reviews:[], images:[] },
  { id:'4', name:'Wide-Leg Trousers',   category:'Bottoms',     price:2799, originalPrice:3499,  emoji:'👖', badge:'sale', sizes:['XS','S','M','L','XL'], reviews:[], images:[] },
  { id:'5', name:'Cashmere Scarf',      category:'Accessories', price:2199, originalPrice:null,  emoji:'🧣', badge:'new',  sizes:['One Size'],           reviews:[], images:[] },
  { id:'6', name:'Midi Slip Dress',     category:'Dresses',     price:2599, originalPrice:null,  emoji:'👗', badge:'',    sizes:['XS','S','M','L'],    reviews:[], images:[] },
  { id:'7', name:'Cropped Linen Shirt', category:'Tops',        price:1799, originalPrice:2199,  emoji:'👕', badge:'sale', sizes:['S','M','L','XL'],    reviews:[], images:[] },
  { id:'8', name:'Pleated Midi Skirt',  category:'Bottoms',     price:2199, originalPrice:null,  emoji:'👙', badge:'',    sizes:['XS','S','M','L','XL'], reviews:[], images:[] },
];
const MOCK_CATEGORIES = [
  { name:'Dresses', count:3 }, { name:'Tops', count:2 },
  { name:'Bottoms', count:2 }, { name:'Outerwear', count:1 }, { name:'Accessories', count:1 },
];
