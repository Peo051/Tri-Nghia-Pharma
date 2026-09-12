import triNghiaLogo from "@/static/logo-tringhia.png";
import opodisLogo from "@/static/logo-opodis.png";

export default function AboutPage() {
  return (
    <div className="w-full min-h-full pb-10 bg-background">
      {/* 1. Brand Hero */}
      <div className="mx-4 mt-3.5 mb-5 rounded-3xl bg-gradient-to-br from-white via-primary-soft/50 to-primary-soft border border-primary/15 p-5 relative overflow-hidden shadow-[0_2px_12px_rgba(17,105,54,0.06)]">
        {/* Subtle medical/botanical decoration */}
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
          {/* Brand & Distributor Badges */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="h-10 px-3 py-1 bg-white rounded-2xl border border-primary/20 shadow-xs flex items-center">
              <img
                src={opodisLogo}
                alt="Logo Opodis Pharma"
                className="h-7 w-auto object-contain"
              />
            </div>
            <div className="flex items-center space-x-2 px-2.5 py-1 bg-white/95 rounded-2xl border border-border/80 shadow-xs">
              <img
                src={triNghiaLogo}
                alt="Logo Trí Nghĩa Pharma"
                className="w-7 h-7 rounded-full object-contain p-0.5 bg-white flex-none"
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-primary tracking-wide leading-tight uppercase">
                  TRÍ NGHĨA
                </span>
                <span className="text-[9px] text-subtitle leading-tight">
                  Phân phối
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-[22px] leading-[28px] font-black text-primary tracking-tight">
            Khoa học chuẩn mực
          </h1>

          <p className="text-[15px] leading-[22px] font-extrabold text-primary-dark mt-0.5">
            Tâm huyết từ dược thảo
          </p>

          <p className="text-[12px] leading-[18px] text-subtitle mt-2 max-w-[280px]">
            Tất cả mọi người đều có quyền sử dụng và tận hưởng những sản phẩm y tế và chăm sóc sức khỏe chất lượng cao.
          </p>

          {/* Key Brand Stats */}
          <div className="mt-4 pt-3 border-t border-primary/10 grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-primary leading-tight">20+</span>
              <span className="text-[10px] text-subtitle leading-tight mt-0.5">Năm NC&PT</span>
            </div>
            <div className="flex flex-col border-x border-primary/10">
              <span className="text-[16px] font-bold text-primary leading-tight">30+</span>
              <span className="text-[10px] text-subtitle leading-tight mt-0.5">Sản phẩm uy tín</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-primary leading-tight">80+</span>
              <span className="text-[10px] text-subtitle leading-tight mt-0.5">Bệnh viện tin dùng</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Câu chuyện thảo dược & Sứ mệnh */}
      <section aria-labelledby="story-section-title" className="mx-4 mb-4">
        <div className="p-4 rounded-2xl bg-white border border-border/70 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center space-x-2 mb-2.5">
            <div className="w-6 h-6 rounded-lg bg-primary-soft text-primary flex items-center justify-center flex-none">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2 id="story-section-title" className="text-[15px] font-extrabold text-primary">
              Câu chuyện thảo dược
            </h2>
          </div>
          <p className="text-[13px] leading-[21px] text-foreground/85 font-normal">
            Khởi nguồn từ Công ty Dược liệu Trung Ương 2, Opodis Pharma bắt đầu hành trình giữa rừng tràm gió miền Trung, nơi chúng tôi nghiên cứu tinh dầu <em>Melaleuca cajuputi</em> – nguồn hoạt chất <strong>α-Terpineol</strong> quý giá, được chứng minh có khả năng kháng khuẩn, kháng nấm và làm dịu tự nhiên.
          </p>
          <p className="text-[13px] leading-[21px] text-foreground/85 font-normal mt-2">
            Từ nền tảng ấy, Opodis kết hợp tri thức Đông y và Tây y hiện đại, chuẩn hóa các công thức dược thảo kinh điển: Cao Trầu Không, Cao Hạt Ngò, Kim Ngân Hoa, Cúc La Mã, Lá Olive... kết tinh trong các dòng sản phẩm uy tín: Phytogyno, Phytobebe, Clincare, Opolux.
          </p>
        </div>
      </section>

      {/* 3. Dòng sản phẩm trọng tâm */}
      <section aria-labelledby="products-pillar-title" className="mx-4 mb-4">
        <div className="p-4 rounded-2xl bg-white border border-border/70 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <h2 id="products-pillar-title" className="text-[15px] font-extrabold text-primary mb-3">
            4 Nhóm giải pháp trọng tâm
          </h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-section/70">
              <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-none" />
              <div>
                <h3 className="text-[13px] font-bold text-foreground">OPODIS FAMILY PREMIUM</h3>
                <p className="text-[12px] text-subtitle leading-[18px] mt-0.5">
                  Chăm sóc sức khỏe toàn diện và tinh tế cho phụ nữ ở mọi lứa tuổi: Lady, Teen, Girl, Mom.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-section/70">
              <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-none" />
              <div>
                <h3 className="text-[13px] font-bold text-foreground">CHĂM SÓC MẸ VÀ BÉ</h3>
                <p className="text-[12px] text-subtitle leading-[18px] mt-0.5">
                  Sữa tắm rôm sẩy Phytobebe, dung dịch vệ sinh Phytogyno chiết xuất thiên nhiên dịu lành.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-section/70">
              <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-none" />
              <div>
                <h3 className="text-[13px] font-bold text-foreground">CHĂM SÓC GIA ĐÌNH & NAM GIỚI</h3>
                <p className="text-[12px] text-subtitle leading-[18px] mt-0.5">
                  Vệ sinh nam giới Opolux, xịt họng thảo dược Opflu, giải pháp bảo vệ sức khỏe cả nhà.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-section/70">
              <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-none" />
              <div>
                <h3 className="text-[13px] font-bold text-foreground">KHỬ KHUẨN – SÁT KHUẨN Y TẾ</h3>
                <p className="text-[12px] text-subtitle leading-[18px] mt-0.5">
                  Clincare, Opodex 70, Phytasep đạt tiêu chuẩn y tế khắt khe, tin dùng tại hơn 80 bệnh viện.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Doanh nghiệp & Nhà máy */}
      <section aria-labelledby="company-section-title" className="mx-4 mb-4">
        <div className="p-4 rounded-2xl bg-section/60 border border-border/70 space-y-3.5 text-[13px]">
          <h2 id="company-section-title" className="text-[14px] font-black text-primary uppercase tracking-wide">
            Cơ sở sản xuất & Doanh nghiệp
          </h2>

          <div className="flex items-start space-x-3">
            <div className="w-11 h-11 rounded-xl bg-white border border-border/80 shadow-xs flex items-center justify-center p-1 flex-none mt-0.5">
              <img
                src={opodisLogo}
                alt="Logo Dược Phẩm Opodis"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-bold text-foreground">CÔNG TY TNHH DƯỢC PHẨM - DƯỢC LIỆU OPODIS</h3>
              <p className="text-subtitle mt-0.5 leading-[18px]">
                Lô 78, Khu CX & CN Linh Trung III, Tây Ninh, Việt Nam
              </p>
              <p className="text-primary font-medium mt-0.5">Tel: (0276) 3898 656</p>
            </div>
          </div>

          <div className="w-full h-[0.5px] bg-border/80" />

          <div className="flex items-start space-x-3">
            <img
              src={triNghiaLogo}
              alt="Logo Dược Phẩm Trí Nghĩa"
              className="w-11 h-11 rounded-full object-contain p-0.5 bg-white border border-border/80 shadow-xs flex-none mt-0.5"
            />
            <div>
              <h3 className="font-bold text-foreground">CÔNG TY TNHH DƯỢC PHẨM - DƯỢC LIỆU TRÍ NGHĨA</h3>
              <p className="text-subtitle mt-0.5 leading-[18px]">
                Số 15 đường số 4, KDC Intresco, Bình Hưng, Bình Chánh, TP.HCM
              </p>
              <p className="text-primary font-medium mt-0.5">Tel: (0283) 7582 741</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact Section */}
      <section aria-labelledby="contact-section-title" className="mx-4 mb-5">
        <h2
          id="contact-section-title"
          className="text-[15px] font-extrabold text-primary mb-2.5"
        >
          Kênh thông tin chính thức
        </h2>
        <div className="space-y-2.5">
          <a
            href="https://opodispharma.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Truy cập website chính thức opodispharma.com"
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-border/70 shadow-[0_1px_3px_rgba(0,0,0,0.02)] active:scale-[0.985] transition-all min-h-[56px] group"
          >
            <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
              <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center text-primary flex-none">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[12px] font-medium text-subtitle">
                  Website chính thức
                </span>
                <span className="text-[14px] font-semibold text-primary truncate">
                  opodispharma.com
                </span>
              </div>
            </div>
            <div className="text-subtitle flex-none" aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </a>

          <a
            href="tel:02837582741"
            aria-label="Gọi hotline tư vấn"
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-border/70 shadow-[0_1px_3px_rgba(0,0,0,0.02)] active:scale-[0.985] transition-all min-h-[56px] group"
          >
            <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
              <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center text-primary flex-none">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[12px] font-medium text-subtitle">
                  Hotline tư vấn
                </span>
                <span className="text-[14px] font-semibold text-primary truncate">
                  (0283) 7582 741
                </span>
              </div>
            </div>
            <div className="text-subtitle flex-none" aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
