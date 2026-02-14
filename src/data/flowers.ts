export interface Flower {
  id: string;
  name: string;
  meaning: string;
  birthMonth: string;
  image: string;
}

export const flowers: Flower[] = [
  { id: "orchid", name: "Orchid", meaning: "Beauty", birthMonth: "October", image: "/flowers/orchid.webp" },
  { id: "tulip", name: "Tulip", meaning: "Perfect Love", birthMonth: "January", image: "/flowers/tulip.webp" },
  { id: "dahlia", name: "Dahlia", meaning: "Elegance", birthMonth: "November", image: "/flowers/dahlia.webp" },
  { id: "anemone", name: "Anemone", meaning: "Anticipation", birthMonth: "March", image: "/flowers/anemone.webp" },
  { id: "peony", name: "Peony", meaning: "Prosperity", birthMonth: "April", image: "/flowers/peony.webp" },
  { id: "zinnia", name: "Zinnia", meaning: "Endurance", birthMonth: "July", image: "/flowers/zinnia.webp" },
  { id: "rose", name: "Rose", meaning: "Love", birthMonth: "June", image: "/flowers/rose.webp" },
  { id: "sunflower", name: "Sunflower", meaning: "Adoration", birthMonth: "August", image: "/flowers/sunflower.webp" },
  { id: "lily", name: "Lily", meaning: "Purity", birthMonth: "May", image: "/flowers/lily.webp" },
  { id: "daisy", name: "Daisy", meaning: "Innocence", birthMonth: "February", image: "/flowers/daisy.webp" },
  { id: "carnation", name: "Carnation", meaning: "Fascination", birthMonth: "September", image: "/flowers/carnation.webp" },
  { id: "ranunculus", name: "Ranunculus", meaning: "Charm", birthMonth: "December", image: "/flowers/ranunculus.webp" },
];

export function getFlowerById(id: string): Flower | undefined {
  return flowers.find((f) => f.id === id);
}
