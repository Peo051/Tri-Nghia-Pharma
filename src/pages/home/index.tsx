import { useMemo, useState } from "react";
import { products } from "@/mock/products";
import { Product } from "@/domain/product";
import Banners from "./banners";
import CategoryFilter from "./category-filter";
import ProductGrid from "@/components/product-grid";
import ProductItem from "@/components/product-item";
import opodisLogo from "@/static/logo-opodis.png";
import FlashSale from "@/components/flash-sale";
import Pagination from "@/components/pagination";
import FollowOAWidget from "@/components/follow-oa-card";

const ITEMS_PER_PAGE = 8;

const FEATURED_IDS = new Set([
  "phytobebe",
  "sp5",
  "clincare",
  "sp3",
  "sp6",
  "sp9",
  "opolux",
  "opflu",
]);

const SOLUTION_IDS = new Set([
  "sp5",
  "sp4",
  "sp6",
  "sp7",
  "sp8",
  "phytogyno-mom",
  "opolux",
  "phytobebe",
  "sp9",
  "clinsoap",
]);

const DISINFECTION_IDS = new Set([
  "clincare",
  "clincare-2",
  "clincare-4",
  "clincare-sh-2",
  "clinhands-gel",
  "clinsoap",
  "opodex-70",
  "phytasep",
]);

interface ProductRowProps {
  products: Product[];
  onViewAll: () => void;
  pinkAccent?: boolean;
}

function ProductRow({ products, onViewAll, pinkAccent }: ProductRowProps) {
  return (
    <div className="w-full flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2 pt-0.5 scroll-px-4 items-stretch">
      {products.map((product) => (
        <div key={product.id} className="w-[158px] flex-none flex flex-col">
          <ProductItem product={product} />
        </div>
      ))}
      <button
        type="button"
        onClick={onViewAll}
        className={`w-[110px] flex-none rounded-2xl border border-dashed flex flex-col items-center justify-center p-3 text-center transition active:scale-95 cursor-pointer my-0.5 ${
          pinkAccent
            ? "border-pink-300 bg-pink-50/50 hover:bg-pink-100/70 text-pink-600"
            : "border-primary/30 bg-primary-soft/40 hover:bg-primary-soft/70 text-primary"
        }`}
      >
        <div
          className={`w-9 h-9 rounded-full shadow-xs border flex items-center justify-center mb-2 ${
            pinkAccent
              ? "bg-white border-pink-200 text-pink-600"
              : "bg-white border-primary/20 text-primary"
          }`}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
        <span className="text-[11.5px] font-bold">Xem tất cả</span>
        <span className="text-[10px] text-subtitle mt-0.5">
          {products.length} sản phẩm
        </span>
      </button>
      <div className="w-1 flex-none h-1 pointer-events-none" aria-hidden="true" />
    </div>
  );
}

