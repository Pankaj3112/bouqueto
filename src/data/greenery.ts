export interface GreenerySet {
  id: string;
  name: string;
  images: string[];
}

export const greenerySets: GreenerySet[] = [
  {
    id: "tropical",
    name: "Tropical Leaves",
    images: ["/greenery/tropical-1.png", "/greenery/tropical-2.png", "/greenery/tropical-3.png"],
  },
  {
    id: "ferns",
    name: "Ferns",
    images: ["/greenery/fern-1.png", "/greenery/fern-2.png", "/greenery/fern-3.png"],
  },
  {
    id: "eucalyptus",
    name: "Eucalyptus",
    images: ["/greenery/eucalyptus-1.png", "/greenery/eucalyptus-2.png", "/greenery/eucalyptus-3.png"],
  },
];
