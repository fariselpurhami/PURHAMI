// packages/brand-ornament-engine/src/react/OrnamentLayer.tsx
'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { generateVeinSystem, SVGPathData } from '../core/branch-generator';
import { mulberry32 } from '../core/math';

interface OrnamentLayerProps {
  seed?: number;
  className?: string;
  color?: string;
}

export function OrnamentLayer({ seed = 42, className = '', color = 'currentColor' }: OrnamentLayerProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    handleResize();
    
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '200px' } 
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', debouncedResize);
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  const paths = useMemo(() => {
    if (dimensions.width === 0) return [];
    
    const prng = mulberry32(seed);
    const { width, height } = dimensions;
    
    const allPaths: SVGPathData[] = [];
    
    const origins = [
      { x: -50, y: height * 0.2, angle: 0.2 },
      { x: width + 50, y: height * 0.8, angle: Math.PI + 0.2 },
    ];

    origins.forEach(origin => {
      generateVeinSystem({
        startX: origin.x,
        startY: origin.y,
        angle: origin.angle,
        length: Math.min(width, height) * 0.4,
        depth: 0,
        maxDepth: 4,
        width,
        height,
        seed
      }, prng, allPaths);
    });

    return allPaths;
  }, [dimensions, seed]);

  if (dimensions.width === 0) return <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true" />;

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      {isVisible && (
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} 
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {paths.map((p, i) => (
            <path
              key={i}
              d={p.d}
              fill="none"
              stroke={color}
              strokeWidth={p.strokeWidth}
              strokeOpacity={p.opacity}
              className="motion-safe:animate-draw-vein"
              style={{
                 strokeDasharray: 2000,
                 strokeDashoffset: 2000,
                 animationDelay: `${i * 0.05}s`,
                 animationFillMode: 'forwards'
              }}
            />
          ))}
        </svg>
      )}
    </div>
  );
}
