import { useMemo, useState } from "react";
import CategoryFilter from "@/pages/home/category-filter";
import ProductGrid from "@/components/product-grid";
import { products } from "@/mock/products";
import { getProductCategories } from "@/utils/products";

function matchesCategory(productCategory: string, selectedCategory: string) {
  return productCategory.trim().toLocaleLowerCase("vi-VN") ===
    selectedCategory.trim().toLocaleLowerCase("vi-VN");
}

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categoryOptions = useMemo(
    () => [
      { id: "all", label: "Tất cả", count: products.length },
      ...getProductCategories(products).map((category) => ({
        id: category,
        label: category,
        count: products.filter((product) =>
          (product.categories.length
            ? product.categories
            : [product.category]
          ).some((item) => matchesCategory(item, category))
        ).length,
      })),
    ],
    []
  );

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }

    return products.filter((product) =>
      (product.categories.length ? product.categories : [product.category]).some(
        (category) => matchesCategory(category, selectedCategory)
      )
    );
  }, [selectedCategory]);

  return (
    <div className="min-h-full bg-section/30 py-4 pb-6">
      <div className="px-4 mb-4">
        <span className="text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
          OPODIS PHARMA
        </span>
        <h1 className="text-[21px] leading-7 font-bold text-foreground mt-1">
          Danh mục sản phẩm
        </h1>
        <p className="text-[12px] leading-5 text-subtitle mt-1">
          Khám phá các nhóm sản phẩm từ snapshot chính thức của Opodis Pharma.
        </p>
      </div>

      <CategoryFilter
        options={categoryOptions}
        selectedId={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="px-4 mt-4 mb-2 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-foreground">
          {selectedCategory === "all" ? "Tất cả sản phẩm" : selectedCategory}
        </span>
        <span className="text-[11px] text-subtitle">
          {filteredProducts.length} sản phẩm
        </span>
      </div>

      <ProductGrid products={filteredProducts} />
    </div>
  );
}
