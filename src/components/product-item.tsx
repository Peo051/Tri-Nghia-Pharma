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
}

export default function ProductItem(props: ProductItemProps) {
  const [selected, setSelected] = useState(false);

  return (
    <TransitionLink
      className="flex flex-col cursor-pointer bg-background rounded-2xl p-2.5 border border-border/70 shadow-[0_1px_3px_rgba(0,0,0,0.02)] active:scale-[0.985] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary relative"
      to={`/product/${props.product.id}`}
      replace={props.replace}
      onClick={() => setSelected(true)}
    >
      {({ isTransitioning }) => (
        <>
          {/* Image Container: clean 1:1 aspect ratio, padding 10px, object-contain, hover subtle scale */}
          <div className="w-full aspect-square overflow-hidden rounded-xl bg-section/70 p-2.5 flex items-center justify-center relative group">
            {/* Promotion / Discount Badge */}
            {props.product.discountPercent ? (
              <span className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded-md bg-secondary text-white text-[10px] font-bold shadow-xs">
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
                className="w-full h-full max-h-full max-w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
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
              <span className="text-center text-xs text-subtitle">
                Hình ảnh đang được cập nhật
              </span>
            )}
          </div>

          {/* Product Content */}
          <div className="pt-2 pb-0.5 px-0.5 flex flex-col flex-1 justify-between">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] leading-4 text-primary font-semibold tracking-wide uppercase truncate">
                  {getPrimaryCategory(props.product)}
                </span>
                {props.product.volume && (
                  <span className="text-[10px] text-subtitle/90 bg-section px-1.5 py-0.5 rounded font-normal flex-none truncate max-w-[80px]">
                    {props.product.volume.split(" và ")[0]}
                  </span>
                )}
              </div>
              <h3 className="text-[13.5px] leading-[19px] font-medium text-foreground line-clamp-2 min-h-[38px]">
                {props.product.name}
              </h3>

              {/* Social Proof: Rating & Sold count */}
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-subtitle">
                {props.product.rating && (
                  <div className="flex items-center text-amber-500 font-bold">
                    <span>★</span>
                    <span className="ml-0.5 text-foreground text-[11px]">
                      {props.product.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                {props.product.soldCount && (
                  <>
                    <span className="text-border">|</span>
                    <span className="truncate">
                      Đã bán{" "}
                      {props.product.soldCount >= 1000
                        ? `${(props.product.soldCount / 1000).toFixed(1)}k`
                        : props.product.soldCount}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Price section with optional strike-through */}
            <div className="mt-2 pt-0.5 flex items-baseline justify-between gap-1 flex-wrap">
              {props.product.price != null ? (
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-[15px] leading-none font-bold text-primary-dark">
                    {formatPrice(props.product.price)}
                  </span>
                  {props.product.originalPrice &&
                    props.product.originalPrice > props.product.price && (
                      <span className="text-[11px] leading-none text-subtitle line-through">
                        {formatPrice(props.product.originalPrice)}
                      </span>
                    )}
                </div>
              ) : (
                <span className="inline-flex items-center text-[13px] leading-none font-semibold text-primary">
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
