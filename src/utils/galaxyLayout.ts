import { Memory, CategoryType } from '../types/Memory';

// Each category gets a base angle in the spiral (evenly distributed)
const CATEGORY_ANGLES: Record<CategoryType, number> = {
  childhood: 0,
  family: Math.PI * 0.25,
  friendship: Math.PI * 0.5,
  romance: Math.PI * 0.75,
  career: Math.PI,
  travel: Math.PI * 1.25,
  milestone: Math.PI * 1.5,
  everyday: Math.PI * 1.75,
};

export interface StarPosition {
  memory: Memory;
  x: number;
  y: number;
  size: number;
}

/**
 * Maps memories onto a spiral galaxy layout.
 * - Radius = how old the memory is (older = farther from center)
 * - Angle = category cluster + small random offset
 * - Size = importance level
 */
const BIRTHDAY_MEMORY_ID = 'birthday-star';

export function calculateStarPositions(
  memories: Memory[],
  centerX: number,
  centerY: number,
  maxRadius: number
): StarPosition[] {
  if (memories.length === 0) return [];

  // Separate birthday star — it gets a fixed position at the galaxy center
  const birthdayStar = memories.find((m) => m.id === BIRTHDAY_MEMORY_ID);
  const regularMemories = memories.filter((m) => m.id !== BIRTHDAY_MEMORY_ID);

  const results: StarPosition[] = [];

  // Place birthday star at the very center
  if (birthdayStar) {
    results.push({
      memory: birthdayStar,
      x: centerX,
      y: centerY,
      size: 2 + birthdayStar.importance * 1.5,
    });
  }

  if (regularMemories.length === 0) return results;

  // Sort by date to determine time range (excluding birthday)
  const sorted = [...regularMemories].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  const oldest = sorted[0].date.getTime();
  const newest = sorted[sorted.length - 1].date.getTime();
  const timeRange = newest - oldest || 1; // avoid division by zero

  for (const memory of regularMemories) {
    // Normalize time: 0 (oldest) to 1 (newest)
    const timeNorm = (memory.date.getTime() - oldest) / timeRange;

    // Newer memories closer to center, older farther out
    const radius = (1 - timeNorm) * maxRadius * 0.85 + maxRadius * 0.08;

    // Spiral: base angle from category + time-based rotation
    const baseAngle = CATEGORY_ANGLES[memory.category];
    const spiralTwist = timeNorm * Math.PI * 0.8;
    const idOffset = hashString(memory.id) * 1.2 - 0.6;
    const angle = baseAngle + spiralTwist + idOffset;

    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    const size = 2 + memory.importance * 1;

    results.push({ memory, x, y, size });
  }

  return results;
}

// Simple string hash for deterministic offsets
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000;
  }
  return hash / 1000; // 0 to 1
}
