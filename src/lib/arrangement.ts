// Pure arrangement algorithm for generating flower and greenery positions.
// All coordinates use percentages (0-100) for responsive layout.

export interface ArrangementItem {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  rotation: number; // degrees
  scale: number;
  flowerId: string;
  zIndex: number;
}

export interface FlowerSelection {
  flowerId: string;
  count: number;
}

export interface GreeneryItem {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  rotation: number; // degrees
  scale: number;
  image: string;
  zIndex: number;
}

// Seeded pseudo-random number generator (mulberry32) for deterministic layouts.
function createRng(seed: number) {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function selectionSeed(selections: FlowerSelection[]): number {
  let hash = 0;
  for (const s of selections) {
    for (let i = 0; i < s.flowerId.length; i++) {
      hash = (hash * 31 + s.flowerId.charCodeAt(i)) | 0;
    }
    hash = (hash * 31 + s.count) | 0;
  }
  return hash;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Generate a tight dome-shaped arrangement of flowers.
 *
 * Flowers are placed in a tight overlapping cluster centered in the
 * upper-center area of the composition, sitting on top of the greenery bush.
 */
export function generateArrangement(
  selections: FlowerSelection[],
): ArrangementItem[] {
  const expanded: string[] = [];
  for (const s of selections) {
    for (let i = 0; i < s.count; i++) {
      expanded.push(s.flowerId);
    }
  }

  if (expanded.length === 0) return [];

  const rng = createRng(selectionSeed(selections));

  const centerX = 50;
  const centerY = 40; // upper-center, above the bush base

  const items: ArrangementItem[] = [];

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < expanded.length; i++) {
    const baseAngle = i * goldenAngle;
    const angleJitter = (rng() - 0.5) * 0.6;
    const angle = baseAngle + angleJitter;

    // Tight radius: 0-18% from center so flowers overlap heavily
    const t = expanded.length === 1 ? 0 : i / (expanded.length - 1);
    const baseRadius = 2 + Math.sqrt(t) * 16;
    const radiusJitter = (rng() - 0.5) * 4;
    const radius = Math.max(0, baseRadius + radiusJitter);

    const rawX = centerX + Math.cos(angle) * radius;
    const rawY = centerY + Math.sin(angle) * radius * 0.75; // slight vertical squash

    const x = clamp(rawX, 15, 85);
    const y = clamp(rawY, 10, 75);

    const rotation = (rng() - 0.5) * 30; // -15 to +15 degrees (subtler rotation)
    const scale = 0.85 + rng() * 0.3; // 0.85 to 1.15

    items.push({
      x,
      y,
      rotation,
      scale,
      flowerId: expanded[i],
      zIndex: 10 + i,
    });
  }

  return items;
}

/**
 * Generate greenery — a single centered bush background image,
 * matching how the original Digibouquet renders greenery.
 * Returns a single item positioned at center-bottom.
 */
export function generateGreenery(images: string[]): GreeneryItem[] {
  if (images.length === 0) return [];

  const rng = createRng(42);

  // Pick one bush image as the main background
  const mainBush = images[Math.floor(rng() * images.length)];

  return [
    {
      x: 50,
      y: 50,
      rotation: 0,
      scale: 1,
      image: mainBush,
      zIndex: 1,
    },
  ];
}
