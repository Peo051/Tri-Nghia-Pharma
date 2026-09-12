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
      className="flex flex-col cursor-pointer bg-background rounded-2xl p-2.5 border border-border/70 shadow-[0_1px_3px_rgba(0,0,0,0.02)] active:scale-[0.985] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      to={`/product/${props.product.id}`}
      replace={props.replace}
      onClick={() => setSelected(true)}
    >
      {({ isTransitioning }) => (
        <>
          {/* Image Container: 1:1 aspect ratio, object-contain, padding 12px, soft & clean background */}
          <div className="w-full aspect-square overflow-hidden rounded-xl bg-section/70 p-3 flex items-center justify-center">
            {props.product.image ? (
              <img
                src={props.product.image}
                className="w-full h-full object-contain transition-transform duration-200"
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

          {/* Product Content: Vertical rhythm (image -> 10px -> category -> 4px -> name -> 10px -> price) */}
          <div className="pt-2.5 pb-0.5 px-0.5 flex flex-col flex-1 justify-between">
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
              <h3 className="text-[14px] leading-[20px] font-medium text-foreground line-clamp-2 h-10">
                {props.product.name}
              </h3>
            </div>
            <div className="mt-2.5 pt-0.5 flex items-center justify-between">
              {props.product.price != null ? (
                <span className="text-[15px] leading-none font-bold text-primary-dark">
                  {formatPrice(props.product.price)}
                </span>
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
