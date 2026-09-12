import CustomerSummary from "@/components/customer-summary";
import QuickActions from "@/components/quick-actions";

export default function CustomerPage() {
  return (
    <div className="min-h-full bg-section/30 py-4 pb-6">
      <CustomerSummary showHeading={false} />
      <QuickActions className="mt-4" />

      <section className="mx-4 mt-4 rounded-2xl bg-surface border border-border/70 p-4">
        <h2 className="text-[14px] leading-5 font-semibold text-foreground">
          Thông tin tài khoản
        </h2>
        <p className="text-[12px] leading-5 text-subtitle mt-1.5">
          Thông tin tài khoản và chương trình khách hàng thân thiết sẽ được cập
          nhật sau khi có luồng đăng nhập chính thức.
        </p>
      </section>
    </div>
  );
}
