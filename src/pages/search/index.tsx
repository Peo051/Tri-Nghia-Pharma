import { useEffect, useMemo, useRef, useState } from "react";
import { useAtom } from "jotai";
import SearchBar from "@/components/search-bar";
import ProductGrid from "@/components/product-grid";
import { keywordState, searchResultState } from "@/state";
import { products } from "@/mock/products";
import { useNavigate } from "react-router-dom";

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

export default function SearchPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useAtom(keywordState);
  const [inputValue, setInputValue] = useState(keyword);

  // Focus on mount
  useEffect(() => {
    inputRef.current?.focus();
    return () => {
      setKeyword("");
    };
  }, [setKeyword]);

  // Synchronize input change directly to search state for instant response
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setInputValue(nextVal);
    setKeyword(nextVal);
  };

  const handleClear = () => {
    setInputValue("");
    setKeyword("");
    inputRef.current?.focus();
  };

  const handleSelectTag = (tag: string) => {
    setInputValue(tag);
    setKeyword(tag);
  };

  // Filtered results from searchProducts
  const searchResult = useMemo(() => {
    if (!keyword.trim()) return [];
    // Direct instant search
    const cleanKeyword = keyword.trim().toLowerCase();
    return products.filter((product) => {
      const rawCorpus = [
        product.name,
        product.category,
        ...(product.categories || []),
        ...(product.uses || []),
        ...(product.activeIngredients || []),
        ...(product.ingredients || []),
        product.shortDescription || "",
        product.volume || "",
        product.id,
      ]
        .join(" ")
        .toLowerCase();

      return rawCorpus.includes(cleanKeyword);
    });
  }, [keyword]);

  // Highlight recommended products when no keyword entered
  const recommendedProducts = useMemo(() => {
    return products.slice(0, 6);
  }, []);

  return (
    <div className="w-full min-h-full pb-10 bg-background">
      {/* 1. Search Bar */}
      <div className="pt-3 pb-2 bg-background sticky top-0 z-20 border-b border-border/60">
        <SearchBar
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onClear={handleClear}
          placeholder="Tìm tên sản phẩm, hoạt chất, công dụng..."
        />

        {/* 2. Popular Search Tags Carousel */}
        <div className="px-4 mt-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[11px] font-bold text-primary flex-none mr-1">
            Gợi ý:
          </span>
          {POPULAR_SEARCH_TAGS.map((tag) => {
            const isSelected = inputValue.trim().toLowerCase() === tag.toLowerCase();
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
      </div>

      {/* 3. Search Results or Initial State */}
      <div className="mt-4">
        {keyword.trim() ? (
          <div className="w-full">
            <div className="px-4 mb-3 flex items-center justify-between">
              <h2 className="text-section-title font-black text-primary">
                Kết quả tìm kiếm
              </h2>
              <span className="text-[12px] font-medium text-subtitle">
                {searchResult.length} sản phẩm
              </span>
            </div>

            {searchResult.length > 0 ? (
              <ProductGrid products={searchResult} />
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
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-[12.5px] text-subtitle leading-relaxed mt-1 max-w-[260px]">
                  Không có sản phẩm nào phù hợp với từ khóa &ldquo;
                  <span className="text-primary font-semibold">{keyword}</span>
                  &rdquo;.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-2 rounded-full bg-primary text-white text-[12px] font-semibold shadow-xs active:scale-95 transition cursor-pointer"
                  >
                    Xóa tìm kiếm
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
        ) : (
          /* Initial State: Recommended Products */
          <div className="w-full">
            <div className="px-4 mb-3">
              <h2 className="text-section-title font-black text-primary">
                Sản phẩm nổi bật
              </h2>
              <span className="text-[12px] text-subtitle mt-0.5 block">
                Các sản phẩm chăm sóc sức khỏe tiêu biểu từ Opodis Pharma
              </span>
            </div>
            <ProductGrid products={recommendedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}

