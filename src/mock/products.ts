import { Product } from "@/domain/product";
import opfluPlaceholder from "@/static/products/opflu-placeholder.svg";
import opodex70Placeholder from "@/static/products/opodex-70-placeholder.svg";
import opoluxPlaceholder from "@/static/products/opolux-placeholder.svg";
import phytobebePlaceholder from "@/static/products/phytobebe-placeholder.svg";
import phytogynoDailyPlaceholder from "@/static/products/phytogyno-daily-placeholder.svg";
import phytogynoPlaceholder from "@/static/products/phytogyno-placeholder.svg";
import rawProducts from "./products.json";

const productImages: Record<string, string> = {
  phytobebe: phytobebePlaceholder,
  phytogyno: phytogynoPlaceholder,
  "phytogyno-daily": phytogynoDailyPlaceholder,
  opflu: opfluPlaceholder,
  opolux: opoluxPlaceholder,
  "opodex-70": opodex70Placeholder,
};

// Prices are intentionally illustrative and must be replaced before production use.
export const products: Product[] = rawProducts.map((product): Product => {
  const image = productImages[product.id];

  if (!image) {
    throw new Error(`Missing local placeholder image for product: ${product.id}`);
  }

  return {
    ...product,
    image,
  };
});
