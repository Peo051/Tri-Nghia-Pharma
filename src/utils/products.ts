import { Product } from "@/domain/product";
import { products } from "@/mock/products";

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category);
}

export function getRelatedProducts(productId: string, limit: number): Product[] {
  const safeLimit = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 0;

  return products
    .filter((product) => product.id !== productId)
    .slice(0, safeLimit);
}
