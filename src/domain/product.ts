export interface Product {
  id: string;
  sourceUrl: string;
  canonicalUrl: string;
  name: string;
  categories: string[];
  category: string;
  price: number | null;
  currency: string | null;
  image: string | null;
  gallery: string[];
  shortDescription: string;
  description: string;
  registrationNumber: string | null;
  packaging: string | null;
  volume: string | null;
  ingredients: string[];
  activeIngredients: string[];
  uses: string[];
  directions: string[];
  warnings: string[];
  advantages: string[];
  purchaseLinks?: string[];
}