const HomePage: React.FunctionComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 1. Phân nhóm sản phẩm theo yêu cầu
  const featuredProducts = useMemo(() => {
    return products.filter((p) => FEATURED_IDS.has(p.id));
  }, []);

  const bestSellerProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0))
      .slice(0, 10);
  }, []);

  const solutionProducts = useMemo(() => {
    return products.filter((p) => SOLUTION_IDS.has(p.id));
  }, []);

  const disinfectionProducts = useMemo(() => {
    return products.filter((p) => DISINFECTION_IDS.has(p.id));
  }, []);

  // Reset trang về 1 và cuộn mượt khi đổi danh mục
  const handleSelectCategory = (cat: string) => {
    let target = cat;
    const catUpper = cat.toUpperCase();
    if (catUpper.includes("KHỬ KHUẨN")) {
      target = "disinfection";
    } else if (catUpper.includes("MẸ VÀ BÉ") || catUpper.includes("GIA ĐÌNH")) {
      target = "solution";
    } else if (catUpper.includes("PREMIUM")) {
      target = "featured";
    }

    setSelectedCategory(target);
    setCurrentPage(1);

    const el = document.getElementById("home-products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const categoryOptions = useMemo(
    () => [
      { id: "all", label: "Tất cả", count: products.length },
      { id: "featured", label: "Sản phẩm nổi bật", count: featuredProducts.length },
      { id: "best-seller", label: "Sản phẩm bán chạy", count: bestSellerProducts.length },
      {
        id: "solution",
        label: "Dung dịch",
        count: solutionProducts.length,
        activeClassName: "bg-pink-600 text-white font-semibold shadow-sm",
        inactiveClassName:
          "bg-pink-50/90 text-pink-700 hover:bg-pink-100 border border-pink-200/80 font-medium",
      },
      { id: "disinfection", label: "Khử khuẩn", count: disinfectionProducts.length },
    ],
    [
      featuredProducts.length,
      bestSellerProducts.length,
      solutionProducts.length,
      disinfectionProducts.length,
    ]
  );

  const filteredProducts = useMemo(() => {
    switch (selectedCategory) {
      case "featured":
        return featuredProducts;
      case "best-seller":
        return bestSellerProducts;
      case "solution":
        return solutionProducts;
      case "disinfection":
        return disinfectionProducts;
      case "all":
      default:
        return products;
    }
  }, [
    selectedCategory,
    featuredProducts,
    bestSellerProducts,
    solutionProducts,
    disinfectionProducts,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <div className="w-full min-h-full pb-6">
      {/* 1. Promotional Carousel */}
      <Banners onSelectCategory={handleSelectCategory} />

      {/* 2. Flash Sale cho một số sản phẩm nổi bật */}
      <FlashSale products={products} />

      {/* 3. Official information notice */}
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

      {/* 4. Category Filter Tabs */}
      <section id="home-categories" className="mt-5">
        <div className="px-4 mb-2 flex items-center justify-between">
          <h2 className="text-section-title font-black text-primary tracking-tight">
            Phân loại sản phẩm
          </h2>
          {selectedCategory !== "all" && (
            <button
              type="button"
              onClick={() => handleSelectCategory("all")}
              className="text-[12px] font-semibold text-primary hover:text-primary-dark transition cursor-pointer"
            >
              Xem tất cả nhóm
            </button>
          )}
        </div>
        <CategoryFilter
          options={categoryOptions}
          selectedId={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      </section>

      {/* 5. Products Section */}
      <section id="home-products" className="w-full mt-5">
        {selectedCategory === "all" ? (
          /* Khi chọn Tất cả: Chia theo 4 khối sản phẩm trực quan */
          <div className="space-y-6">
            {/* Khối 1: Sản phẩm nổi bật */}
            <div>
              <div className="px-4 mb-2.5">
                <h3 className="text-[16px] font-black text-primary">
                  Sản phẩm <span className="text-pink-600">nổi bật</span>
                </h3>
                <p className="text-[11.5px] text-subtitle">
                  Sản phẩm <span className="text-pink-600 font-medium">tiêu biểu</span> được tin dùng hàng đầu của Opodis
                </p>
              </div>
              <ProductRow
                products={featuredProducts}
                onViewAll={() => handleSelectCategory("featured")}
              />
            </div>

            {/* Khối 2: Sản phẩm bán chạy */}
            <div>
              <div className="px-4 mb-2.5">
                <h3 className="text-[16px] font-black text-primary">
                  Sản phẩm <span className="text-pink-600">bán chạy</span>
                </h3>
                <p className="text-[11.5px] text-subtitle">
                  Lượt mua cao nhất từ <span className="text-pink-600 font-medium">bệnh viện & người tiêu dùng</span>
                </p>
              </div>
              <ProductRow
                products={bestSellerProducts}
                onViewAll={() => handleSelectCategory("best-seller")}
              />
            </div>

            {/* Khối 3: Dung dịch */}
            <div>
              <div className="px-4 mb-2.5">
                <h3 className="text-[16px] font-black text-pink-600">
                  Dung dịch
                </h3>
                <p className="text-[11.5px] text-subtitle">
                  Dung dịch vệ sinh, <span className="text-pink-600 font-medium">chăm sóc thảo dược</span> và dịu nhẹ
                </p>
              </div>
              <ProductRow
                products={solutionProducts}
                onViewAll={() => handleSelectCategory("solution")}
                pinkAccent
              />
            </div>

            {/* Khối 4: Khử khuẩn */}
            <div>
              <div className="px-4 mb-2.5">
                <h3 className="text-[16px] font-black text-primary">
                  Khử khuẩn
                </h3>
                <p className="text-[11.5px] text-subtitle">
                  Chế phẩm diệt khuẩn y tế, khử khuẩn tay và bề mặt <span className="text-pink-600 font-medium">chuẩn Bộ Y Tế</span>
                </p>
              </div>
              <ProductRow
                products={disinfectionProducts}
                onViewAll={() => handleSelectCategory("disinfection")}
              />
            </div>
          </div>
        ) : (
          /* Khi chọn từng nhóm cụ thể: Hiển thị danh sách đầy đủ có phân trang */
          <div>
            <div className="px-4 mb-3 flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-section-title font-black text-primary tracking-tight">
                  {selectedCategory === "featured" ? (
                    <>
                      Sản phẩm <span className="text-pink-600">nổi bật</span>
                    </>
                  ) : selectedCategory === "best-seller" ? (
                    <>
                      Sản phẩm <span className="text-pink-600">bán chạy</span>
                    </>
                  ) : selectedCategory === "solution" ? (
                    <span className="text-pink-600">Dung dịch</span>
                  ) : selectedCategory === "disinfection" ? (
                    "Khử khuẩn"
                  ) : (
                    "Tất cả sản phẩm"
                  )}
                </h2>
                <span className="text-[12px] text-subtitle mt-0.5">
                  {filteredProducts.length} sản phẩm Opodis Pharma chính hãng
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleSelectCategory("all")}
                className="text-[12px] font-semibold text-primary hover:text-primary-dark transition cursor-pointer flex items-center gap-1"
              >
                <span>← Xem tất cả nhóm</span>
              </button>
            </div>

            {paginatedProducts.length > 0 ? (
              <>
                <ProductGrid products={paginatedProducts} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    const el = document.getElementById("home-products");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                />
              </>
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
          </div>
        )}
      </section>

      {/* Khối Quan tâm Zalo OA */}
      <section className="px-4 mt-6 mb-8">
        <FollowOAWidget />
      </section>
    </div>
  );
};

export default HomePage;
