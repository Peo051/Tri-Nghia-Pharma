/**
 * Compatibility model for the unchanged ZaUI Fashion commerce components.
 * The canonical Opodis domain model lives in src/domain/product.ts.
 */
export interface TemplateProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: Category;
  packing?: string;
  indication?: string;
  details?: Detail[];
  sizes?: Size[];
  colors?: Color[];
}

export type Product = TemplateProduct;

export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Detail {
  title: string;
  content: string;
}
export type Size = string;

export interface Color {
  name: string;
  hex: string;
}

export type SelectedOptions = {
  size?: Size;
  color?: Color["name"];
};

export interface CartItem {
  id: number;
  product: TemplateProduct;
  options: SelectedOptions;
  quantity: number;
}

export type Cart = CartItem[];
