
export type ProductType =
  | "apparel"
  | "drinkware"
  | "stationery"
  | "promotional"
  | "packaging"
  | "simple";

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  sortOrder: number;
}

export interface Product {
  id: string | number;
  name: string;
  category: string;
  collection: string;
  type: ProductType;
  description: string;
  colours: string[];
  sizes?: string[];
  imageLabels: string[];
  extraFields?: string[];
  images?: ProductImage[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Branded T-Shirt",
    category: "T-Shirts",
    collection: "Apparel",
    type: "apparel",
    description: "Custom branded T-shirts for businesses and events.",
    colours: ["Black", "White", "Navy", "Royal Blue", "Red", "Burgundy", "Grey", "Bottle Green", "Yellow"],
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    imageLabels: ["Front view", "Back view", "Fabric detail"],
  },
  {
    id: 2,
    name: "Branded Hoodie",
    category: "Hoodies",
    collection: "Apparel",
    type: "apparel",
    description: "Custom branded hoodies.",
    colours: ["Black", "White", "Navy", "Grey", "Red", "Bottle Green"],
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    imageLabels: ["Front view", "Back view", "Fabric detail"],
  },
  {
    id: 3,
    name: "Golf Shirt",
    category: "Golf Shirts",
    collection: "Apparel",
    type: "apparel",
    description: "Branded golf shirts for teams and businesses.",
    colours: ["Black", "White", "Navy", "Royal Blue", "Red", "Grey"],
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    imageLabels: ["Front view", "Back view", "Fabric detail"],
  },
  {
    id: 4,
    name: "Branded Cap",
    category: "Caps",
    collection: "Apparel",
    type: "promotional",
    description: "Custom caps with your company branding.",
    colours: ["Black", "White", "Navy", "Red", "Grey", "Bottle Green"],
    imageLabels: ["Front view", "Side view", "Back view"],
  },
  {
    id: 5,
    name: "Branded Mug",
    category: "Cups",
    collection: "Drinkware",
    type: "drinkware",
    description: "Custom printed mugs for gifts and promotions.",
    colours: ["White", "Black", "Red", "Blue", "Navy"],
    imageLabels: ["Front view", "Side view", "Print detail"],
  },
  {
    id: 6,
    name: "Branded Drinkware",
    category: "Drinkware",
    collection: "Drinkware",
    type: "drinkware",
    description: "Custom bottles and tumblers.",
    colours: ["Black", "White", "Silver", "Blue", "Red"],
    imageLabels: ["Front view", "Side view", "Detail"],
  },
  {
    id: 7,
    name: "Corporate Diary",
    category: "Diaries",
    collection: "Office & Stationery",
    type: "stationery",
    description: "Professional branded diaries.",
    colours: ["Black", "Navy", "Brown", "Grey", "Red"],
    imageLabels: ["Cover", "Inside pages", "Detail"],
    extraFields: ["Page layout", "Cover finish"],
  },
  {
    id: 8,
    name: "Business Cards",
    category: "Business Cards",
    collection: "Office & Stationery",
    type: "stationery",
    description: "Professionally printed business cards.",
    colours: [],
    imageLabels: ["Front design", "Back design", "Finish detail"],
    extraFields: ["Paper type", "Finish"],
  },
  {
    id: 9,
    name: "Branded Notebook",
    category: "Notebooks",
    collection: "Office & Stationery",
    type: "stationery",
    description: "Custom notebooks for your team or clients.",
    colours: ["Black", "White", "Navy", "Brown", "Grey"],
    imageLabels: ["Cover", "Inside pages", "Detail"],
    extraFields: ["Page count", "Paper type"],
  },
  {
    id: 10,
    name: "Branded Pen",
    category: "Pens",
    collection: "Office & Stationery",
    type: "simple",
    description: "Promotional pens with your branding.",
    colours: ["Black", "Blue", "Red", "Silver", "White"],
    imageLabels: ["Side view", "Branding detail", "Close-up"],
  },
  {
    id: 11,
    name: "Award Medal",
    category: "Medals",
    collection: "Promotional",
    type: "promotional",
    description: "Custom medals for awards and events.",
    colours: ["Gold", "Silver", "Bronze"],
    imageLabels: ["Front view", "Back view", "Ribbon detail"],
    extraFields: ["Medal design", "Engraving details"],
  },
  {
    id: 12,
    name: "Branded Keyholder",
    category: "Keyholders",
    collection: "Promotional",
    type: "promotional",
    description: "Custom keyholders for promotions.",
    colours: ["Black", "Silver", "Gold", "Blue", "Red"],
    imageLabels: ["Front view", "Back view", "Detail"],
    extraFields: ["Keyholder material"],
  },
  {
    id: 13,
    name: "Branded Bag",
    category: "Bags",
    collection: "Promotional",
    type: "promotional",
    description: "Custom branded bags for events and businesses.",
    colours: ["Black", "White", "Navy", "Natural", "Grey"],
    imageLabels: ["Front view", "Side view", "Detail"],
    extraFields: ["Bag material", "Bag style"],
  },
  {
    id: 14,
    name: "Promotional Banner",
    category: "Banners",
    collection: "Promotional",
    type: "packaging",
    description: "Custom banners for events and advertising.",
    colours: [],
    imageLabels: ["Full view", "Print detail", "Finish"],
    extraFields: ["Width", "Height", "Material", "Finishing"],
  },
  {
    id: 15,
    name: "Custom Packaging",
    category: "Custom Packaging",
    collection: "Packaging",
    type: "packaging",
    description: "Packaging designed around your brand.",
    colours: ["White", "Black", "Kraft", "Custom"],
    imageLabels: ["Front view", "Side view", "Finish detail"],
    extraFields: ["Packaging type", "Dimensions", "Material", "Finish"],
  },
];

export const collections = [
  {
    name: "Apparel",
    description: "T-Shirts, Hoodies, Golf Shirts and Caps",
    categories: ["T-Shirts", "Hoodies", "Golf Shirts", "Caps"],
  },
  {
    name: "Drinkware",
    description: "Cups, Bottles and Tumblers",
    categories: ["Cups", "Drinkware"],
  },
  {
    name: "Office & Stationery",
    description: "Diaries, Business Cards, Notebooks and Pens",
    categories: ["Diaries", "Business Cards", "Notebooks", "Pens"],
  },
  {
    name: "Promotional",
    description: "Medals, Keyholders, Bags and Banners",
    categories: ["Medals", "Keyholders", "Bags", "Banners"],
  },
  {
    name: "Packaging",
    description: "Custom Packaging Solutions",
    categories: ["Custom Packaging"],
  },
];

export const categories = [
  "All Categories",
  "Diaries",
  "Business Cards",
  "T-Shirts",
  "Cups",
  "Medals",
  "Caps",
  "Custom Packaging",
  "Drinkware",
  "Notebooks",
  "Keyholders",
  "Bags",
  "Pens",
  "Hoodies",
  "Banners",
  "Golf Shirts",
];
