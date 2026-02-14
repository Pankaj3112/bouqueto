export interface Flower {
  id: string;
  name: string;
  meaning: string;
  birthMonth: string;
  image: string;
  displaySize: 120 | 160; // px size in bouquet composition
}

export const flowers: Flower[] = [
  { id: "orchid", name: "Orchid", meaning: "Beauty", birthMonth: "October", image: "/flowers/orchid.webp", displaySize: 120 },
  { id: "tulip", name: "Tulip", meaning: "Perfect Love", birthMonth: "January", image: "/flowers/tulip.webp", displaySize: 120 },
  { id: "dahlia", name: "Dahlia", meaning: "Elegance", birthMonth: "November", image: "/flowers/dahlia.webp", displaySize: 120 },
  { id: "anemone", name: "Anemone", meaning: "Anticipation", birthMonth: "March", image: "/flowers/anemone.webp", displaySize: 120 },
  { id: "peony", name: "Peony", meaning: "Prosperity", birthMonth: "April", image: "/flowers/peony.webp", displaySize: 120 },
  { id: "zinnia", name: "Zinnia", meaning: "Endurance", birthMonth: "July", image: "/flowers/zinnia.webp", displaySize: 120 },
  { id: "rose", name: "Rose", meaning: "Love", birthMonth: "June", image: "/flowers/rose.webp", displaySize: 120 },
  { id: "sunflower", name: "Sunflower", meaning: "Adoration", birthMonth: "August", image: "/flowers/sunflower.webp", displaySize: 160 },
  { id: "lily", name: "Lily", meaning: "Purity", birthMonth: "May", image: "/flowers/lily.webp", displaySize: 160 },
  { id: "daisy", name: "Daisy", meaning: "Innocence", birthMonth: "February", image: "/flowers/daisy.webp", displaySize: 120 },
  { id: "carnation", name: "Carnation", meaning: "Fascination", birthMonth: "September", image: "/flowers/carnation.webp", displaySize: 160 },
  { id: "ranunculus", name: "Ranunculus", meaning: "Charm", birthMonth: "December", image: "/flowers/ranunculus.webp", displaySize: 120 },
];

export function getFlowerById(id: string): Flower | undefined {
  return flowers.find((f) => f.id === id);
}
