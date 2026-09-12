import { ProfileIcon } from "./vectors";

interface CustomerSummaryProps {
  className?: string;
  showHeading?: boolean;
}

export default function CustomerSummary({
  className = "",
  showHeading = true,
}: CustomerSummaryProps) {
  return (
    <section
      aria-labelledby={showHeading ? "customer-summary-title" : undefined}
      aria-label={!showHeading ? "Khách hàng" : undefined}
      className={`mx-4 ${className}`}
    >
      {showHeading && (
        <h2
          id="customer-summary-title"
          className="text-section-title font-black text-primary mb-2.5"
        >
          Khách hàng
        </h2>
      )}

      <div className="rounded-3xl bg-surface border border-border/70 p-4 shadow-[0_2px_10px_rgba(17,105,54,0.05)] flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-primary-soft flex items-center justify-center flex-none">
          <ProfileIcon active />
        </div>

        <div className="min-w-0 flex-1">
          <span className="block text-[11px] leading-4 text-subtitle">
            Xin chào,
          </span>
          <strong className="block text-[14px] leading-5 text-foreground truncate">
            Quý khách hàng
          </strong>
          <span className="block text-[11px] leading-4 text-subtitle mt-0.5 truncate">
            Không gian thông tin Opodis Pharma
          </span>
        </div>

        <div className="flex-none pl-3 border-l border-border/80 text-right max-w-[112px]">
          <span className="block text-[10px] leading-4 text-subtitle">
            Trạng thái
          </span>
          <strong className="block text-[12px] leading-4 text-primary mt-0.5">
            Chưa đăng nhập
          </strong>
          <span className="block text-[10px] leading-4 text-subtitle mt-0.5">
            UI demo
          </span>
        </div>
      </div>
    </section>
  );
}
