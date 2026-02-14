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
// This ensures the same selections always produce the same arrangement,
// avoiding layout shifts on re-renders.
function createRng(seed: number) {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Derive a stable seed from selections so the same input always
// produces the same arrangement.
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
 * Generate a dome-shaped arrangement of flowers.
 *
 * Flowers are distributed in a circular cluster centered at roughly (50%, 45%)
 * with a vertical squash factor to create a dome / half-sphere look.
 */
export function generateArrangement(
  selections: FlowerSelection[],
): ArrangementItem[] {
  // Expand selections into individual flower instances
  const expanded: string[] = [];
  for (const s of selections) {
    for (let i = 0; i < s.count; i++) {
      expanded.push(s.flowerId);
    }
  }

  if (expanded.length === 0) return [];

  const rng = createRng(selectionSeed(selections));

  const centerX = 50;
  const centerY = 45;
  const verticalSquash = 0.7;

  const items: ArrangementItem[] = [];

  // Use golden-angle distribution for a natural-looking spiral,
  // with added randomness so it doesn't look mechanical.
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5 degrees

  for (let i = 0; i < expanded.length; i++) {
    // Base angle from golden-angle spiral + randomness
    const baseAngle = i * goldenAngle;
    const angleJitter = (rng() - 0.5) * 0.8; // +/- ~23 degrees
    const angle = baseAngle + angleJitter;

    // Radius: distribute from inner to outer, range 15-30% from center
    // Use square-root distribution so flowers aren't all bunched in center
    const t = expanded.length === 1 ? 0 : i / (expanded.length - 1);
    const baseRadius = 15 + Math.sqrt(t) * 15;
    const radiusJitter = (rng() - 0.5) * 6; // +/- 3% randomness
    const radius = baseRadius + radiusJitter;

    const rawX = centerX + Math.cos(angle) * radius;
    const rawY = centerY + Math.sin(angle) * radius * verticalSquash;

    const x = clamp(rawX, 5, 95);
    const y = clamp(rawY, 5, 95);

    const rotation = (rng() - 0.5) * 60; // -30 to +30 degrees
    const scale = 0.8 + rng() * 0.4; // 0.8 to 1.2

    items.push({
      x,
      y,
      rotation,
      scale,
      flowerId: expanded[i],
      zIndex: 10 + i, // ascending z-index, starts above greenery
    });
  }

  return items;
}

/**
 * Generate greenery pieces that sit behind the flowers.
 *
 * Produces 6-9 pieces distributed in a circle at a wider radius,
 * giving the effect of leaves peeking out from behind the bouquet.
 */
export function generateGreenery(images: string[]): GreeneryItem[] {
  if (images.length === 0) return [];

  // Use a fixed seed for greenery so it's stable
  const rng = createRng(42);

  const count = 6 + Math.floor(rng() * 4); // 6-9 pieces
  const centerX = 50;
  const centerY = 45;

  const items: GreeneryItem[] = [];

  for (let i = 0; i < count; i++) {
    // Distribute evenly around a circle with some randomness
    const baseAngle = (i / count) * Math.PI * 2;
    const angleJitter = (rng() - 0.5) * 0.6;
    const angle = baseAngle + angleJitter;

    // Radius: 20-45% from center
    const radius = 20 + rng() * 25;

    const x = clamp(centerX + Math.cos(angle) * radius, 5, 95);
    const y = clamp(centerY + Math.sin(angle) * radius * 0.8, 5, 95);

    const rotation = (rng() - 0.5) * 90; // -45 to +45 degrees
    const scale = 0.7 + rng() * 0.6; // 0.7 to 1.3

    // Pick a random image from the provided set
    const image = images[Math.floor(rng() * images.length)];

    items.push({
      x,
      y,
      rotation,
      scale,
      image,
      zIndex: 1 + i, // 1-9, behind flowers
    });
  }

  return items;
}
