export interface OrnamentConfig {
  density: 'sparse' | 'medium' | 'dense';
  color: string;
  edgeAnchor: 'left' | 'right' | 'both';
  respectReducedMotion?: boolean;
  opacity?: number;
}

export interface OrnamentLayerProps extends Partial<OrnamentConfig> {
  seed?: number;
  className?: string;
  color?: string;
}

export interface PathData {
  d: string;
  length: number;
}
