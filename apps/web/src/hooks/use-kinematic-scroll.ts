'use client';

import { useState, useEffect, useRef } from 'react';

const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

export const useKinematicScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [velocity, setVelocity] = useState(0);
  
  const data = useRef({
    current: 0,
    target: 0,
    ease: 0.07,
    velocity: 0
  });

  useEffect(() => {
    const setTarget = () => { data.current.target = window.scrollY; };
    window.addEventListener('scroll', setTarget, { passive: true });

    const setHeight = () => {
      if (containerRef.current) {
        document.body.style.height = `${containerRef.current.getBoundingClientRect().height}px`;
      }
    };
    window.addEventListener('resize', setHeight);
    
    setTimeout(setHeight, 500);

    let rafId: number;
    const update = () => {
      const d = data.current;
      d.current = lerp(d.current, d.target, d.ease);
      d.velocity = d.target - d.current;
      
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(0, -${d.current}px, 0)`;
      }
      
      setVelocity(d.velocity);
      rafId = requestAnimationFrame(update);
    };
    update();

    return () => {
      window.removeEventListener('scroll', setTarget);
      window.removeEventListener('resize', setHeight);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return { containerRef, velocity };
};
