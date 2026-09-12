import { Product } from "@/domain/product";
import opodisSnapshot from "@/data/opodis-products.json";
import {
  resolveProductAsset,
  resolveProductGallery,
} from "@/utils/product-assets";

// Keep this import path for the template's existing consumers. The source of
// truth is the generated official snapshot, not the original mock catalogue.

interface OpodisProductSnapshot {
  id: string;
  sourceUrl: string;
  canonicalUrl: string;
  name: string;
  category: string | null;
  categories: string[] | null;
  price: number | null;
  currency: string | null;
  image: string | null;
  galleryImages: string[] | null;
  shortDescription: string;
  description: string;
  volume?: string | null;
  packaging?: string | null;
  ingredients?: string | string[] | null;
  activeIngredients?: string | string[] | null;
  uses?: string | string[] | null;
  directions?: string | string[] | null;
  warnings?: string | string[] | null;
  advantages?: string | string[] | null;
  registrationNumber?: string | null;
  purchaseLinks?: string[] | null;
}

interface OpodisSnapshot {
  products: OpodisProductSnapshot[];
}

function normalizeText(value: string | null | undefined): string | null {
  const normalized = value?.trim() ?? "";
  return normalized || null;
}

function normalizeTextList(
  value: string | string[] | null | undefined
): string[] {
  const values = Array.isArray(value) ? value : [value ?? ""];

  return [
    ...new Set(
      values
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean)
    ),
  ];
}

const snapshot: OpodisSnapshot = opodisSnapshot;

export const products: Product[] = snapshot.products.map((product) => {
  const categories = normalizeTextList([
    ...(product.categories ?? []),
    product.category ?? "",
  ]);
  const image = product.image ? resolveProductAsset(product.image) : null;
  const resolvedGallery = resolveProductGallery(product.galleryImages ?? []);
  const gallery = image
    ? resolvedGallery.filter((asset) => asset !== image)
    : resolvedGallery;
  const purchaseLinks = normalizeTextList(product.purchaseLinks);

  return {
    id: product.id,
    sourceUrl: product.sourceUrl,
    canonicalUrl: product.canonicalUrl,
    name: product.name,
    categories,
    category: normalizeText(product.category) ?? categories[0] ?? "",
    price: product.price,
    currency: product.currency ?? null,
    image,
    gallery,
    shortDescription: product.shortDescription,
    description: product.description,
    registrationNumber: normalizeText(product.registrationNumber),
    packaging: normalizeText(product.packaging),
    volume: normalizeText(product.volume),
    ingredients: normalizeTextList(product.ingredients),
    activeIngredients: normalizeTextList(product.activeIngredients),
    uses: normalizeTextList(product.uses),
    directions: normalizeTextList(product.directions),
    warnings: normalizeTextList(product.warnings),
    advantages: normalizeTextList(product.advantages),
    ...(purchaseLinks.length ? { purchaseLinks } : {}),
  };
});
