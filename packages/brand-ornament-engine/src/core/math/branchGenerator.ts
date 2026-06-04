// packages/brand-ornament-engine/src/core/math/branchGenerator.ts
import type { PathData } from '../types';

export function generateVeinPaths(
  width: number,
  height: number,
  anchor: 'left' | 'right',
  density: 'sparse' | 'medium' | 'dense'
): PathData[] {
  const paths: PathData[] = [];
  const branchCount = density === 'sparse' ? 3 : density === 'medium' ? 6 : 10;
  
  const startX = anchor === 'left' ? 0 : width;
  const direction = anchor === 'left' ? 1 : -1;
  const maxReach = width * 0.25; // Strictly center-safe
  
  for (let i = 0; i < branchCount; i++) {
    const startY = (height / branchCount) * i + (height / branchCount) * 0.5;
    const cp1x = startX + (maxReach * 0.3 * direction);
    const cp1y = startY - (height * 0.1);
    const cp2x = startX + (maxReach * 0.7 * direction);
    const cp2y = startY + (height * 0.1);
    const endX = startX + (maxReach * direction);
    const endY = startY + (i % 2 === 0 ? height * 0.05 : -height * 0.05);

    const d = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
    
    // Approximate length for stroke-dasharray (deterministic math fallback)
    const dx = endX - startX;
    const dy = endY - startY;
    const approxLength = Math.sqrt(dx * dx + dy * dy) * 1.2;

    paths.push({ d, length: approxLength });
  }

  return paths;
}
