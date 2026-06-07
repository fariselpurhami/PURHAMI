'use client';

import React, { useMemo } from 'react';

interface Props {
  isVisible: boolean;
  variant?: 'hero' | 'nav';
}

export const BrandOrnamentController = ({ isVisible, variant = 'hero' }: Props) => {
  const paths = useMemo(() => {
    if (variant === 'hero') {
      return [
        "M -100,500 C 200,450 300,200 600,300 C 900,400 1100,100 1500,200",
        "M 0,800 C 400,700 450,500 800,600 C 1200,700 1300,400 1600,500",
        "M 200,1000 C 300,800 600,900 900,700 C 1100,500 1400,800 1800,600"
      ];
    }
    return [
      "M -100,100 C 200,150 400,50 600,100",
      "M 0,200 C 300,250 500,150 800,200"
    ];
  }, [variant]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      <svg 
        className="w-full h-full opacity-20" 
        viewBox="0 0 1440 1024" 
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#3B0918"
            strokeWidth={i === 0 ? "1.5" : "0.75"}
            className="transition-all duration-[2000ms] ease-out origin-left"
            style={{
              strokeDasharray: 3000,
              strokeDashoffset: isVisible ? 0 : 3000,
              transitionDelay: `${i * 300}ms`,
              filter: i === 0 ? 'url(#glow)' : 'none'
            }}
          />
        ))}
      </svg>
    </div>
  );
};
