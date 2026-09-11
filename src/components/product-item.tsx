import { Product } from "@/domain/product";
import { formatPrice } from "@/utils/format";
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
      className="flex flex-col cursor-pointer group bg-background rounded-card p-2 border border-border/80 shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-md transition-all active:scale-[0.98]"
      to={`/product/${props.product.id}`}
      replace={props.replace}
      onClick={() => setSelected(true)}
    >
      {({ isTransitioning }) => (
        <>
          <div className="w-full aspect-square overflow-hidden rounded-image bg-section flex items-center justify-center">
            <img
              src={props.product.image}
              className="w-full h-full object-cover rounded-image transition-transform duration-200 group-hover:scale-105"
              style={{
                viewTransitionName:
                  isTransitioning && selected
                    ? `product-image-${props.product.id}`
                    : undefined,
              }}
              alt={props.product.name}
              loading="lazy"
            />
          </div>
          <div className="pt-2 pb-1 flex flex-col flex-1 justify-between">
            <div>
              <div className="text-product-category truncate mb-0.5">
                {props.product.category}
              </div>
              <h3 className="text-product-name line-clamp-2 h-10 font-medium">
                {props.product.name}
              </h3>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-product-price">
                {formatPrice(props.product.price)}
              </span>
              {props.product.volume && (
                <span className="text-[11px] text-subtitle font-normal px-1.5 py-0.5 rounded-pill bg-section">
                  {props.product.volume}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </TransitionLink>
  );
}
