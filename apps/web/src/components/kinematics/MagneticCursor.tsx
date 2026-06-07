'use client';

import React, { useEffect, useRef } from 'react';

const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

export const MagneticCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 }); // Initialize at 0, updated on mount
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    pos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let rafId: number;
    const update = () => {
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.15);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.15);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(update);
    };
    update();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-3 h-3 bg-ivory rounded-full mix-blend-difference pointer-events-none z-50 transition-transform duration-300 ease-out"
    />
  );
};
