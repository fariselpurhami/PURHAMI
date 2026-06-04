// apps/web/src/components/layout/CinematicReveal.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

interface CinematicRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down';
  className?: string;
}

export function CinematicReveal({ children, delay = 0, direction = 'up', className = '' }: CinematicRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsRevealed(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [delay]);

  const transformClass = isRevealed 
    ? 'translate-y-0 opacity-100' 
    : direction === 'up' ? 'translate-y-8 opacity-0' : '-translate-y-8 opacity-0';

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-[1200ms] ease-editorial ${transformClass} ${className}`}
    >
      <div className={`transition-all duration-[1200ms] ease-editorial ${isRevealed ? 'reveal-mask' : 'reveal-mask-hidden'}`}>
        {children}
      </div>
    </div>
  );
}
