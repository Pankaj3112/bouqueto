export interface Flower {
  id: string;
  name: string;
  meaning: string;
  birthMonth: string;
  image: string;
}

export const flowers: Flower[] = [
  { id: "orchid", name: "Orchid", meaning: "Beauty", birthMonth: "October", image: "/flowers/orchid.png" },
  { id: "tulip", name: "Tulip", meaning: "Perfect Love", birthMonth: "January", image: "/flowers/tulip.png" },
  { id: "dahlia", name: "Dahlia", meaning: "Elegance", birthMonth: "November", image: "/flowers/dahlia.png" },
  { id: "anemone", name: "Anemone", meaning: "Anticipation", birthMonth: "March", image: "/flowers/anemone.png" },
  { id: "peony", name: "Peony", meaning: "Prosperity", birthMonth: "April", image: "/flowers/peony.png" },
  { id: "zinnia", name: "Zinnia", meaning: "Endurance", birthMonth: "July", image: "/flowers/zinnia.png" },
  { id: "rose", name: "Rose", meaning: "Love", birthMonth: "June", image: "/flowers/rose.png" },
  { id: "sunflower", name: "Sunflower", meaning: "Adoration", birthMonth: "August", image: "/flowers/sunflower.png" },
  { id: "lily", name: "Lily", meaning: "Purity", birthMonth: "May", image: "/flowers/lily.png" },
  { id: "daisy", name: "Daisy", meaning: "Innocence", birthMonth: "February", image: "/flowers/daisy.png" },
  { id: "carnation", name: "Carnation", meaning: "Fascination", birthMonth: "September", image: "/flowers/carnation.png" },
  { id: "ranunculus", name: "Ranunculus", meaning: "Charm", birthMonth: "December", image: "/flowers/ranunculus.png" },
];

export function getFlowerById(id: string): Flower | undefined {
  return flowers.find((f) => f.id === id);
}
