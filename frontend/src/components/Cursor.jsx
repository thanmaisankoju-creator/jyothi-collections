// frontend/src/components/Cursor.jsx
import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: 0, y: 0, rx: 0, ry: 0 });
  const rafRef  = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px';
        dotRef.current.style.top  = e.clientY + 'px';
      }
    };

    const onOver = (e) => {
      const big = e.target.closest('a,button,[data-cursor="pointer"]');
      if (dotRef.current) {
        dotRef.current.style.width  = big ? '5px' : '10px';
        dotRef.current.style.height = big ? '5px' : '10px';
      }
      if (ringRef.current) {
        ringRef.current.style.width  = big ? '54px' : '36px';
        ringRef.current.style.height = big ? '54px' : '36px';
      }
    };

    const animate = () => {
      pos.current.rx += (pos.current.x - pos.current.rx) * 0.12;
      pos.current.ry += (pos.current.y - pos.current.ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = pos.current.rx + 'px';
        ringRef.current.style.top  = pos.current.ry + 'px';
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div id="cursor"      ref={dotRef}  />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}
