import { useEffect, useMemo, useRef, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import SearchBar from "@/components/search-bar";
import ProductGrid from "@/components/product-grid";
import { keywordState, searchResultState } from "@/state";
import { products } from "@/mock/products";
import { getProductCategories, normalizeSearchText } from "@/utils/products";

const POPULAR_SEARCH_TAGS = [
  "Phytobebe",
  "Phytogyno",
  "Clincare",
  "Opolux",
  "Opflu",
  "Opodex 70",
  "Rôm sẩy",
  "Khử khuẩn",
  "Trầu không",
  "Vệ sinh nam",
];

type SortOption = "default" | "sold" | "price-asc" | "price-desc" | "rating";
type PriceRangeOption = "all" | "under-50k" | "50k-80k" | "over-80k";

export default function SearchPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const keyword = useAtomValue(keywordState);
  const setKeyword = useSetAtom(keywordState);
  const rawSearchResult = useAtomValue(searchResultState);

  // Filter States
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [priceRange, setPriceRange] = useState<PriceRangeOption>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [onlyDiscount, setOnlyDiscount] = useState<boolean>(false);
  const [highRating, setHighRating] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Focus on mount
  useEffect(() => {
    inputRef.current?.focus();
    return () => {
      setKeyword("");
    };
  }, [setKeyword]);

  const allCategories = useMemo(() => {
    return getProductCategories(products);
  }, []);

  const hasActiveFilters =
    sortBy !== "default" ||
    priceRange !== "all" ||
    selectedCategory !== "all" ||
    onlyDiscount ||
    highRating;

  const resetFilters = () => {
    setSortBy("default");
    setPriceRange("all");
    setSelectedCategory("all");
    setOnlyDiscount(false);
    setHighRating(false);
  };

  // Base list to filter from (searched list or all products if no keyword)
  const baseList = useMemo(() => {
    if (keyword.trim()) {
      return rawSearchResult;
    }
    return products;
  }, [keyword, rawSearchResult]);

  // Apply all filters and sorting
  const filteredProducts = useMemo(() => {
    let result = [...baseList];

    // Category filter
    if (selectedCategory !== "all") {
      const catNorm = normalizeSearchText(selectedCategory);
      result = result.filter((p) => {
        const pCats = p.categories?.length ? p.categories : [p.category];
        return pCats.some((c) => normalizeSearchText(c) === catNorm);
      });
    }

    // Price range filter
    if (priceRange === "under-50k") {
      result = result.filter((p) => p.price != null && p.price < 50000);
    } else if (priceRange === "50k-80k") {
      result = result.filter(
        (p) => p.price != null && p.price >= 50000 && p.price <= 80000
      );
    } else if (priceRange === "over-80k") {
      result = result.filter((p) => p.price != null && p.price > 80000);
    }

    // Discount filter
    if (onlyDiscount) {
      result = result.filter(
        (p) => p.discountPercent != null && p.discountPercent > 0
      );
    }

    // High rating filter
    if (highRating) {
      result = result.filter((p) => p.rating != null && p.rating >= 4.9);
    }

    // Sorting
    if (sortBy === "sold") {
      result.sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0));
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return result;
  }, [baseList, selectedCategory, priceRange, onlyDiscount, highRating, sortBy]);

  // Synchronize input change directly to search state for instant response
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleClear = () => {
    setKeyword("");
    inputRef.current?.focus();
  };

  const handleSelectTag = (tag: string) => {
    setKeyword(tag);
  };

  return (
    <div className="w-full min-h-full pb-10 bg-background">
      {/* 1. Sticky Header with Search Bar and Quick Tags */}
      <div className="pt-3 pb-2 bg-background sticky top-0 z-20 border-b border-border/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <SearchBar
          ref={inputRef}
          value={keyword}
          onChange={handleInputChange}
          onClear={handleClear}
          placeholder="Tìm tên sản phẩm, hoạt chất, công dụng..."
        />

        {/* Popular Search Tags Carousel */}
        <div className="px-4 mt-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[11px] font-bold text-primary flex-none mr-1">
            Gợi ý:
          </span>
          {POPULAR_SEARCH_TAGS.map((tag) => {
            const isSelected =
              normalizeSearchText(keyword) === normalizeSearchText(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleSelectTag(tag)}
                className={`flex-none px-2.5 py-1 rounded-full text-[11.5px] font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white shadow-xs"
                    : "bg-section/80 text-foreground/80 hover:bg-primary-soft hover:text-primary border border-border/70"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* 2. Sort & Filter Action Bar */}
        <div className="px-4 mt-2 pt-2 border-t border-border/60 flex items-center justify-between gap-2">
          {/* Quick Sort Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
            <button
              type="button"
              onClick={() => setSortBy("default")}
              className={`px-2.5 py-1 rounded-lg text-[11.5px] font-semibold flex-none transition ${
                sortBy === "default"
                  ? "bg-primary-soft text-primary font-bold"
                  : "text-subtitle hover:text-foreground"
              }`}
            >
              Phổ biến
            </button>
            <button
              type="button"
              onClick={() => setSortBy("sold")}
              className={`px-2.5 py-1 rounded-lg text-[11.5px] font-semibold flex-none transition ${
                sortBy === "sold"
                  ? "bg-primary-soft text-primary font-bold"
                  : "text-subtitle hover:text-foreground"
              }`}
            >
              Bán chạy
            </button>
            <button
              type="button"
              onClick={() =>
                setSortBy(sortBy === "price-asc" ? "price-desc" : "price-asc")
              }
              className={`px-2.5 py-1 rounded-lg text-[11.5px] font-semibold flex-none transition flex items-center gap-1 ${
                sortBy === "price-asc" || sortBy === "price-desc"
                  ? "bg-primary-soft text-primary font-bold"
                  : "text-subtitle hover:text-foreground"
              }`}
            >
              <span>Giá</span>
              <span className="text-[10px]">
                {sortBy === "price-asc" ? "↑" : sortBy === "price-desc" ? "↓" : "↕"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSortBy("rating")}
              className={`px-2.5 py-1 rounded-lg text-[11.5px] font-semibold flex-none transition ${
                sortBy === "rating"
                  ? "bg-primary-soft text-primary font-bold"
                  : "text-subtitle hover:text-foreground"
              }`}
            >
              ★ Đánh giá
            </button>
          </div>

          {/* Toggle Filter Panel Button */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11.5px] font-bold border transition flex-none cursor-pointer ${
              hasActiveFilters
                ? "bg-primary text-white border-primary shadow-xs"
                : "bg-surface border-border text-foreground/80 hover:border-primary/40"
            }`}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
            <span>Bộ lọc</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5" />
            )}
          </button>
        </div>

        {/* 3. Expandable Filter Panel */}
        {showFilters && (
          <div className="mx-4 mt-2.5 p-3 rounded-2xl bg-section/70 border border-border/80 text-[12px] space-y-2.5 animate-fadeIn">
            {/* Khoảng giá */}
            <div>
              <span className="text-foreground font-bold block mb-1.5">
                Khoảng giá:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", label: "Tất cả" },
                  { id: "under-50k", label: "< 50.000₫" },
                  { id: "50k-80k", label: "50k - 80.000₫" },
                  { id: "over-80k", label: "> 80.000₫" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPriceRange(item.id as PriceRangeOption)}
                    className={`px-2.5 py-1 rounded-xl font-medium transition cursor-pointer ${
                      priceRange === item.id
                        ? "bg-primary text-white font-bold"
                        : "bg-surface border border-border text-foreground/80 hover:border-primary/40"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Danh mục */}
            <div>
              <span className="text-foreground font-bold block mb-1.5">
                Danh mục:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`px-2.5 py-1 rounded-xl font-medium transition cursor-pointer ${
                    selectedCategory === "all"
                      ? "bg-primary text-white font-bold"
                      : "bg-surface border border-border text-foreground/80"
                  }`}
                >
                  Tất cả
                </button>
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-xl font-medium transition cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-primary text-white font-bold"
                        : "bg-surface border border-border text-foreground/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Tiêu chí khác: Đang giảm giá, Đánh giá cao */}
            <div>
              <span className="text-foreground font-bold block mb-1.5">
                Ưu tiên:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setOnlyDiscount(!onlyDiscount)}
                  className={`px-2.5 py-1 rounded-xl font-medium transition cursor-pointer ${
                    onlyDiscount
                      ? "bg-secondary text-white font-bold"
                      : "bg-surface border border-border text-foreground/80"
                  }`}
                >
                  🏷️ Đang giảm giá %
                </button>
                <button
                  type="button"
                  onClick={() => setHighRating(!highRating)}
                  className={`px-2.5 py-1 rounded-xl font-medium transition cursor-pointer ${
                    highRating
                      ? "bg-amber-500 text-white font-bold"
                      : "bg-surface border border-border text-foreground/80"
                  }`}
                >
                  ★ Đánh giá 4.9★+
                </button>
              </div>
            </div>

            {/* Reset Filter action */}
            {hasActiveFilters && (
              <div className="pt-2 border-t border-border/60 flex justify-end">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-primary font-bold text-[11.5px] hover:underline cursor-pointer"
                >
                  ↺ Đặt lại bộ lọc
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Products Result Section */}
      <div className="mt-3.5">
        <div className="px-4 mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-section-title font-black text-primary">
              {keyword.trim()
                ? `Kết quả cho "${keyword}"`
                : selectedCategory !== "all"
                ? selectedCategory
                : "Tất cả sản phẩm"}
            </h2>
            <span className="text-[12px] font-medium text-subtitle">
              Tìm thấy {filteredProducts.length} sản phẩm
            </span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11.5px] text-subtitle hover:text-primary transition"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          /* Empty state */
          <div className="mx-4 my-8 p-6 rounded-3xl bg-section/40 border border-border/70 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-primary-soft flex items-center justify-center text-primary mb-3">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-foreground">
              Không tìm thấy sản phẩm phù hợp
            </h3>
            <p className="text-[12.5px] text-subtitle leading-relaxed mt-1 max-w-[260px]">
              Không có sản phẩm nào thỏa mãn các điều kiện tìm kiếm và bộ lọc của bạn.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  handleClear();
                  resetFilters();
                }}
                className="px-4 py-2 rounded-full bg-primary text-white text-[12px] font-semibold shadow-xs active:scale-95 transition cursor-pointer"
              >
                Đặt lại tất cả
              </button>
              <a
                href="tel:02837582741"
                className="px-4 py-2 rounded-full bg-white border border-border text-primary text-[12px] font-semibold active:scale-95 transition"
              >
                Hotline tư vấn
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

