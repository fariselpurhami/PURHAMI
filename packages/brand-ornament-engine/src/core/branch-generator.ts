// packages/brand-ornament-engine/src/core/branch-generator.ts
import { mulberry32 } from './math';

export interface Point { x: number; y: number; }
export interface BranchParams {
  startX: number;
  startY: number;
  angle: number;
  length: number;
  depth: number;
  maxDepth: number;
  width: number;
  height: number;
  seed: number;
}

export interface SVGPathData {
  d: string;
  strokeWidth: number;
  opacity: number;
}

function createBezier(p1: Point, p2: Point, controlOffset: number, rand: () => number): string {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  
  const cp1x = p1.x + (dx * 0.3) + (rand() - 0.5) * controlOffset;
  const cp1y = p1.y + (dy * 0.1) + (rand() - 0.5) * controlOffset;
  
  const cp2x = p2.x - (dx * 0.3) + (rand() - 0.5) * controlOffset;
  const cp2y = p2.y - (dy * 0.1) + (rand() - 0.5) * controlOffset;

  return `M ${p1.x},${p1.y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
}

export function generateVeinSystem(params: BranchParams, prng: () => number, paths: SVGPathData[] = []): SVGPathData[] {
  if (params.depth > params.maxDepth) return paths;

  const actualLength = params.length * (0.8 + prng() * 0.4);
  const endX = params.startX + Math.cos(params.angle) * actualLength;
  const endY = params.startY + Math.sin(params.angle) * actualLength;

  if (endX < -200 || endX > params.width + 200 || endY < -200 || endY > params.height + 200) {
     return paths;
  }

  const p1 = { x: params.startX, y: params.startY };
  const p2 = { x: endX, y: endY };
  
  const strokeWidth = Math.max(0.5, 3 - params.depth * 0.8);
  const opacity = Math.max(0.05, 0.3 - params.depth * 0.05);

  paths.push({
    d: createBezier(p1, p2, actualLength * 0.4, prng),
    strokeWidth,
    opacity
  });

  const branchProb = params.depth === 0 ? 1 : 0.6 / params.depth;
  
  if (prng() < branchProb) {
    const angleSpread = 0.3 + prng() * 0.4;
    
    generateVeinSystem({
      ...params,
      startX: endX,
      startY: endY,
      angle: params.angle + (prng() - 0.5) * 0.2,
      length: params.length * 0.9,
      depth: params.depth + 1
    }, prng, paths);

    if (prng() > 0.3) {
       generateVeinSystem({
        ...params,
        startX: endX,
        startY: endY,
        angle: params.angle + (prng() > 0.5 ? angleSpread : -angleSpread),
        length: params.length * 0.7,
        depth: params.depth + 1
      }, prng, paths);
    }
  }

  return paths;
}
