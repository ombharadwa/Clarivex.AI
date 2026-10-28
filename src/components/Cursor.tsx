import React, { useEffect, useRef } from 'react';

export const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = -100;
    let my = -100;
    let tx = -100;
    let ty = -100;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mx - 6}px, ${my - 6}px, 0)`;
      }
    };

    let animationId: number;
    const animateTrail = () => {
      tx += (mx - tx) * 0.15;
      ty += (my - ty) * 0.15;
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${tx - 16}px, ${ty - 16}px, 0)`;
      }
      animationId = requestAnimationFrame(animateTrail);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    animationId = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-[#7C5CFF] pointer-events-none z-50 mix-blend-screen hidden md:block"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#7C5CFF]/40 pointer-events-none z-40 mix-blend-screen hidden md:block"
        style={{ willChange: 'transform' }}
      />
    </>
  );
};
