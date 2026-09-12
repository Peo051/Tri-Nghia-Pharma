export default function Hero() {
  return (
    <div className="mx-4 mt-3.5 mb-5 rounded-3xl bg-gradient-to-br from-white via-primary-soft/50 to-primary-soft border border-primary/15 p-4.5 relative overflow-hidden shadow-[0_2px_12px_rgba(17,105,54,0.06)]">
      {/* Abstract medical/botanical decoration */}
      <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-primary/10 pointer-events-none blur-2xl" />
      <div className="absolute right-2 top-2 opacity-15 pointer-events-none" aria-hidden="true">
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.3"
        >
          <path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-pill bg-primary/10 text-primary mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[11px] font-bold tracking-wider uppercase">
            OPODIS PHARMA
          </span>
        </div>

        <h1 className="text-[20px] leading-[26px] font-bold text-foreground tracking-tight">
          Khoa học chuẩn mực
        </h1>

        <p className="text-[15px] leading-[22px] font-semibold text-primary mt-0.5">
          Tâm huyết từ dược thảo
        </p>

        <p className="text-[12px] leading-[18px] text-subtitle mt-1.5 max-w-[260px]">
          Giải pháp chăm sóc sức khỏe & sát khuẩn y tế chuẩn mực cho cộng đồng.
        </p>

        {/* Brand Highlights / Trust Metrics */}
        <div className="mt-3.5 pt-3 border-t border-primary/10 grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-primary leading-tight">20+</span>
            <span className="text-[10px] text-subtitle leading-tight mt-0.5">Năm NC&PT</span>
          </div>
          <div className="flex flex-col border-x border-primary/10">
            <span className="text-[14px] font-bold text-primary leading-tight">30+</span>
            <span className="text-[10px] text-subtitle leading-tight mt-0.5">Sản phẩm</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-primary leading-tight">80+</span>
            <span className="text-[10px] text-subtitle leading-tight mt-0.5">Bệnh viện</span>
          </div>
        </div>
      </div>
    </div>
  );
}
