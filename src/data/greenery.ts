export interface GreenerySet {
  id: string;
  name: string;
  images: string[];
}

export const greenerySets: GreenerySet[] = [
  {
    id: "lush",
    name: "Lush Greens",
    images: ["/greenery/bush-1.png", "/greenery/bush-2.png", "/greenery/bush-3.png"],
  },
  {
    id: "tropical",
    name: "Tropical",
    images: ["/greenery/bush-2.png", "/greenery/bush-1-top.png", "/greenery/bush-3.png"],
  },
  {
    id: "wild",
    name: "Wild Garden",
    images: ["/greenery/bush-3.png", "/greenery/bush-1.png", "/greenery/bush-1-top.png"],
  },
];
