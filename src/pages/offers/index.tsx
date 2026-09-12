import { OffersNavIcon } from "@/components/vectors";

export default function OffersPage() {
  return (
    <div className="min-h-full bg-section/30 px-4 py-4 pb-6">
      <section className="rounded-3xl bg-primary text-white p-5 shadow-[0_4px_16px_rgba(17,105,54,0.16)]">
        <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center mb-4">
          <OffersNavIcon active />
        </div>
        <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-white/75">
          OPODIS PHARMA
        </span>
        <h1 className="text-[21px] leading-7 font-bold mt-1">Ưu đãi</h1>
        <p className="text-[13px] leading-5 text-white/80 mt-2 max-w-[290px]">
          Chương trình ưu đãi đang được cập nhật. Thông tin chính thức sẽ được
          hiển thị tại đây.
        </p>
      </section>

      <section className="mt-4 rounded-2xl bg-surface border border-border/70 p-4">
        <h2 className="text-[14px] leading-5 font-semibold text-foreground">
          Đang chuẩn bị nội dung
        </h2>
        <p className="text-[12px] leading-5 text-subtitle mt-1.5">
          Đây là màn hình placeholder cho bài test. Chưa có dữ liệu khuyến mãi,
          mã giảm giá hoặc logic thương mại trong phạm vi hiện tại.
        </p>
      </section>
    </div>
  );
}
