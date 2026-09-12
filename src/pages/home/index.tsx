import { useMemo, useState } from "react";
import { products } from "@/mock/products";
import { getProductCategories } from "@/utils/products";
import Hero from "./hero";
import CategoryFilter from "./category-filter";
import ProductGrid from "@/components/product-grid";

const HomePage: React.FunctionComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categoryOptions = useMemo(
    () => [
      { id: "all", label: "Tất cả", count: products.length },
      ...getProductCategories(products).map((category) => ({
        id: category,
        label: category,
        count: products.filter((product) => {
          const productCategories = product.categories.length
            ? product.categories
            : [product.category];
          return productCategories.some(
            (c) =>
              c.trim().toLocaleLowerCase("vi-VN") ===
              category.trim().toLocaleLowerCase("vi-VN")
          );
        }).length,
      })),
    ],
    []
  );

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }

    const normalized = selectedCategory.trim().toLocaleLowerCase("vi-VN");
    return products.filter((product) => {
      const productCategories = product.categories.length
        ? product.categories
        : [product.category];
      return productCategories.some(
        (item) => item.trim().toLocaleLowerCase("vi-VN") === normalized
      );
    });
  }, [selectedCategory]);

  return (
    <div className="w-full min-h-full pb-8">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Category Filter */}
      <div className="mb-4">
        <CategoryFilter
          options={categoryOptions}
          selectedId={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* 3. Products Section */}
      <section className="w-full">
        <div className="px-4 mb-3 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-section-title font-bold text-foreground">
              {selectedCategory === "all" ? "Tất cả sản phẩm" : selectedCategory}
            </h2>
            <span className="text-[12px] text-subtitle mt-0.5">
              {selectedCategory === "all"
                ? `${products.length} sản phẩm Opodis Pharma chính hãng`
                : `${filteredProducts.length} sản phẩm trong danh mục`}
            </span>
          </div>

          {selectedCategory !== "all" && (
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className="text-[12px] font-semibold text-primary hover:text-primary-dark transition cursor-pointer"
            >
              Xem tất cả
            </button>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-section flex items-center justify-center text-subtitle">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
              </svg>
            </div>
            <p className="text-sm text-subtitle font-medium">
              Chưa có sản phẩm trong danh mục này.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
