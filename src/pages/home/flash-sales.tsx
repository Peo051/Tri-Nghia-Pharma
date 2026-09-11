import ProductGrid from "@/components/product-grid";
import Section from "@/components/section";
import { products } from "@/mock/products";

export default function FlashSales() {
  return (
    <Section title="Flash Sales" viewMoreTo="/flash-sales">
      <ProductGrid products={products} />
    </Section>
  );
}
