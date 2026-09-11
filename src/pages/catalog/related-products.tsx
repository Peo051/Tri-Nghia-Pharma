import ProductGrid from "@/components/product-grid";
import { getRelatedProducts } from "@/utils/products";

export interface RelatedProductsProps {
  currentProductId: string;
}

export default function RelatedProducts(props: RelatedProductsProps) {
  const relatedProducts = getRelatedProducts(props.currentProductId, 4);

  return <ProductGrid replace products={relatedProducts} />;
}
