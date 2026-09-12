import { useMemo, useState } from "react";
import CategoryFilter from "@/pages/home/category-filter";
import ProductGrid from "@/components/product-grid";
import { products } from "@/mock/products";
import { getProductCategories } from "@/utils/products";
import TransitionLink from "@/components/transition-link";

import Pagination from "@/components/pagination";

const ITEMS_PER_PAGE = 8;

function matchesCategory(productCategory: string, selectedCategory: string) {
  return productCategory.trim().toLocaleLowerCase("vi-VN") ===
    selectedCategory.trim().toLocaleLowerCase("vi-VN");
}

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

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

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <div className="min-h-full bg-section/30 py-4 pb-6">
      <div className="px-4 mb-3">
        <span className="text-[11px] font-bold tracking-[0.12em] text-primary uppercase">
          OPODIS PHARMA
        </span>
        <h1 className="text-[22px] leading-7 font-black text-primary mt-1">
          Danh mục sản phẩm
        </h1>
        <p className="text-[12px] leading-5 text-subtitle mt-1">
          Khám phá các nhóm sản phẩm từ snapshot chính thức của Opodis Pharma.
        </p>
      </div>

      {/* Search trigger */}
      <div className="px-4 mb-3.5">
        <TransitionLink
          to="/search"
          className="w-full h-11 px-3.5 rounded-2xl bg-white border border-border/80 flex items-center gap-2.5 text-subtitle shadow-xs active:scale-[0.99] transition-all cursor-pointer"
          aria-label="Tìm kiếm sản phẩm"
        >
          <div className="text-primary flex-none">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <span className="text-[13px] text-subtitle/80 flex-1 truncate">
            Tìm tên sản phẩm, hoạt chất, công dụng...
          </span>
          <span className="text-[11px] font-bold text-primary px-2.5 py-1 rounded-xl bg-primary-soft flex-none">
            Tìm kiếm
          </span>
        </TransitionLink>
      </div>

      <CategoryFilter
        options={categoryOptions}
        selectedId={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      <div className="px-4 mt-4 mb-2 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-foreground">
          {selectedCategory === "all" ? "Tất cả sản phẩm" : selectedCategory}
        </span>
        <span className="text-[11px] text-subtitle">
          {filteredProducts.length} sản phẩm
          {totalPages > 1 && ` (Trang ${currentPage}/${totalPages})`}
        </span>
      </div>

      <ProductGrid products={paginatedProducts} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}
