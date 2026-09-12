import { useMemo, useState } from "react";
import { products } from "@/mock/products";
import { getProductCategories } from "@/utils/products";
import Banners from "./banners";
import CategoryFilter from "./category-filter";
import ProductGrid from "@/components/product-grid";
import CustomerSummary from "@/components/customer-summary";
import QuickActions from "@/components/quick-actions";
import opodisLogo from "@/static/logo-opodis.png";

import TransitionLink from "@/components/transition-link";

import FlashSale from "@/components/flash-sale";

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
    <div className="w-full min-h-full pb-6">
      {/* 1. Promotional Carousel */}
      <Banners onSelectCategory={setSelectedCategory} />

      {/* Flash Sale cho một số sản phẩm nổi bật */}
      <FlashSale products={products} />

      {/* 2. Customer summary */}
      <CustomerSummary className="mt-4" />

      {/* 3. Quick actions */}
      <QuickActions className="mt-4" />

      {/* 4. Official information notice */}
      <div className="mx-4 mt-4 rounded-2xl bg-primary-soft/70 border border-primary/15 p-3 flex items-center gap-3 shadow-xs">
        <div className="w-11 h-11 rounded-xl bg-white border border-primary/20 shadow-xs flex items-center justify-center p-1.5 flex-none">
          <img
            src={opodisLogo}
            alt="Opodis Pharma"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <span className="block text-[12px] font-bold text-primary">
            Thông tin từ Opodis Pharma
          </span>
          <p className="text-[11px] leading-4 text-subtitle mt-0.5">
            Theo dõi các nhóm sản phẩm và thông tin chăm sóc sức khỏe trên kênh chính thức.
          </p>
        </div>
      </div>

      {/* 5. Category Filter */}
      <section id="home-categories" className="mt-5">
        <div className="px-4 mb-2">
          <h2 className="text-section-title font-black text-primary tracking-tight">
            Danh mục sản phẩm
          </h2>
        </div>
        <CategoryFilter
          options={categoryOptions}
          selectedId={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </section>

      {/* 6. Products Section */}
      <section id="home-products" className="w-full mt-5">
        <div className="px-4 mb-3 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-section-title font-black text-primary tracking-tight">
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
