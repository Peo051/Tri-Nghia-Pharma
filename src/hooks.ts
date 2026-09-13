import { useSetAtom } from "jotai";
import { MutableRefObject, useLayoutEffect, useState } from "react";
import toast from "react-hot-toast";
import { UIMatch, useMatches } from "react-router-dom";
import { Product } from "@/domain/product";
import { cartState } from "@/state";
import { getConfig } from "@/utils/template";
import { openChat } from "zmp-sdk";

export function useRealHeight(
  element: MutableRefObject<HTMLDivElement | null>,
  defaultValue?: number
) {
  const [height, setHeight] = useState(defaultValue ?? 0);

  useLayoutEffect(() => {
    if (!element.current || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const [{ contentRect }] = entries;
      setHeight(contentRect.height);
    });
    observer.observe(element.current);

    return () => observer.disconnect();
  }, [element]);

  return typeof ResizeObserver === "undefined" ? -1 : height;
}

/**
 * Adds an Opodis product to the cart.
 */
export function useAddToCart(product: Product | undefined) {
  const setCart = useSetAtom(cartState);

  const addToCart = (quantity = 1) => {
    if (!product) {
      return;
    }

    const safeQuantity =
      Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;

    setCart((cart) => {
      const existing = cart.find((item) => item.productId === product.id);

      if (existing) {
        return cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + safeQuantity }
            : item
        );
      }

      return [...cart, { productId: product.id, quantity: safeQuantity }];
    });

    toast.success("Đã thêm " + product.name + " vào giỏ hàng", {
      duration: 2200,
    });
  };

  return { addToCart };
}

export function useCustomerSupport() {
  return () =>
    openChat({
      type: "oa",
      id: getConfig((config) => config.template.oaIDtoOpenChat),
    });
}

export function useRouteHandle() {
  const matches = useMatches() as UIMatch<
    undefined,
    {
      title?: string | ((...args: never[]) => string | undefined);
      logo?: boolean;
      back?: boolean;
      scrollRestoration?: number;
    }
  >[];
  const lastMatch = matches[matches.length - 1];

  return [lastMatch.handle, lastMatch, matches] as const;
}
