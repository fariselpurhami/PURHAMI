// packages/brand-ornament-engine/src/react/OrnamentLayer.tsx
'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { generateVeinSystem, SVGPathData } from '../core/branch-generator';
import { mulberry32 } from '../core/math';
import { OrnamentLayerProps } from '../types'; // استيراد الواجهة المحدثة

export function OrnamentLayer({ 
  seed = 42, 
  className = '', 
  color = 'currentColor',
  density,      // الخاصية الجديدة
  opacity = 0.5, // الخاصية الجديدة
  edgeAnchor    // الخاصية الجديدة
}: OrnamentLayerProps) {
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
    
    if (containerRef.current) observer.observe(containerRef.current);

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
    
    // تحويل الـ density إلى منطق برمجيا للـ generator
    const depthLimit = density === 'dense' ? 5 : density === 'sparse' ? 3 : 4;
    
    const allPaths: SVGPathData[] = [];
    
    // منطق الـ edgeAnchor
    const origins = [];
    if (edgeAnchor === 'left' || edgeAnchor === 'both') origins.push({ x: -50, y: height * 0.2, angle: 0.2 });
    if (edgeAnchor === 'right' || edgeAnchor === 'both') origins.push({ x: width + 50, y: height * 0.8, angle: Math.PI + 0.2 });

    origins.forEach(origin => {
      generateVeinSystem({
        startX: origin.x,
        startY: origin.y,
        angle: origin.angle,
        length: Math.min(width, height) * 0.4,
        depth: 0,
        maxDepth: depthLimit,
        width,
        height,
        seed
      }, prng, allPaths);
    });

    return allPaths;
  }, [dimensions, seed, density, edgeAnchor]);

  if (dimensions.width === 0) return <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true" />;

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      {isVisible && (
        <svg width="100%" height="100%" viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none">
          {paths.map((p, i) => (
            <path
              key={i}
              d={p.d}
              fill="none"
              stroke={color}
              strokeWidth={p.strokeWidth}
              strokeOpacity={opacity} // استخدام خاصية opacity الممررة
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
