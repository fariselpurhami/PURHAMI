// packages/brand-ornament-engine/src/types/index.ts

export interface OrnamentConfig {
  density: 'sparse' | 'medium' | 'dense';
  color: string;
  edgeAnchor: 'left' | 'right' | 'both';
  respectReducedMotion: boolean;
  opacity?: number;
}

export interface PathData {
  d: string;
  length: number;
}
