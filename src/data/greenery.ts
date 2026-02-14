export interface GreenerySet {
  id: string;
  name: string;
  bushImage: string;
  bushTopImage: string | null;
}

export const greenerySets: GreenerySet[] = [
  {
    id: "lush",
    name: "Lush Greens",
    bushImage: "/greenery/bush-1.png",
    bushTopImage: "/greenery/bush-1-top.png",
  },
  {
    id: "tropical",
    name: "Tropical",
    bushImage: "/greenery/bush-2.png",
    bushTopImage: null,
  },
  {
    id: "wild",
    name: "Wild Garden",
    bushImage: "/greenery/bush-3.png",
    bushTopImage: null,
  },
];
