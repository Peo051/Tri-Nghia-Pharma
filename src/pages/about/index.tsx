import React from "react";
import { useNavigate } from "react-router-dom";
import triNghiaLogo from "@/static/logo-tringhia.png";
import opodisLogo from "@/static/logo-opodis.png";
import FollowOAWidget from "@/components/follow-oa-card";
import PartnerCarousel from "@/components/partner-carousel";

import factory1Img from "@/static/about/factory-1.webp";
import shopeeLogo from "@/static/ecommerce/shopee.png";
import lazadaLogo from "@/static/ecommerce/lazada.png";
import tiktokLogo from "@/static/ecommerce/tiktok.png";

const PRODUCT_SOLUTIONS = [
  {
    title: "OPODIS FAMILY PREMIUM",
    subtitle: "Chăm sóc phụ nữ chuyên sâu",
    desc: "Công thức thảo dược cân bằng pH lý tưởng, lưu hương nhẹ nhàng (Phytogyno Lady, Mom, Teen, Girl).",
    badge: "Phytogyno",
    border: "border-emerald-200/80 bg-emerald-50/40",
  },
  {
    title: "CHĂM SÓC MẸ VÀ BÉ",
    subtitle: "Dịu lành như tình mẹ",
    desc: "Bảo bọc làn da bé khỏi rôm sẩy, hăm kẽ và côn trùng cắn (Sữa tắm rôm sẩy Phytobebe, Baby care).",
    badge: "Phytobebe",
    border: "border-amber-200/80 bg-amber-50/40",
  },
  {
    title: "CHĂM SÓC GIA ĐÌNH & NAM GIỚI",
    subtitle: "Khô thoáng & Khỏe mạnh",
    desc: "Vệ sinh nam giới Opolux sạch sâu suốt 24h; kết hợp xịt họng thảo dược Opflu bảo vệ hô hấp cả nhà.",
    badge: "Opolux & Opflu",
    border: "border-blue-200/80 bg-blue-50/40",
  },
  {
    title: "SÁT KHUẨN Y TẾ CHUYÊN DỤNG",
    subtitle: "Chuẩn phòng mổ bệnh viện",
    desc: "Dung dịch sát khuẩn Clincare, cồn Opodex 70 được hơn 80 bệnh viện tuyến đầu tin dùng.",
    badge: "Clincare",
    border: "border-teal-200/80 bg-teal-50/40",
  },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-full pb-12 bg-[#F8FAF9] text-foreground">
      {/* 1. HERO BANNER: THƯƠNG HIỆU 25 NĂM & BẢO CHỨNG VÀNG */}
      <section className="mx-3.5 mt-3 mb-4 rounded-2xl bg-gradient-to-br from-[#0B4A24] via-[#116936] to-[#08351B] text-white p-5 relative overflow-hidden shadow-xl shadow-primary/25">
        <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-52 h-52 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Huy hiệu 25 Năm - 1 dòng duy nhất */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-400/15 border border-amber-300/30 text-amber-200 text-[10px] font-extrabold uppercase tracking-wide mb-3.5 backdrop-blur-xs shadow-2xs whitespace-nowrap font-display">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-none" />
            <span>25 Năm Đồng Hành • Vì Sức Khỏe Gia Đình Việt</span>
          </div>

          {/* Cặp Thẻ Logo Đối Tác: Hiển thị đầy đủ tên thương hiệu, không bị cắt chữ */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex flex-col items-center justify-center py-2.5 px-2 bg-white/95 rounded-xl shadow-sm border border-white/20 text-center">
              <img
                src={opodisLogo}
                alt="Logo Dược Phẩm Opodis"
                className="h-6 w-auto object-contain mb-1 flex-none"
              />
              <span className="text-[11.5px] font-black text-primary leading-tight font-display">
                OPODIS PHARMA
              </span>
              <span className="text-[9.5px] text-gray-500 font-semibold leading-tight mt-0.5">
                Nhà sản xuất
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-2.5 px-2 bg-white/95 rounded-xl shadow-sm border border-white/20 text-center">
              <img
                src={triNghiaLogo}
                alt="Logo Trí Nghĩa Pharma"
                className="w-6 h-6 rounded-full object-contain p-0.5 bg-gray-50 mb-1 flex-none"
              />
              <span className="text-[11.5px] font-black text-primary leading-tight font-display">
                TRÍ NGHĨA PHARMA
              </span>
              <span className="text-[9.5px] text-gray-500 font-semibold leading-tight mt-0.5">
                Phân phối độc quyền
              </span>
            </div>
          </div>

          <h1 className="text-[22px] leading-[28px] font-black tracking-tight text-white font-display">
            TINH HOA DƯỢC THẢO VIỆT
          </h1>
          <p className="text-[15px] leading-[22px] font-extrabold text-emerald-200 mt-1 font-display">
            Chăm sóc sức khỏe chuẩn y khoa
          </p>

          <p className="text-[12.5px] leading-[20px] text-white/90 mt-2.5">
            Kế thừa hơn 25 năm nghiên cứu từ <strong>Dược liệu Trung Ương 2</strong>, Opodis Pharma tiên phong chuẩn hóa dược thảo Việt theo tiêu chuẩn GMP-WHO khắt khe nhất, trao gửi sự an tâm tuyệt đối và chăm sóc trọn vẹn sức khỏe cho bạn và gia đình mỗi ngày.
          </p>

          {/* 4 Chỉ số giá trị thương hiệu */}
          <div className="mt-4 pt-3.5 border-t border-white/15 grid grid-cols-4 gap-1.5 text-center">
            <div className="flex flex-col items-center justify-center bg-white/10 rounded-xl py-2 px-1 backdrop-blur-xs border border-white/10">
              <span className="text-[16px] font-black text-amber-300 leading-none stat-number">25+</span>
              <span className="text-[9.5px] text-white/85 font-medium leading-tight mt-1.5">Năm uy tín</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-white/10 rounded-xl py-2 px-1 backdrop-blur-xs border border-white/10">
              <span className="text-[15px] font-black text-amber-300 leading-none stat-number">GMP</span>
              <span className="text-[9.5px] text-white/85 font-medium leading-tight mt-1.5">Chuẩn WHO</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-white/10 rounded-xl py-2 px-1 backdrop-blur-xs border border-white/10">
              <span className="text-[16px] font-black text-amber-300 leading-none stat-number">80+</span>
              <span className="text-[9.5px] text-white/85 font-medium leading-tight mt-1.5">Viện tin dùng</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-white/10 rounded-xl py-2 px-1 backdrop-blur-xs border border-white/10">
              <span className="text-[16px] font-black text-amber-300 leading-none stat-number">1Tr+</span>
              <span className="text-[9.5px] text-white/85 font-medium leading-tight mt-1.5">Gia đình tin yêu</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TIÊU CHUẨN CHẤT LƯỢNG QUỐC TẾ */}
      <section className="mx-3.5 mb-4">
        <div className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-card">
          <div className="mb-3">
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase">
              Cam kết chất lượng chuẩn y khoa
            </span>
            <h2 className="text-section-title font-bold text-foreground leading-tight mt-0.5 font-display">
              Nhà máy chuẩn GMP-WHO — An tâm trên từng sản phẩm
            </h2>
          </div>

          <p className="text-[13px] leading-[20px] text-gray-700 mb-3">
            Toàn bộ quy trình sản xuất khép kín tại <strong>Nhà máy Opodis Pharma (Tây Ninh)</strong> tuân thủ nghiêm ngặt bộ 3 chứng nhận quốc tế danh giá, bảo toàn trọn vẹn dược tính tự nhiên và đảm bảo an toàn tuyệt đối.
          </p>

          {/* Ảnh thực tế nhà máy */}
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-3">
            <img
              src={factory1Img}
              alt="Nhà máy Opodis Pharma đạt chuẩn GMP-WHO tại Tây Ninh"
              className="w-full h-44 object-cover"
              loading="lazy"
            />
            <div className="bg-gray-50 px-3 py-1.5 text-[11px] text-gray-500 font-medium text-center border-t border-gray-200">
              Nhà máy Opodis Pharma đạt chuẩn GMP-WHO, CGMP-ASEAN, ISO 13485:2016
            </div>
          </div>

          {/* 3 Tiêu chuẩn Quốc tế */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-center flex flex-col items-center">
              <span className="text-[13px] font-black text-primary font-display">GMP-WHO</span>
              <span className="text-[10px] text-gray-600 mt-0.5 leading-tight">Dược phẩm thế giới</span>
            </div>
            <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200/60 text-center flex flex-col items-center">
              <span className="text-[13px] font-black text-teal-800 font-display">CGMP-ASEAN</span>
              <span className="text-[10px] text-gray-600 mt-0.5 leading-tight">Dược mỹ phẩm quốc tế</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/60 text-center flex flex-col items-center">
              <span className="text-[13px] font-black text-blue-800 font-display">ISO 13485</span>
              <span className="text-[10px] text-gray-600 mt-0.5 leading-tight">Thiết bị y tế an toàn</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BẢO CHỨNG NIỀM TIN: HỆ THỐNG PHÂN PHỐI & ĐỐI TÁC Y TẾ (CAROUSEL ĐỘNG) */}
      <section className="mx-3.5 mb-4">
        <div className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-card">
          <div className="mb-2.5">
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase">
              Bảo chứng niềm tin • 80+ Bệnh viện lớn
            </span>
            <h2 className="text-section-title font-bold text-foreground leading-tight mt-0.5 font-display">
              Hệ thống phân phối & Đối tác y tế
            </h2>
          </div>

          <div className="space-y-2 text-[12.5px] leading-[19px] text-gray-700 font-normal mb-3.5">
            <p className="font-semibold text-primary">
              Vì một cộng đồng khỏe mạnh, an toàn và hạnh phúc hơn.
            </p>
            <p>
              Trong quá trình nghiên cứu và phát triển sản phẩm, Opodis tự hào được đồng hành cùng các chuyên gia y dược, các bệnh viện, viện nghiên cứu và tổ chức chuyên ngành hàng đầu, góp phần mang đến những giải pháp chăm sóc sức khỏe thiết thực, hiệu quả và an toàn cho người Việt.
            </p>
            <p className="text-[12px] text-gray-500 italic">
              Các sản phẩm của Opodis Pharma hiện đang được tin dùng và sử dụng rộng rãi tại nhiều bệnh viện lớn, trung tâm y tế và hệ thống phân phối trên toàn quốc.
            </p>
          </div>

          {/* Carousel động chạy ngang các nhà phân phối & bệnh viện đối tác */}
          <div className="mb-3.5 -mx-1">
            <PartnerCarousel />
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-[12px] text-emerald-950 leading-[18px]">
            <strong>Bảo chứng chất lượng:</strong> Sự hiện diện bền bỉ tại các bệnh viện đầu ngành (Từ Dũ, Chợ Rẫy, Quân Y 175, Nhi Đồng 1...) và chuỗi nhà thuốc lớn (FPT Long Châu, Pharmacity, VNVC) chính là lời khẳng định vững chắc nhất cho chất lượng và độ an toàn của Opodis Pharma.
          </div>
        </div>
      </section>

      {/* 4. HỆ SINH THÁI GIẢI PHÁP CHĂM SÓC TOÀN DIỆN */}
      <section className="mx-3.5 mb-4">
        <div className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-card">
          <div className="mb-3">
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase">
              Hệ sinh thái sản phẩm
            </span>
            <h2 className="text-section-title font-bold text-foreground leading-tight mt-0.5 font-display">
              Giải pháp y khoa trọn vẹn cho cả gia đình
            </h2>
          </div>

          <div className="space-y-2.5">
            {PRODUCT_SOLUTIONS.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border ${item.border} flex flex-col gap-1 transition-all`}
              >
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-[12.5px] font-bold text-gray-900">{item.title}</h3>
                  <span className="px-2 py-0.5 rounded-md bg-white text-primary text-[10px] font-extrabold border border-primary/20 flex-none shadow-2xs font-display">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-primary">{item.subtitle}</p>
                <p className="text-[12px] text-gray-600 leading-[17px]">{item.desc}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate("/catalog")}
            className="mt-3.5 w-full py-2.5 px-4 rounded-lg bg-primary text-white font-bold text-[13px] font-display shadow-sm shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Khám phá toàn bộ danh mục sản phẩm</span>
            <span>→</span>
          </button>
        </div>
      </section>

      {/* 5. THÔNG TIN DOANH NGHIỆP, LIÊN HỆ & SÀN TMĐT CHÍNH HÃNG */}
      <section className="mx-3.5 mb-4">
        <div className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-card">
          <div className="mb-3">
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase">
              Thông tin pháp lý & Liên hệ
            </span>
            <h2 className="text-section-title font-bold text-foreground leading-tight mt-0.5 font-display">
              Đơn vị sản xuất & Phân phối chính thức
            </h2>
          </div>

          <div className="space-y-3 text-[12.5px]">
            {/* Đơn vị sản xuất */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 flex items-start space-x-3">
              <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center justify-center p-1.5 flex-none mt-0.5">
                <img src={opodisLogo} alt="Opodis Pharma Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
                  Đơn vị sản xuất chuẩn GMP-WHO
                </span>
                <h4 className="font-extrabold text-gray-900 leading-snug">
                  CÔNG TY TNHH DƯỢC PHẨM - DƯỢC LIỆU OPODIS
                </h4>
                <p className="text-gray-600 mt-0.5 leading-[18px]">
                  Lô 78, Khu CX & CN Linh Trung III, Trảng Bàng, Tây Ninh, Việt Nam
                </p>
                <a href="tel:02763898656" className="text-primary font-bold mt-1 inline-block hover:underline">
                  Tel: (0276) 3898 656
                </a>
              </div>
            </div>

            {/* Đơn vị phân phối độc quyền */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 flex items-start space-x-3">
              <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center justify-center p-1.5 flex-none mt-0.5">
                <img src={triNghiaLogo} alt="Trí Nghĩa Pharma Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                  Nhà phân phối độc quyền toàn quốc
                </span>
                <h4 className="font-extrabold text-gray-900 leading-snug">
                  CÔNG TY TNHH DƯỢC PHẨM - DƯỢC LIỆU TRÍ NGHĨA
                </h4>
                <p className="text-gray-600 mt-0.5 leading-[18px]">
                  Số 15 đường số 4, KDC Intresco, Bình Hưng, Bình Chánh, TP.HCM
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <a href="tel:02837582741" className="text-primary font-bold hover:underline">
                    Tel: (0283) 7582 741
                  </a>
                  <span className="text-gray-300">|</span>
                  <a href="tel:02837582742" className="text-primary font-bold hover:underline">
                    (0283) 7582 742
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Kênh phân phối TMĐT chính hãng */}
          <div className="mt-3.5 pt-3 border-t border-gray-100">
            <h4 className="text-[12px] font-bold text-gray-700 mb-2">Gian hàng trực tuyến chính hãng 100%:</h4>
            <div className="grid grid-cols-3 gap-2">
              <a
                href="https://shopee.vn/opodispharma?entryPoint=ShopBySearch&searchKeyword=opodis%20pharma"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-1.5 rounded-xl bg-orange-50/90 border border-orange-200/80 text-[#ee4d2d] font-bold text-[11px] flex items-center justify-center gap-1.5 hover:bg-orange-100 transition-all active:scale-95 shadow-2xs font-display"
              >
                <img src={shopeeLogo} alt="Shopee Mall" className="w-4 h-4 rounded-full object-contain shrink-0" />
                <span className="truncate">Shopee Mall</span>
              </a>
              <a
                href="https://www.lazada.vn/shop/mn7k3oup/?path=index.htm&spm=a2o4n.pdp_revamp.seller.1.66ed7633EhzkGb&itemId=3165045408&channelSource=pdp"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-1.5 rounded-xl bg-blue-50/90 border border-blue-200/80 text-[#0f146d] font-bold text-[11px] flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-all active:scale-95 shadow-2xs font-display"
              >
                <img src={lazadaLogo} alt="Lazada Mall" className="w-4 h-4 rounded-full object-contain shrink-0" />
                <span className="truncate">Lazada Mall</span>
              </a>
              <a
                href="https://www.tiktok.com/@opodis.pharma?lang=vi-VN"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-1.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-bold text-[11px] flex items-center justify-center gap-1.5 hover:bg-gray-100 transition-all active:scale-95 shadow-2xs font-display"
              >
                <img src={tiktokLogo} alt="TikTok Shop" className="w-4 h-4 rounded-full object-contain shrink-0" />
                <span className="truncate">TikTok Shop</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. KÊNH KẾT NỐI CHUYÊN GIA & ZALO OA */}
      <section className="mx-3.5 mb-4 space-y-2.5">
        <a
          href="https://opodispharma.com/"
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white border border-gray-200 shadow-xs active:scale-[0.985] transition-all group"
        >
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-[11px] font-medium text-gray-500">Website chính thức</span>
            <span className="text-[14px] font-bold text-primary truncate">https://opodispharma.com/</span>
          </div>
          <span className="text-primary font-bold text-[13px] flex-none">Khám phá ngay →</span>
        </a>

        <a
          href="tel:02837582741"
          className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white border border-gray-200 shadow-xs active:scale-[0.985] transition-all group"
        >
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-[11px] font-medium text-gray-500">Hotline tư vấn dược sĩ 24/7</span>
            <span className="text-[14px] font-bold text-primary truncate">(0283) 7582 741</span>
          </div>
          <span className="text-primary font-bold text-[13px] flex-none">Tư vấn ngay →</span>
        </a>

        <FollowOAWidget />
      </section>
    </div>
  );
}
