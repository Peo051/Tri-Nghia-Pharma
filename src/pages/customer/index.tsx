import FollowOAWidget from "@/components/follow-oa-card";
import TransitionLink from "@/components/transition-link";

export default function CustomerPage() {
  return (
    <div className="min-h-full bg-background px-4 py-5 pb-8">
      <section className="rounded-3xl border border-border/70 bg-surface p-5 shadow-[0_2px_10px_rgba(17,105,54,0.05)]">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
          Opodis Pharma
        </span>
        <h1 className="mt-1 text-[21px] font-bold text-foreground">
          Kết nối & hỗ trợ
        </h1>
        <p className="mt-2 text-[13px] leading-5 text-subtitle">
          Liên hệ Opodis Pharma để được tư vấn về sản phẩm. Ứng dụng không tự
          thu thập hoặc lưu thông tin hồ sơ Zalo của bạn.
        </p>
      </section>

      <section className="mt-4">
        <FollowOAWidget guidingText="Quan tâm OA để nhận thông tin từ Opodis Pharma" />
      </section>

      <TransitionLink
        to="/cart"
        className="mt-4 flex min-h-[52px] items-center justify-between rounded-2xl border border-border/70 bg-white px-4 text-sm font-semibold text-foreground shadow-xs active:scale-[0.99] transition-transform"
      >
        <span>Giỏ hàng của bạn</span>
        <span className="text-primary" aria-hidden="true">
          →
        </span>
      </TransitionLink>
    </div>
  );
}
