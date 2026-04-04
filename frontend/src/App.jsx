// frontend/src/App.jsx
import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SplashPage  from './pages/SplashPage';
import StorePage   from './pages/StorePage';
import AdminPage   from './pages/AdminPage';
import Cursor      from './components/Cursor';
import { useThemeStore } from './utils/store';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const { theme }                   = useThemeStore();

  // Apply theme on change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <Cursor />

      {/* Splash intro — shown until user clicks */}
      {!splashDone && (
        <SplashPage onEnter={() => setSplashDone(true)} />
      )}

      {/* Main website — fades in after splash */}
      <div
        style={{
          opacity   : splashDone ? 1 : 0,
          transition: 'opacity .6s ease',
          pointerEvents: splashDone ? 'all' : 'none',
        }}
      >
        <Routes>
          <Route path="/"      element={<StorePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </>
  );
}
