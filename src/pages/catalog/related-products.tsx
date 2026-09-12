import ProductGrid from "@/components/product-grid";
import { Product } from "@/domain/product";

export interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts(props: RelatedProductsProps) {
  return <ProductGrid replace products={props.products} />;
}
