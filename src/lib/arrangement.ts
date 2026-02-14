// Pure arrangement algorithm for generating flower order and rotation.
// Uses flex-wrap layout (positioning handled by CSS, not JS).

export interface ArrangementItem {
  flowerId: string;
  order: number;
  rotation: number; // degrees, -5 to +5
}

export interface FlowerSelection {
  flowerId: string;
  count: number;
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

/**
 * Generate arrangement items with randomized order and subtle rotation.
 * The flex-wrap CSS layout handles spatial positioning — this just
 * controls the visual order and per-flower rotation.
 *
 * Pass a non-zero `extraSeed` to get a different arrangement variation.
 */
export function generateArrangement(
  selections: FlowerSelection[],
  extraSeed: number = 0,
): ArrangementItem[] {
  const expanded: string[] = [];
  for (const s of selections) {
    for (let i = 0; i < s.count; i++) {
      expanded.push(s.flowerId);
    }
  }

  if (expanded.length === 0) return [];

  const rng = createRng(selectionSeed(selections) + extraSeed);

  // Create shuffled order indices via Fisher-Yates
  const orders = expanded.map((_, i) => i);
  for (let i = orders.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [orders[i], orders[j]] = [orders[j], orders[i]];
  }

  return expanded.map((flowerId, i) => ({
    flowerId,
    order: orders[i],
    rotation: Math.round((rng() - 0.5) * 10), // -5 to +5 degrees
  }));
}
