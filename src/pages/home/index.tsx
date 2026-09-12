import { useMemo, useState } from "react";
import { products } from "@/mock/products";
import Banners from "./banners";
import CategoryFilter from "./category-filter";
import ProductGrid from "@/components/product-grid";
import opodisLogo from "@/static/logo-opodis.png";
import FlashSale from "@/components/flash-sale";
import Pagination from "@/components/pagination";

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
      { id: "solution", label: "Dung dịch...", count: solutionProducts.length },
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

      {/* Flash Sale cho một số sản phẩm nổi bật */}
      <FlashSale products={products} />

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
              <div className="px-4 mb-2.5 flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-black text-primary flex items-center gap-1.5">
                    <span>⭐</span>
                    <span>Sản phẩm nổi bật</span>
                  </h3>
                  <p className="text-[11.5px] text-subtitle">
                    Sản phẩm tiêu biểu được tin dùng hàng đầu của Opodis
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectCategory("featured")}
                  className="text-[11.5px] font-bold text-primary hover:text-primary-dark transition flex items-center gap-0.5 flex-none cursor-pointer"
                >
                  <span>Xem tất cả ({featuredProducts.length})</span>
                  <span>→</span>
                </button>
              </div>
              <ProductGrid products={featuredProducts.slice(0, 4)} />
            </div>

            {/* Khối 2: Sản phẩm bán chạy */}
            <div>
              <div className="px-4 mb-2.5 flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-black text-primary flex items-center gap-1.5">
                    <span>🔥</span>
                    <span>Sản phẩm bán chạy</span>
                  </h3>
                  <p className="text-[11.5px] text-subtitle">
                    Lượt mua cao nhất từ bệnh viện & người tiêu dùng
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectCategory("best-seller")}
                  className="text-[11.5px] font-bold text-primary hover:text-primary-dark transition flex items-center gap-0.5 flex-none cursor-pointer"
                >
                  <span>Xem tất cả ({bestSellerProducts.length})</span>
                  <span>→</span>
                </button>
              </div>
              <ProductGrid products={bestSellerProducts.slice(0, 4)} />
            </div>

            {/* Khối 3: Dung dịch... */}
            <div>
              <div className="px-4 mb-2.5 flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-black text-primary flex items-center gap-1.5">
                    <span>🧴</span>
                    <span>Dung dịch...</span>
                  </h3>
                  <p className="text-[11.5px] text-subtitle">
                    Dung dịch vệ sinh, chăm sóc thảo dược và sát khuẩn
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectCategory("solution")}
                  className="text-[11.5px] font-bold text-primary hover:text-primary-dark transition flex items-center gap-0.5 flex-none cursor-pointer"
                >
                  <span>Xem tất cả ({solutionProducts.length})</span>
                  <span>→</span>
                </button>
              </div>
              <ProductGrid products={solutionProducts.slice(0, 4)} />
            </div>

            {/* Khối 4: Khử khuẩn */}
            <div>
              <div className="px-4 mb-2.5 flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-black text-primary flex items-center gap-1.5">
                    <span>🛡️</span>
                    <span>Khử khuẩn</span>
                  </h3>
                  <p className="text-[11.5px] text-subtitle">
                    Chế phẩm diệt khuẩn y tế, khử khuẩn tay và bề mặt
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectCategory("disinfection")}
                  className="text-[11.5px] font-bold text-primary hover:text-primary-dark transition flex items-center gap-0.5 flex-none cursor-pointer"
                >
                  <span>Xem tất cả ({disinfectionProducts.length})</span>
                  <span>→</span>
                </button>
              </div>
              <ProductGrid products={disinfectionProducts.slice(0, 4)} />
            </div>
          </div>
        ) : (
          /* Khi chọn từng nhóm cụ thể: Hiển thị danh sách đầy đủ có phân trang */
          <div>
            <div className="px-4 mb-3 flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-section-title font-black text-primary tracking-tight">
                  {selectedCategory === "featured"
                    ? "⭐ Sản phẩm nổi bật"
                    : selectedCategory === "best-seller"
                    ? "🔥 Sản phẩm bán chạy"
                    : selectedCategory === "solution"
                    ? "🧴 Dung dịch..."
                    : selectedCategory === "disinfection"
                    ? "🛡️ Khử khuẩn"
                    : "Tất cả sản phẩm"}
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
    </div>
  );
};

export default HomePage;
