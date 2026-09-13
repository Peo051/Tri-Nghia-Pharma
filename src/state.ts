import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Cart } from "@/domain/cart";
import { Product } from "@/domain/product";
import { products } from "@/mock/products";
import { searchProducts } from "@/utils/products";

export interface CartProductItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export const cartState = atomWithStorage<Cart>("opodis_cart", []);

/**
 * Resolves local cart entries against the current catalogue. Invalid product
 * IDs are omitted deliberately so a stale entry cannot break the cart UI.
 */
export const cartProductItemsState = atom<CartProductItem[]>((get) => {
  const cart = get(cartState);

  return cart.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    if (!product) {
      return [];
    }

    const quantity =
      Number.isFinite(item.quantity) && item.quantity > 0
        ? Math.floor(item.quantity)
        : 1;
    const unitPrice =
      typeof product.price === "number" && Number.isFinite(product.price)
        ? product.price
        : 0;

    return [
      {
        product,
        quantity,
        unitPrice,
        lineTotal: unitPrice * quantity,
      },
    ];
  });
});

export const cartTotalState = atom((get) => {
  const items = get(cartProductItemsState);

  return {
    totalItems: items.reduce((total, item) => total + item.quantity, 0),
    totalAmount: items.reduce((total, item) => total + item.lineTotal, 0),
  };
});

export const keywordState = atom("");

export const searchResultState = atom((get) => searchProducts(get(keywordState)));
