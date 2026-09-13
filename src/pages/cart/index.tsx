import CartList from "./cart-list";
import ApplyVoucher from "./apply-voucher";
import CartSummary from "./cart-summary";
import HorizontalDivider from "@/components/horizontal-divider";
import { useAtomValue } from "jotai";
import { cartState } from "@/state";
import { EmptyBoxIcon } from "@/components/vectors";
import SelectAll from "./select-all";

import TransitionLink from "@/components/transition-link";

export default function CartPage() {
  const cart = useAtomValue(cartState);

  if (!cart.length) {
    return (
      <div className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-6 py-12 text-center">
        <EmptyBoxIcon />
        <div className="space-y-1">
          <h3 className="text-card-title text-foreground">Giỏ hàng của bạn đang trống</h3>
          <p className="text-[13px] text-subtitle leading-relaxed max-w-[280px]">
            Hãy khám phá các sản phẩm y tế & chăm sóc sức khỏe chính hãng từ Opodis Pharma.
          </p>
        </div>
        <TransitionLink
          to="/catalog"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-primary text-white text-[14px] font-semibold shadow-xs active:scale-95 transition-transform cursor-pointer"
        >
          Khám phá sản phẩm ngay
        </TransitionLink>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col">
      <SelectAll />
      <HorizontalDivider />
      <CartList />
      <HorizontalDivider />
      <ApplyVoucher />
      <HorizontalDivider />
      <CartSummary />
    </div>
  );
}
