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
        className="pointer-events-none fixed left-0 top-0 z-50 hidden h-3 w-3 rounded-full mix-blend-screen md:block"
        style={{ willChange: 'transform', background: 'var(--accent)' }}
      />
      <div
        ref={trailRef}
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-8 w-8 rounded-full border mix-blend-screen md:block"
        style={{ willChange: 'transform', borderColor: 'var(--line-strong)' }}
      />
    </>
  );
};
