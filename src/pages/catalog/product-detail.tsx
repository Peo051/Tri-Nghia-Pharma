import RelatedProducts from "@/pages/catalog/related-products";
import { useNavigate, useParams } from "react-router-dom";
import { formatPrice } from "@/utils/format";
import {
  getPrimaryCategory,
  getProductById,
  getRelatedProducts,
} from "@/utils/products";
import { useEffect, useMemo, useState } from "react";

function parseBulletPoints(items: string[]): string[] {
  return items.flatMap((item) => {
    if (!item) return [];
    if (item.includes("–") || item.includes("\n")) {
      return item
        .split(/(?:^|\n|(?<=[.!?])\s*)(?:–|-)\s*/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s !== "–" && s !== "-");
    }
    return [item.trim()].filter(Boolean);
  });
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = id ? getProductById(id) : undefined;

  const allImages = useMemo(() => {
    if (!product) return [];
    const images: string[] = [];
    if (product.image) images.push(product.image);
    if (product.gallery && product.gallery.length > 0) {
      product.gallery.forEach((img) => {
        if (!images.includes(img)) images.push(img);
      });
    }
    return images;
  }, [product]);

  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    if (product?.image) {
      setSelectedImage(product.image);
    } else if (allImages.length > 0) {
      setSelectedImage(allImages[0]);
    } else {
      setSelectedImage("");
    }
  }, [product?.id, allImages]);

  if (!product) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-section flex items-center justify-center text-subtitle mb-4">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="text-lg font-bold text-foreground mb-1.5">
          Không tìm thấy sản phẩm
        </h1>
        <p className="text-sm text-subtitle max-w-[260px] mb-6">
          Sản phẩm bạn đang tìm không tồn tại hoặc đã được thay đổi.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="min-h-[42px] px-6 py-2 rounded-pill bg-primary text-white font-semibold text-sm shadow-sm active:scale-95 transition cursor-pointer"
        >
          Về trang sản phẩm
        </button>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product.id, 4);
  const activeUses = parseBulletPoints(product.uses);
  const activeIngredientsList = parseBulletPoints(product.activeIngredients);
  const regularIngredientsList = parseBulletPoints(product.ingredients);
  const activeDirections = parseBulletPoints(product.directions);
  const activeWarnings = parseBulletPoints(product.warnings);
  const activeAdvantages = parseBulletPoints(product.advantages);

  const displayImage = selectedImage || product.image;
  const currentImageIndex = allImages.findIndex((img) => img === displayImage);

  return (
    <div className="w-full min-h-full pb-10 bg-background">
      {/* 1. Product Media & Gallery */}
      <div className="w-full px-4 pt-3 flex flex-col items-center">
        <div className="w-full max-w-[360px] aspect-square rounded-3xl bg-section/80 border border-border/70 p-5 flex items-center justify-center overflow-hidden relative shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          {displayImage ? (
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-contain transition-all duration-200"
              style={{
                viewTransitionName:
                  displayImage === product.image
                    ? `product-image-${product.id}`
                    : undefined,
              }}
            />
          ) : (
            <span className="text-center text-sm text-subtitle">
              Hình ảnh đang được cập nhật
            </span>
          )}

          {allImages.length > 1 && (
            <span className="absolute bottom-3 right-3 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-foreground/60 text-white backdrop-blur-sm">
              {currentImageIndex >= 0 ? currentImageIndex + 1 : 1} / {allImages.length}
            </span>
          )}
        </div>

        {/* Thumbnail Gallery Strip */}
        {allImages.length > 1 && (
          <div className="w-full max-w-[360px] flex items-center gap-2 overflow-x-auto no-scrollbar pt-2.5 pb-1 px-1">
            {allImages.map((img, index) => {
              const isSelected = img === displayImage;
              return (
                <button
                  key={img + index}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  aria-label={`Xem ảnh ${index + 1}`}
                  className={`w-14 h-14 rounded-xl border-2 overflow-hidden flex-none bg-section/80 p-1 cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "border-primary shadow-sm scale-105"
                      : "border-border/80 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Primary Summary Card */}
      <div className="px-4 pt-4 pb-2">
        <div className="inline-flex items-center space-x-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-primary-soft text-primary text-[11px] font-semibold tracking-wide uppercase">
            {getPrimaryCategory(product)}
          </span>
          {product.volume && (
            <span className="px-2 py-0.5 rounded-full bg-section text-subtitle text-[11px] font-medium border border-border/60">
              {product.volume.split(" và ")[0]}
            </span>
          )}
        </div>

        <h1 className="text-[20px] leading-[26px] font-bold text-foreground mt-1 tracking-tight">
          {product.name}
        </h1>

        <div className="mt-2.5 flex items-center justify-between">
          {product.price != null ? (
            <div className="flex flex-col">
              <span className="text-[11px] text-subtitle">Giá tham khảo</span>
              <span className="text-[20px] leading-tight font-bold text-primary-dark">
                {formatPrice(product.price)}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center px-3 py-1.5 rounded-xl bg-primary-soft text-primary text-[13px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
              Liên hệ tư vấn & báo giá
            </div>
          )}
        </div>

        {product.shortDescription && (
          <p className="text-[13px] leading-[20px] text-subtitle mt-2.5">
            {product.shortDescription}
          </p>
        )}
      </div>

      {/* 3. Specifications Card */}
      <div className="mx-4 mt-3 p-4 rounded-2xl bg-section/60 border border-border/70">
        <h2 className="text-[14px] font-bold text-foreground mb-3 uppercase tracking-wide text-primary">
          Thông tin sản phẩm
        </h2>
        <div className="space-y-2.5 text-[13px]">
          <div className="flex items-center justify-between">
            <span className="text-subtitle font-normal">Dòng sản phẩm</span>
            <span className="text-foreground font-semibold text-right max-w-[200px] truncate">
              {getPrimaryCategory(product)}
            </span>
          </div>

          {product.volume && (
            <>
              <div className="w-full h-[0.5px] bg-border/80" />
              <div className="flex items-center justify-between">
                <span className="text-subtitle font-normal">Dung tích / Quy cách</span>
                <span className="text-foreground font-medium text-right max-w-[200px]">
                  {product.volume}
                </span>
              </div>
            </>
          )}

          {product.packaging && (
            <>
              <div className="w-full h-[0.5px] bg-border/80" />
              <div className="flex items-start justify-between">
                <span className="text-subtitle font-normal flex-none">Đóng gói</span>
                <span className="text-foreground font-medium text-right ml-4">
                  {product.packaging}
                </span>
              </div>
            </>
          )}

          {product.registrationNumber && (
            <>
              <div className="w-full h-[0.5px] bg-border/80" />
              <div className="flex items-center justify-between">
                <span className="text-subtitle font-normal">Số Đăng Ký Y Tế</span>
                <span className="text-primary font-semibold font-mono">
                  {product.registrationNumber}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 4. Công dụng & Chỉ định */}
      {activeUses.length > 0 && (
        <div className="mx-4 mt-3.5 p-4 rounded-2xl bg-background border border-border/70 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center space-x-2 mb-2.5">
            <div className="w-6 h-6 rounded-lg bg-primary-soft text-primary flex items-center justify-center flex-none">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2 className="text-[15px] font-bold text-foreground">
              Công dụng & Chỉ định
            </h2>
          </div>
          <ul className="space-y-2 mt-2">
            {activeUses.map((useText, i) => (
              <li key={i} className="flex items-start text-[13px] leading-[19px] text-foreground/90">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2.5 flex-none" />
                <span>{useText}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 5. Thành phần & Hoạt chất */}
      {(activeIngredientsList.length > 0 || regularIngredientsList.length > 0) && (
        <div className="mx-4 mt-3.5 p-4 rounded-2xl bg-background border border-border/70 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center space-x-2 mb-2.5">
            <div className="w-6 h-6 rounded-lg bg-primary-soft text-primary flex items-center justify-center flex-none">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <h2 className="text-[15px] font-bold text-foreground">
              Thành phần & Hoạt chất
            </h2>
          </div>

          {activeIngredientsList.length > 0 && (
            <div className="mb-2">
              <span className="text-[12px] font-semibold text-primary block mb-1.5">
                Hoạt chất chính:
              </span>
              <ul className="space-y-1.5">
                {activeIngredientsList.map((ing, i) => (
                  <li key={i} className="flex items-start text-[13px] leading-[19px] text-foreground/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 mr-2 flex-none" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {regularIngredientsList.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-border/60">
              <span className="text-[12px] font-semibold text-subtitle block mb-1">
                Thành phần:
              </span>
              <p className="text-[13px] leading-[19px] text-foreground/85">
                {regularIngredientsList.join(", ")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 6. Hướng dẫn sử dụng */}
      {activeDirections.length > 0 && (
        <div className="mx-4 mt-3.5 p-4 rounded-2xl bg-background border border-border/70 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center space-x-2 mb-2.5">
            <div className="w-6 h-6 rounded-lg bg-primary-soft text-primary flex items-center justify-center flex-none">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h2 className="text-[15px] font-bold text-foreground">
              Hướng dẫn sử dụng
            </h2>
          </div>
          <div className="space-y-2 text-[13px] leading-[20px] text-foreground/90">
            {activeDirections.map((dir, i) => (
              <div key={i} className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-section text-primary font-bold text-[11px] flex items-center justify-center mr-2.5 flex-none mt-0.5 border border-border/60">
                  {i + 1}
                </span>
                <span className="flex-1">{dir}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Lưu ý & Bảo quản */}
      {activeWarnings.length > 0 && (
        <div className="mx-4 mt-3.5 p-4 rounded-2xl bg-section/50 border border-border/70">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center flex-none">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-[14px] font-bold text-foreground">
              Lưu ý & Bảo quản
            </h2>
          </div>
          <ul className="space-y-1.5 text-[12px] leading-[18px] text-subtitle">
            {activeWarnings.map((warn, i) => (
              <li key={i} className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary/70 mt-1.5 mr-2 flex-none" />
                <span>{warn}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 8. Ưu điểm nổi bật (nếu có) */}
      {activeAdvantages.length > 0 && (
        <div className="mx-4 mt-3.5 p-4 rounded-2xl bg-primary-soft/40 border border-primary/20">
          <h2 className="text-[14px] font-bold text-primary mb-2">
            Ưu điểm nổi bật
          </h2>
          <ul className="space-y-1.5 text-[13px] leading-[19px] text-foreground/90">
            {activeAdvantages.map((adv, i) => (
              <li key={i} className="flex items-start">
                <svg
                  className="w-4 h-4 text-primary mr-2 mt-0.5 flex-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 9. Contact / Tư vấn Opodis Pharma Banner */}
      <div className="mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-sm">
        <div className="flex items-center space-x-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-[11px] uppercase tracking-wider font-bold text-white/80">
            Tư vấn sản phẩm chính hãng
          </span>
        </div>
        <p className="text-[14px] font-bold text-white">
          Opodis Pharma — Khoa học & Dược thảo
        </p>
        <p className="text-[12px] text-white/85 mt-1 leading-relaxed">
          Quý khách cần tư vấn chuyên sâu hoặc báo giá phân phối số lượng lớn cho cơ sở y tế, vui lòng liên hệ:
        </p>
        <div className="mt-3 flex flex-wrap gap-2 pt-1 border-t border-white/15 text-[12px]">
          <a
            href="tel:02837582741"
            className="inline-flex items-center px-3 py-1.5 rounded-full bg-white text-primary font-bold text-[12px] shadow-sm active:scale-95 transition"
          >
            Hotline: (0283) 7582 741
          </a>
          <a
            href="https://opodispharma.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/15 text-white font-medium text-[12px] hover:bg-white/25 transition"
          >
            opodispharma.com ↗
          </a>
        </div>
      </div>

      {/* 10. Related Products */}
      {relatedProducts.length > 0 && (
        <section aria-labelledby="related-products-title" className="mt-6 pt-2">
          <div className="px-4 mb-3">
            <h2
              id="related-products-title"
              className="text-section-title font-bold text-foreground"
            >
              Sản phẩm cùng dòng
            </h2>
            <span className="text-[12px] text-subtitle mt-0.5 block">
              Các giải pháp chăm sóc sức khỏe liên quan
            </span>
          </div>
          <RelatedProducts products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
