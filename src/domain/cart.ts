/**
 * Cart state for Opodis Pharma Mini App.
 *
 * A product is resolved from the current Opodis catalogue at render time.
 */
export interface CartItem {
  productId: string;
  quantity: number;
}

export type Cart = CartItem[];
