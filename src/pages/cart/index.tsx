import CartList from "./cart-list";
import ApplyVoucher from "./apply-voucher";
import CartSummary from "./cart-summary";
import HorizontalDivider from "@/components/horizontal-divider";
import { useAtomValue } from "jotai";
import { cartState } from "@/state";
import { EmptyBoxIcon } from "@/components/vectors";
import SelectAll from "./select-all";

export default function CartPage() {
  const cart = useAtomValue(cartState);

  if (!cart.length) {
    return (
      <div className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-6 py-12 text-center">
        <EmptyBoxIcon />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground">Giỏ hàng của bạn đang trống</h3>
          <p className="text-xs text-subtitle">Hãy khám phá các sản phẩm y tế & chăm sóc sức khỏe chính hãng từ Opodis Pharma.</p>
        </div>
        <a
          href="/catalog"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-sm active:scale-95 transition-transform"
        >
          Khám phá sản phẩm ngay
        </a>
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
