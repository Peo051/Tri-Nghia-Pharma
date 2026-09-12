export interface ProductReview {
  id: string;
  userName: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase?: boolean;
}

export interface Product {
  id: string;
  sourceUrl: string;
  canonicalUrl: string;
  name: string;
  categories: string[];
  category: string;
  price: number | null;
  originalPrice?: number | null;
  discountPercent?: number;
  promotionBadge?: string;
  freeShipping?: boolean;
  currency: string | null;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  reviews?: ProductReview[];
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

