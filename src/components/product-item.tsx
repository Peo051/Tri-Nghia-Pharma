import { Product } from "@/domain/product";
import { formatPrice } from "@/utils/format";
import { getPrimaryCategory } from "@/utils/products";
import TransitionLink from "./transition-link";
import { useState } from "react";

export interface ProductItemProps {
  product: Product;
  /**
   * Whether to replace the current page when user clicks on this product item. Default behavior is to push a new page to the history stack.
   * This prop should be used when navigating to a new product detail from a current product detail page (related products, etc.)
   */
  replace?: boolean;
  className?: string;
}

export default function ProductItem(props: ProductItemProps) {
  const [selected, setSelected] = useState(false);

  return (
    <TransitionLink
      className={`flex flex-col cursor-pointer bg-white rounded-card p-3 border border-border/70 shadow-card active:scale-[0.985] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary relative h-full ${props.className ?? ""}`}
      to={`/product/${props.product.id}`}
      replace={props.replace}
      onClick={() => setSelected(true)}
    >
      {({ isTransitioning }) => (
        <>
          {/* Normalized Image Container: 1:1 aspect ratio, object-contain with 12px padding, packaging fills ~80% */}
          <div className="w-full aspect-square overflow-hidden rounded-xl bg-white border border-border/50 p-3 flex items-center justify-center relative group">
            {/* Promotion / Discount Badge */}
            {props.product.discountPercent ? (
              <span className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded-md bg-[#c81e1e] text-white text-[10px] font-bold shadow-xs">
                -{props.product.discountPercent}%
              </span>
            ) : props.product.promotionBadge ? (
              <span className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded-md bg-primary text-white text-[10px] font-bold shadow-xs">
                {props.product.promotionBadge}
              </span>
            ) : null}

            {props.product.image ? (
              <img
                src={props.product.image}
                className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                style={{
                  viewTransitionName:
                    isTransitioning && selected
                      ? `product-image-${props.product.id}`
                      : undefined,
                }}
                alt={props.product.name}
                loading="lazy"
              />
            ) : (
              <span className="text-center text-xs text-subtitle p-2">
                Hình ảnh đang được cập nhật
              </span>
            )}
          </div>

          {/* Product Content: Category ↓ Product name ↓ Volume ↓ Price */}
          <div className="pt-2 pb-0.5 px-0.5 flex flex-col flex-1 justify-between">
            <div>
              {/* Category (Eyebrow 11px / 700) */}
              <div className="text-[11px] leading-4 text-primary font-bold tracking-wider uppercase truncate">
                {getPrimaryCategory(props.product)}
              </div>

              {/* Product name (14px / 600) */}
              <h3 className="text-[14px] leading-[20px] font-semibold text-foreground line-clamp-2 min-h-[40px] mt-1">
                {props.product.name}
              </h3>

              {/* Volume (Metadata 12px / 400) */}
              <p className="text-[12px] leading-4 text-subtitle font-normal mt-1 truncate">
                {props.product.volume || "Quy cách chuẩn"}
              </p>
            </div>

            {/* Price (Card title / Price 15px / 600) */}
            <div className="mt-2.5 pt-1.5 border-t border-border/40 flex items-baseline justify-between gap-1 flex-wrap">
              {props.product.price != null ? (
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-[15px] leading-none font-semibold text-primary-dark">
                    {formatPrice(props.product.price)}
                  </span>
                  {props.product.originalPrice &&
                    props.product.originalPrice > props.product.price && (
                      <span className="text-[12px] leading-none text-subtitle line-through">
                        {formatPrice(props.product.originalPrice)}
                      </span>
                    )}
                </div>
              ) : (
                <span className="inline-flex items-center text-[14px] leading-none font-semibold text-primary">
                  Liên hệ
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </TransitionLink>
  );
}
