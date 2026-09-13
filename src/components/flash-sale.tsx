import { useEffect, useMemo, useState } from "react";
import { Product } from "@/domain/product";
import { formatPrice } from "@/utils/format";
import TransitionLink from "./transition-link";

interface FlashSaleProps {
  products: Product[];
  className?: string;
}

export default function FlashSale({ products, className = "" }: FlashSaleProps) {
  // Lấy các sản phẩm có discountPercent hoặc promotionBadge hoặc giá ưu đãi
  const flashSaleItems = useMemo(() => {
    return products
      .filter((p) => p.discountPercent && p.discountPercent > 0 && p.price)
      .slice(0, 6);
  }, [products]);

  // Bộ đếm ngược cho flash sale (ví dụ: 03 giờ 45 phút 20 giây)
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num: number) => num.toString().padStart(2, "0");

  if (flashSaleItems.length === 0) return null;

  return (
    <section className={`mx-4 mt-5 ${className}`} aria-labelledby="flash-sale-heading">
      {/* Header Flash Sale */}
      <div className="relative overflow-hidden rounded-t-xl bg-gradient-to-r from-[#0a4622] via-[#116936] to-[#22a458] p-3.5 flex items-center justify-between text-white shadow-sm">
        {/* Decorative lighting elements for radiant depth */}
        <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-6 w-24 h-24 bg-[#34d399]/15 rounded-full blur-lg pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/20 shadow-inner backdrop-blur-xs">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#facc15"
              className="animate-bounce drop-shadow-[0_0_4px_rgba(250,204,21,0.6)]"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <h2 id="flash-sale-heading" className="text-[15px] font-black tracking-wide text-white uppercase flex items-center gap-1.5 font-display">
              Flash Sale
            </h2>
            <span className="text-[10px] text-[#0d542b] bg-white font-black px-2 py-0.5 rounded-md inline-block mt-0.5 shadow-xs">
              Giá sốc trong ngày
            </span>
          </div>
        </div>

        {/* Countdown timer */}
        <div className="relative z-10 flex items-center gap-1 text-[11px] font-bold">
          <span className="text-white/90 mr-0.5 hidden sm:inline">Kết thúc trong:</span>
          <span className="min-w-[24px] h-[22px] px-1 rounded-md bg-[#b91c1c] text-white text-center font-mono font-black text-[12px] flex items-center justify-center shadow-xs border border-white/20">
            {formatDigit(timeLeft.hours)}
          </span>
          <span className="text-white font-black">:</span>
          <span className="min-w-[24px] h-[22px] px-1 rounded-md bg-[#b91c1c] text-white text-center font-mono font-black text-[12px] flex items-center justify-center shadow-xs border border-white/20">
            {formatDigit(timeLeft.minutes)}
          </span>
          <span className="text-white font-black">:</span>
          <span className="min-w-[24px] h-[22px] px-1 rounded-md bg-[#b91c1c] text-white text-center font-mono font-black text-[12px] flex items-center justify-center shadow-xs border border-white/20">
            {formatDigit(timeLeft.seconds)}
          </span>
        </div>
      </div>

      {/* Product list horizontal carousel */}
      <div className="bg-surface rounded-b-xl border-x border-b border-border/80 p-3 shadow-sm">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 pt-0.5">
          {flashSaleItems.map((product) => {
            const soldRate = product.soldCount
              ? Math.min(92, Math.max(35, Math.round((product.soldCount % 100) + 15)))
              : 65;

            return (
              <TransitionLink
                key={product.id}
                to={`/product/${product.id}`}
                className="w-[140px] flex-none flex flex-col bg-white rounded-xl p-2 border border-border/70 shadow-xs hover:border-primary/50 active:scale-95 transition-all group"
              >
                {/* Image container */}
                <div className="w-full aspect-square rounded-lg bg-white border border-border/50 p-2 overflow-hidden relative flex items-center justify-center">
                  {product.discountPercent && (
                    <span className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded bg-[#c81e1e] text-white text-[10px] font-black shadow-xs">
                      -{product.discountPercent}%
                    </span>
                  )}
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[10px] text-black/60 p-1 text-center">
                      Hình đang cập nhật
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="mt-2 flex flex-col flex-1 justify-between">
                  <h3 className="text-[12px] leading-4 font-bold text-black min-h-[32px]">
                    {product.name}
                  </h3>

                  <div className="mt-1.5">
                    {/* Price */}
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <span className="text-[13px] font-black text-primary">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    {product.originalPrice && (
                      <span className="text-[10px] text-black/60 line-through block -mt-0.5">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}

                    {/* Progress bar số lượng bán: dải màu gradient xanh thảo dược Opodis */}
                    <div className="mt-2 w-full bg-primary-soft rounded-full h-4 overflow-hidden relative flex items-center justify-center border border-primary/25">
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#0d542b] via-[#116936] to-[#22a458] rounded-full transition-all duration-500"
                        style={{ width: `${soldRate}%` }}
                      />
                      <span
                        className="relative z-10 text-[9.5px] font-black uppercase tracking-wider text-white"
                        style={{
                          textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
                        }}
                      >
                        ĐÃ BÁN {soldRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </TransitionLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
