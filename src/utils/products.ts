import { Product } from "@/domain/product";
import { products } from "@/mock/products";

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getPrimaryCategory(
  product: Pick<Product, "category" | "categories">
): string {
  return product.categories[0] ?? product.category;
}

export function getProductCategories(productList: Product[]): string[] {
  const categories = productList.flatMap((product) =>
    product.categories.length ? product.categories : [product.category]
  );

  return [
    ...new Set(categories.map((category) => category.trim()).filter(Boolean)),
  ].sort((left, right) => left.localeCompare(right, "vi"));
}

export function getProductsByCategory(category: string): Product[] {
  const normalizedCategory = category.trim().toLocaleLowerCase("vi-VN");

  return products.filter((product) => {
    const productCategories = product.categories.length
      ? product.categories
      : [product.category];

    return productCategories.some(
      (item) => item.trim().toLocaleLowerCase("vi-VN") === normalizedCategory
    );
  });
}

export function getRelatedProducts(productId: string, limit: number): Product[] {
  const safeLimit = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 0;
  const currentProduct = products.find((product) => product.id === productId);

  if (!currentProduct || safeLimit === 0) {
    return [];
  }

  const currentCategories = new Set(
    (currentProduct.categories.length
      ? currentProduct.categories
      : [currentProduct.category]
    ).map((category) => category.trim().toLocaleLowerCase("vi-VN"))
  );
  const candidates = products.filter((product) => product.id !== productId);
  const sameCategory = candidates.filter((product) =>
    (product.categories.length ? product.categories : [product.category]).some(
      (category) =>
        currentCategories.has(category.trim().toLocaleLowerCase("vi-VN"))
    )
  );
  const otherProducts = candidates.filter(
    (product) => !sameCategory.includes(product)
  );

  return [...sameCategory, ...otherProducts].slice(0, safeLimit);
}

export function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

export function searchProducts(keyword: string): Product[] {
  const cleanKeyword = keyword.trim().toLowerCase();
  if (!cleanKeyword) return [];

  const normalizedKeyword = removeVietnameseTones(cleanKeyword);
  const keywordTokens = normalizedKeyword.split(/\s+/).filter(Boolean);

  return products
    .filter((product) => {
      // 1. Direct raw match
      const rawCorpus = [
        product.name,
        product.category,
        ...(product.categories || []),
        ...(product.uses || []),
        ...(product.activeIngredients || []),
        ...(product.ingredients || []),
        product.shortDescription || "",
        product.volume || "",
        product.id,
      ]
        .join(" ")
        .toLowerCase();

      if (rawCorpus.includes(cleanKeyword)) return true;

      // 2. Normalized without Vietnamese tones match
      const normCorpus = removeVietnameseTones(rawCorpus);

      // All keyword tokens must be present in the normalized corpus
      return keywordTokens.every((token) => normCorpus.includes(token));
    })
    .sort((a, b) => {
      // Prioritize exact/partial match in product name
      const aNameNorm = removeVietnameseTones(a.name);
      const bNameNorm = removeVietnameseTones(b.name);
      const aHasName = aNameNorm.includes(normalizedKeyword);
      const bHasName = bNameNorm.includes(normalizedKeyword);
      if (aHasName && !bHasName) return -1;
      if (!aHasName && bHasName) return 1;
      return 0;
    });
}

