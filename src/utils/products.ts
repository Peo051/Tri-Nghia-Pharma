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

/**
 * Chuẩn hóa text dùng chung cho tìm kiếm sản phẩm.
 *
 * Ngoài việc bỏ dấu tiếng Việt, hàm còn chuẩn hóa khoảng trắng để các truy
 * vấn như "  khử   khuẩn  " hoạt động giống "khử khuẩn".
 */
export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLocaleLowerCase("vi-VN")
    .replace(/\s+/g, " ")
    .trim();
}

/** Giữ tên helper cũ để không làm hỏng các nơi đang sử dụng nó. */
export function removeVietnameseTones(value: string): string {
  return normalizeSearchText(value);
}

function getSearchableText(product: Product): string {
  return [
    product.name,
    product.id,
    product.category,
    ...product.categories,
    product.shortDescription,
    product.description,
    product.volume ?? "",
    product.packaging ?? "",
    product.registrationNumber ?? "",
    ...product.ingredients,
    ...product.activeIngredients,
    ...product.uses,
    ...product.directions,
    ...product.warnings,
    ...product.advantages,
  ]
    .filter(Boolean)
    .join(" ");
}

interface RankedSearchResult {
  product: Product;
  score: number;
  sourceIndex: number;
}

/**
 * Tìm sản phẩm theo tên, mã, danh mục và nội dung sản phẩm.
 *
 * Mọi token trong truy vấn phải xuất hiện trong dữ liệu sản phẩm. Kết quả
 * khớp tên được ưu tiên trước để người dùng thấy sản phẩm đúng nhất ở đầu.
 */
export function searchProducts(keyword: string): Product[] {
  const normalizedKeyword = normalizeSearchText(keyword);
  if (!normalizedKeyword) return [];

  const keywordTokens = normalizedKeyword.split(" ");

  return products
    .map<RankedSearchResult | null>((product, sourceIndex) => {
      const normalizedName = normalizeSearchText(product.name);
      const normalizedCorpus = normalizeSearchText(getSearchableText(product));
      const allTokensMatch = keywordTokens.every((token) =>
        normalizedCorpus.includes(token),
      );

      let score = Number.POSITIVE_INFINITY;
      if (normalizedName === normalizedKeyword) {
        score = 0;
      } else if (normalizedName.startsWith(normalizedKeyword)) {
        score = 1;
      } else if (normalizedName.includes(normalizedKeyword)) {
        score = 2;
      } else if (allTokensMatch) {
        score = 3;
      }

      if (!Number.isFinite(score)) return null;

      return { product, score, sourceIndex };
    })
    .filter((result): result is RankedSearchResult => result !== null)
    .sort(
      (left, right) =>
        left.score - right.score || left.sourceIndex - right.sourceIndex,
    )
    .map(({ product }) => product);
}
