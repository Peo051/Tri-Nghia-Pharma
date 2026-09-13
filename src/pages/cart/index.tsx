import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import QuantityInput from "@/components/quantity-input";
import TransitionLink from "@/components/transition-link";
import { useCustomerSupport } from "@/hooks";
import {
  cartProductItemsState,
  cartState,
  cartTotalState,
} from "@/state";
import { formatPrice } from "@/utils/format";
import { EmptyBoxIcon, RemoveIcon } from "@/components/vectors";

export default function CartPage() {
  const cart = useAtomValue(cartState);
  const cartItems = useAtomValue(cartProductItemsState);
  const { totalItems, totalAmount } = useAtomValue(cartTotalState);
  const setCart = useSetAtom(cartState);
  const contact = useCustomerSupport();

  useEffect(() => {
    if (cartItems.length === cart.length) {
      return;
    }

    setCart(
      cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }))
    );
  }, [cart, cartItems, setCart]);

  const updateQuantity = (productId: string, quantity: number) => {
    const safeQuantity =
      Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: safeQuantity }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.productId !== productId)
    );
  };

  if (!cartItems.length) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-6 py-12 text-center">
        <EmptyBoxIcon />
        <div className="space-y-1">
          <h1 className="text-card-title text-foreground">
            Giỏ hàng của bạn đang trống
          </h1>
          <p className="text-[13px] text-subtitle leading-relaxed max-w-[280px]">
            Hãy khám phá các sản phẩm chăm sóc sức khỏe từ Opodis Pharma.
          </p>
        </div>
        <TransitionLink
          to="/catalog"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-primary text-white text-[14px] font-semibold shadow-xs active:scale-95 transition-transform cursor-pointer font-display"
        >
          Khám phá sản phẩm ngay
        </TransitionLink>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full bg-background pb-5 pt-3">
      <div className="mx-4 overflow-hidden rounded-xl border border-border/70 bg-white shadow-xs">
        {cartItems.map((item, index) => (
          <article
            key={item.product.id}
            className={[
              "flex gap-3 p-3.5",
              index < cartItems.length - 1 ? "border-b border-border/60" : "",
            ].join(" ")}
          >
            <div className="h-20 w-20 flex-none overflow-hidden rounded-lg border border-border/60 bg-section/50 p-1.5">
              {item.product.image ? (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-center text-[10px] text-subtitle">
                  Hình đang cập nhật
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <h2 className="line-clamp-2 text-[14px] font-semibold leading-5 text-foreground">
                    {item.product.name}
                  </h2>
                  {item.product.volume && (
                    <p className="mt-0.5 truncate text-[11px] text-subtitle">
                      {item.product.volume}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.product.id)}
                  aria-label={"Xóa " + item.product.name + " khỏi giỏ hàng"}
                  className="flex h-7 w-7 flex-none items-center justify-center rounded-lg text-subtitle hover:bg-danger/10 hover:text-danger active:scale-90 transition"
                >
                  <RemoveIcon />
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[14px] font-bold text-primary-dark font-display">
                    {formatPrice(item.unitPrice)}
                  </p>
                  {item.product.originalPrice &&
                    item.product.originalPrice > item.unitPrice && (
                      <p className="text-[10px] text-subtitle line-through">
                        {formatPrice(item.product.originalPrice)}
                      </p>
                    )}
                </div>
                <QuantityInput
                  value={item.quantity}
                  minValue={1}
                  onChange={(quantity) =>
                    updateQuantity(item.product.id, quantity)
                  }
                />
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="mx-4 mt-4 rounded-xl border border-border/70 bg-surface p-4 shadow-xs">
        <div className="flex items-center justify-between text-[12px] text-subtitle">
          <span>Tạm tính ({totalItems} sản phẩm)</span>
          <span>{formatPrice(totalAmount)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-3">
          <span className="text-[14px] font-semibold text-foreground">
            Tổng cộng
          </span>
          <span className="text-[19px] font-black text-primary-dark font-display">
            {formatPrice(totalAmount)}
          </span>
        </div>
        <button
          type="button"
          onClick={contact}
          disabled={totalItems === 0}
          className="mt-4 flex min-h-[44px] w-full items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 font-display"
        >
          Liên hệ đặt hàng
        </button>
      </section>
    </div>
  );
}
