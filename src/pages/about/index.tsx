import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import triNghiaLogo from "@/static/logo-tringhia.png";
import opodisLogo from "@/static/logo-opodis.png";
import FollowOAWidget from "@/components/follow-oa-card";

import factory1Img from "@/static/about/factory-1.webp";
import factory2Img from "@/static/about/factory-2.webp";
import csrMuaThiImg from "@/static/about/csr-mua-thi.webp";
import csrHcdcImg from "@/static/about/csr-hcdc.webp";
import cert1Img from "@/static/about/cert-1.webp";
import cert2Img from "@/static/about/cert-2.webp";
import cert3Img from "@/static/about/cert-3.webp";
import cert4Img from "@/static/about/cert-4.webp";

const NAV_SECTIONS = [
  { id: "story", label: "🌿 Thảo dược" },
  { id: "factory", label: "🏭 Chuẩn GMP" },
  { id: "products", label: "🌸 4 Nhóm giải pháp" },
  { id: "mission", label: "🏆 Sứ mệnh & Cúp" },
  { id: "csr", label: "🤝 Hoạt động CSR" },
  { id: "network", label: "🏥 Đối tác & Liên hệ" },
];

const HERBS = [
  {
    name: "Tràm Gió Thiên Nhiên",
    latin: "Melaleuca cajuputi",
    badge: "Hoạt chất α-Terpineol",
    desc: "Nguồn hoạt chất α-Terpineol tự nhiên quý giá từ rừng tràm miền Trung, có khả năng kháng khuẩn, kháng nấm và làm dịu viêm vượt trội mà cực kỳ an toàn.",
    color: "from-emerald-500/10 to-emerald-500/5",
  },
  {
    name: "Cao Trầu Không",
    latin: "Piper betle",
    badge: "Chuẩn hóa cổ truyền",
    desc: "Chiết xuất giàu polyphenol giúp kháng khuẩn phổ rộng, cân bằng hệ vi sinh tự nhiên, làm sạch và bảo vệ niêm mạc nhạy cảm một cách êm dịu.",
    color: "from-teal-500/10 to-teal-500/5",
  },
  {
    name: "Cao Hạt Ngò",
    latin: "Coriandrum sativum",
    badge: "Thanh nhiệt & Giải độc",
    desc: "Chống oxy hóa mạnh mẽ, hỗ trợ kháng viêm tự nhiên, loại bỏ mùi khó chịu và phục hồi màng bảo vệ biểu bì khỏe khoắn suốt ngày dài.",
    color: "from-green-500/10 to-green-500/5",
  },
  {
    name: "Kim Ngân Hoa & Cúc La Mã",
    latin: "Lonicera & Chamomile",
    badge: "Dịu lành cho bé",
    desc: "Hợp chất flavonoids giúp tiêu viêm, dịu nhanh cơn ngứa, phòng ngừa rôm sẩy hăm kẽ và nuôi dưỡng làn da non nớt của trẻ nhỏ.",
    color: "from-amber-500/10 to-amber-500/5",
  },
  {
    name: "Lá Olive Thiên Nhiên",
    latin: "Olea europaea",
    badge: "Bảo vệ sinh học",
    desc: "Giàu Oleuropein và vitamin E tự nhiên giúp bảo vệ tế bào khỏi gốc tự do, tăng cường sức đề kháng cho làn da trong mọi điều kiện môi trường.",
    color: "from-lime-500/10 to-lime-500/5",
  },
];

const PRODUCT_PILLARS = [
  {
    title: "OPODIS FAMILY PREMIUM",
    badge: "Chăm sóc phụ nữ",
    desc: "Giải pháp chăm sóc toàn diện và tinh tế cho phụ nữ ở mọi lứa tuổi: Lady, Teen, Girl, Mom. Chiết xuất tinh túy thiên nhiên dịu nhẹ, cân bằng pH sinh lý lý tưởng.",
    icon: "🌸",
    highlight: "Phytogyno Mom • Phytogyno Lady • Phytogyno Teen • Phytogyno Girl",
  },
  {
    title: "CHĂM SÓC MẸ VÀ BÉ",
    badge: "An toàn tuyệt đối",
    desc: "Sự kết hợp hoàn hảo giữa công thức y khoa tiên tiến và tinh chất dược thảo dịu lành. Giúp mẹ và bé cùng nhau lớn lên khỏe mạnh, phòng ngừa rôm sẩy mẩn ngứa.",
    icon: "👶",
    highlight: "Sữa tắm rôm sẩy Phytobebe • Baby Care • Xịt xua muỗi an toàn",
  },
  {
    title: "CHĂM SÓC GIA ĐÌNH & NAM GIỚI",
    badge: "Khô thoáng 24h",
    desc: "Opolux là giải pháp vệ sinh vùng nhạy cảm nam giới giúp kháng khuẩn, kiểm soát mùi suốt 24 giờ; cùng xịt họng Opflu bảo vệ đường hô hấp cho cả nhà.",
    icon: "🛡️",
    highlight: "Vệ sinh nam Opolux • Xịt họng thảo dược Opflu • Tinh dầu Phytamin",
  },
  {
    title: "KHỬ KHUẨN – SÁT KHUẨN Y TẾ",
    badge: "Tiêu chuẩn bệnh viện",
    desc: "Được phát triển dựa trên tiêu chuẩn y tế khắt khe, khử khuẩn nhanh và bảo vệ kéo dài. Tự hào được hơn 80 bệnh viện và trung tâm y tế lớn tin dùng.",
    icon: "🏥",
    highlight: "Dung dịch sát khuẩn Clincare SH • Cồn sát trùng Opodex 70 • Phytasep",
  },
];

export default function AboutPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("story");

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(`about-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full min-h-full pb-12 bg-[#F8FAF9] text-foreground">
      {/* 1. HERO BANNER: HÀNH TRÌNH 25 NĂM */}
      <section className="mx-3.5 mt-3 mb-4 rounded-3xl bg-gradient-to-br from-[#0F5A2E] via-[#116936] to-[#0A4322] text-white p-5 relative overflow-hidden shadow-xl shadow-primary/20">
        {/* Nền hoa văn và ánh sáng trang trí y tế */}
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-44 h-44 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
        <div className="absolute right-2 top-2 opacity-10 pointer-events-none" aria-hidden="true">
          <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        </div>

        <div className="relative z-10">
          {/* Huy hiệu 25 Năm */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-[11px] font-extrabold uppercase tracking-wider mb-3 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Hành trình 25 năm khoa học & tâm huyết (1999 - Nay)
          </div>

          {/* Logo 2 đơn vị */}
          <div className="flex items-center justify-between gap-2 mb-3.5">
            <div className="h-10 px-3 py-1 bg-white rounded-2xl shadow-sm flex items-center">
              <img src={opodisLogo} alt="Logo Dược Phẩm Opodis" className="h-7 w-auto object-contain" />
            </div>
            <div className="flex items-center space-x-2 px-2.5 py-1 bg-white/95 rounded-2xl shadow-sm text-foreground">
              <img
                src={triNghiaLogo}
                alt="Logo Trí Nghĩa Pharma"
                className="w-7 h-7 rounded-full object-contain p-0.5 bg-white flex-none"
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-primary leading-tight">TRÍ NGHĨA PHARMA</span>
                <span className="text-[9px] text-gray-500 font-medium leading-tight">Phân phối độc quyền</span>
              </div>
            </div>
          </div>

          <h1 className="text-[23px] leading-[29px] font-black tracking-tight text-white">
            KHOA HỌC CHUẨN MỰC
          </h1>
          <p className="text-[16px] leading-[22px] font-extrabold text-emerald-200 mt-0.5">
            Tâm huyết từ dược thảo Việt Nam
          </p>

          <p className="text-[12px] leading-[19px] text-white/85 mt-2.5 max-w-[320px]">
            Kế thừa di sản từ <strong>Công ty Dược liệu Trung Ương 2</strong>. Tất cả mọi người đều có quyền sử dụng và tận hưởng những sản phẩm y tế và chăm sóc sức khỏe chất lượng cao.
          </p>

          {/* 4 Chỉ số quan trọng từ website */}
          <div className="mt-4 pt-3.5 border-t border-white/15 grid grid-cols-4 gap-1.5 text-center">
            <div className="flex flex-col bg-white/10 rounded-2xl py-2 px-1 backdrop-blur-xs border border-white/10">
              <span className="text-[17px] font-black text-amber-300 leading-tight">25+</span>
              <span className="text-[9px] text-white/80 font-medium leading-tight mt-0.5">Năm NC&PT</span>
            </div>
            <div className="flex flex-col bg-white/10 rounded-2xl py-2 px-1 backdrop-blur-xs border border-white/10">
              <span className="text-[15px] font-black text-white leading-tight">GMP</span>
              <span className="text-[9px] text-white/80 font-medium leading-tight mt-0.5">Chuẩn WHO</span>
            </div>
            <div className="flex flex-col bg-white/10 rounded-2xl py-2 px-1 backdrop-blur-xs border border-white/10">
              <span className="text-[17px] font-black text-amber-300 leading-tight">80+</span>
              <span className="text-[9px] text-white/80 font-medium leading-tight mt-0.5">Bệnh viện</span>
            </div>
            <div className="flex flex-col bg-white/10 rounded-2xl py-2 px-1 backdrop-blur-xs border border-white/10">
              <span className="text-[17px] font-black text-white leading-tight">30+</span>
              <span className="text-[9px] text-white/80 font-medium leading-tight mt-0.5">Sản phẩm</span>
            </div>
          </div>
        </div>
      </section>

      {/* THANH ĐIỀU HƯỚNG NHANH CÁC MỤC (Sticky/Scrollable Pills) */}
      <div className="sticky top-0 z-20 bg-[#F8FAF9]/95 backdrop-blur-md py-2 px-3 border-b border-gray-200/70 mb-4 overflow-x-auto no-scrollbar flex items-center gap-1.5">
        {NAV_SECTIONS.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => scrollToSection(sec.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[12px] font-bold transition-all flex-none cursor-pointer ${
              activeTab === sec.id
                ? "bg-primary text-white shadow-sm shadow-primary/30"
                : "bg-white text-gray-700 border border-gray-200/80 hover:bg-gray-50"
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* 2. CÂU CHUYỆN THẢO DƯỢC & DI SẢN DƯỢC LIỆU TRUNG ƯƠNG 2 */}
      <section id="about-story" className="mx-3.5 mb-4 scroll-mt-14">
        <div className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
          <div className="flex items-center space-x-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-primary-soft text-primary flex items-center justify-center flex-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Di sản thương hiệu</span>
              <h2 className="text-[16px] font-black text-gray-900 leading-tight">
                Câu chuyện thảo dược & α-Terpineol
              </h2>
            </div>
          </div>

          <div className="space-y-2.5 text-[13px] leading-[21px] text-gray-700 font-normal">
            <p>
              Opodis Pharma ra đời từ tiền thân <strong>Công ty Dược liệu Trung Ương 2</strong> – đơn vị tiên phong hàng đầu trong nghiên cứu và phát triển nguồn dược thảo Việt Nam.
            </p>
            <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/70">
              <p className="text-[12.5px] text-emerald-950 font-medium italic">
                “Bắt đầu hành trình giữa rừng tràm gió miền Trung, nơi các chuyên gia Opodis dày công nghiên cứu tinh dầu <strong>Melaleuca cajuputi</strong> – nguồn hoạt chất <strong>α-Terpineol</strong> quý giá, được chứng minh khả năng kháng khuẩn, kháng nấm và làm dịu viêm tự nhiên vượt trội.”
              </p>
            </div>
            <p>
              Từ nền tảng ấy, Opodis kết hợp tri thức Đông y cổ truyền và kỹ thuật Tây y hiện đại, chuẩn hóa 5 công thức dược thảo kinh điển:
            </p>
          </div>

          {/* Danh sách 5 Thảo dược chuẩn hóa */}
          <div className="mt-3.5 space-y-2.5">
            {HERBS.map((herb, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl bg-gradient-to-r ${herb.color} border border-gray-200/70 flex flex-col gap-1`}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary flex-none" />
                    <h3 className="text-[13px] font-bold text-gray-900">{herb.name}</h3>
                    <span className="text-[11px] text-gray-500 italic">({herb.latin})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-primary text-[10px] font-extrabold border border-primary/20 flex-none shadow-2xs">
                    {herb.badge}
                  </span>
                </div>
                <p className="text-[12px] text-gray-600 leading-[18px] pl-3.5">
                  {herb.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CHUẨN HÓA NHÀ MÁY & HỆ THỐNG KIỂM SOÁT CHẤT LƯỢNG */}
      <section id="about-factory" className="mx-3.5 mb-4 scroll-mt-14">
        <div className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
          <div className="flex items-center space-x-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-primary-soft text-primary flex items-center justify-center flex-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div>
              <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Cơ sở sản xuất chuẩn mực</span>
              <h2 className="text-[16px] font-black text-gray-900 leading-tight">
                Nhà máy Opodis Tây Ninh & Chuẩn GMP-WHO
              </h2>
            </div>
          </div>

          <p className="text-[13px] leading-[21px] text-gray-700">
            Ở Opodis, <em>“chuẩn mực không chỉ là quy định, mà là văn hóa vận hành mỗi ngày.”</em> Đặt tại <strong>Lô 78, Khu CX & CN Linh Trung III, Tây Ninh</strong>, toàn bộ quy trình từ chiết xuất dược liệu đến chiết rót, đóng gói đều vận hành khép kín và tự động hóa.
          </p>

          {/* Ảnh thực tế nhà máy */}
          <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
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
          <div className="mt-3.5 grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-center flex flex-col items-center">
              <span className="text-[13px] font-black text-primary">GMP-WHO</span>
              <span className="text-[10px] text-gray-600 mt-0.5 leading-tight">Thực hành tốt sản xuất thuốc</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-teal-50/70 border border-teal-200/60 text-center flex flex-col items-center">
              <span className="text-[13px] font-black text-teal-800">CGMP-ASEAN</span>
              <span className="text-[10px] text-gray-600 mt-0.5 leading-tight">Sản xuất mỹ phẩm ASEAN</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-center flex flex-col items-center">
              <span className="text-[13px] font-black text-blue-800">ISO 13485</span>
              <span className="text-[10px] text-gray-600 mt-0.5 leading-tight">Thiết bị y tế quốc tế</span>
            </div>
          </div>

          {/* Phòng kiểm nghiệm HPLC, GC, UV-Vis */}
          <div className="mt-4 pt-3.5 border-t border-gray-100">
            <h3 className="text-[14px] font-bold text-gray-900 mb-1.5 flex items-center gap-1.5">
              <span className="text-primary">🔬</span> Hệ thống kiểm soát chất lượng nội bộ
            </h3>
            <p className="text-[12.5px] leading-[20px] text-gray-600 mb-3">
              Chất lượng được chứng minh – không chỉ là cam kết. Phòng kiểm nghiệm nội bộ phân tích từng lô sản phẩm bằng hệ thống thiết bị tối tân <strong>HPLC, GC, UV-Vis</strong>, đảm bảo hàm lượng hoạt chất và độ an toàn vi sinh đạt chuẩn tuyệt đối.
            </p>
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <img
                src={factory2Img}
                alt="Phòng kiểm nghiệm hiện đại HPLC, GC, UV-Vis tại Opodis Pharma"
                className="w-full h-40 object-cover"
                loading="lazy"
              />
              <div className="bg-gray-50 px-3 py-1.5 text-[11px] text-gray-500 font-medium text-center border-t border-gray-200">
                Phòng kiểm nghiệm phân tích hoạt chất & kiểm định vi sinh độc lập
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 4 NHÓM GIẢI PHÁP TRỌNG TÂM */}
      <section id="about-products" className="mx-3.5 mb-4 scroll-mt-14">
        <div className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary-soft text-primary flex items-center justify-center flex-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <div>
                <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Hệ sinh thái sản phẩm</span>
                <h2 className="text-[16px] font-black text-gray-900 leading-tight">
                  4 Nhóm giải pháp chăm sóc sức khỏe
                </h2>
              </div>
            </div>
          </div>

          <p className="text-[12.5px] leading-[19px] text-gray-600 mb-3.5">
            Các dòng sản phẩm của Opodis Pharma được nghiên cứu tỉ mỉ nhằm phục vụ nhu cầu phòng ngừa bệnh tật và bảo vệ sức khỏe cho mọi thành viên trong gia đình:
          </p>

          <div className="space-y-3">
            {PRODUCT_PILLARS.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-200/80 hover:border-primary/30 transition-all flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[18px]">{item.icon}</span>
                    <h3 className="text-[13px] font-bold text-gray-900">{item.title}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-primary text-[10px] font-extrabold border border-primary/20 shadow-2xs">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[12px] text-gray-600 leading-[18px]">
                  {item.desc}
                </p>
                <div className="mt-1 pt-1.5 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500 font-medium truncate max-w-[210px]">
                    {item.highlight}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate("/catalog")}
                    className="text-primary font-bold hover:underline flex items-center gap-0.5 flex-none"
                  >
                    Xem ngay →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Nút Khám phá tất cả sản phẩm */}
          <button
            type="button"
            onClick={() => navigate("/catalog")}
            className="mt-4 w-full py-2.5 px-4 rounded-2xl bg-primary text-white font-bold text-[13px] shadow-md shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Khám phá toàn bộ 30+ sản phẩm</span>
            <span>→</span>
          </button>
        </div>
      </section>

      {/* 5. SỨ MỆNH, TẦM NHÌN & THÀNH TỰU ĐẠT ĐƯỢC */}
      <section id="about-mission" className="mx-3.5 mb-4 scroll-mt-14">
        <div className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
          <div className="flex items-center space-x-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-600 tracking-wider uppercase">Triết lý cốt lõi</span>
              <h2 className="text-[16px] font-black text-gray-900 leading-tight">
                Sứ mệnh, Tầm nhìn & Thành tựu
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/70">
              <h3 className="text-[13px] font-black text-primary flex items-center gap-1.5 mb-1">
                <span>🎯 Sứ Mệnh</span>
                <span className="text-[11px] font-semibold text-gray-500">— Gìn giữ tinh hoa, nâng tầm chuẩn mực Việt</span>
              </h3>
              <p className="text-[12px] leading-[18px] text-gray-600">
                Opodis nghiên cứu, chiết xuất và chuẩn hóa dược liệu Việt bằng công nghệ hiện đại, tạo nên những sản phẩm an toàn, hiệu quả và đáng tin cậy cho sức khỏe mỗi gia đình.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-200/70">
              <h3 className="text-[13px] font-black text-blue-800 flex items-center gap-1.5 mb-1">
                <span>🔭 Tầm Nhìn</span>
                <span className="text-[11px] font-semibold text-gray-500">— Vì sức khỏe cộng đồng, vì niềm tin người Việt</span>
              </h3>
              <p className="text-[12px] leading-[18px] text-gray-600">
                Hướng tới trở thành thương hiệu dược liệu Việt Nam tiên phong, mang chuẩn mực khoa học quốc tế đến gần hơn với mọi người dân Việt.
              </p>
            </div>
          </div>

          {/* Huy hiệu thành tựu & giải thưởng từ website */}
          <div className="mt-4 pt-3.5 border-t border-gray-100">
            <h3 className="text-[13px] font-bold text-gray-900 mb-2.5 text-center">
              Chứng nhận chất lượng & Cúp giải thưởng uy tín
            </h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col items-center text-center">
                <img src={cert1Img} alt="Chứng nhận Opodis Pharma 1" className="w-12 h-12 object-contain" loading="lazy" />
                <span className="text-[10px] text-gray-600 font-medium mt-1 leading-tight">GMP-WHO</span>
              </div>
              <div className="p-2 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col items-center text-center">
                <img src={cert2Img} alt="Chứng nhận Opodis Pharma 2" className="w-12 h-12 object-contain" loading="lazy" />
                <span className="text-[10px] text-gray-600 font-medium mt-1 leading-tight">CGMP ASEAN</span>
              </div>
              <div className="p-2 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col items-center text-center">
                <img src={cert3Img} alt="Chứng nhận Opodis Pharma 3" className="w-12 h-12 object-contain" loading="lazy" />
                <span className="text-[10px] text-gray-600 font-medium mt-1 leading-tight">ISO 13485</span>
              </div>
              <div className="p-2 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col items-center text-center">
                <img src={cert4Img} alt="Chứng nhận Opodis Pharma 4" className="w-12 h-12 object-contain" loading="lazy" />
                <span className="text-[10px] text-gray-600 font-medium mt-1 leading-tight">Cúp Uy Tín</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOẠT ĐỘNG XÃ HỘI & TRÁCH NHIỆM CỘNG ĐỒNG (CSR) */}
      <section id="about-csr" className="mx-3.5 mb-4 scroll-mt-14">
        <div className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
          <div className="flex items-center space-x-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div>
              <span className="text-[11px] font-bold text-rose-600 tracking-wider uppercase">Trách nhiệm xã hội (CSR)</span>
              <h2 className="text-[16px] font-black text-gray-900 leading-tight">
                Khoa học và nhân ái luôn song hành
              </h2>
            </div>
          </div>

          <p className="text-[12.5px] leading-[19px] text-gray-600 mb-3.5">
            Opodis Pharma luôn tích cực lan tỏa năng lượng tích cực, chung tay cùng cộng đồng qua các chiến dịch vì thế hệ trẻ và đội ngũ y tế:
          </p>

          <div className="space-y-4">
            {/* Hoạt động 1: Tiếp sức mùa thi */}
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80">
              <div className="rounded-xl overflow-hidden border border-gray-200 mb-2.5 shadow-2xs">
                <img
                  src={csrMuaThiImg}
                  alt="Opodis Pharma đồng hành cùng chương trình Tiếp sức mùa thi Thành Đoàn TP.HCM"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  Thành Đoàn TP.HCM
                </span>
                <h3 className="text-[13px] font-bold text-gray-900">
                  Tiếp sức mùa thi – Lan tỏa yêu thương
                </h3>
              </div>
              <p className="text-[12px] leading-[18px] text-gray-600">
                Đồng hành cùng chương trình <em>“Tiếp sức mùa thi”</em> của Thành Đoàn TP.HCM, mang đến sự hỗ trợ thiết thực cho hàng ngàn sĩ tử. Năm 2023, Opodis vinh dự nhận <strong>Thư Cảm Ơn</strong> ghi nhận đóng góp trong hành trình 30 năm chiến dịch tình nguyện hè.
              </p>
            </div>

            {/* Hoạt động 2: Đồng hành chống dịch cùng HCDC */}
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80">
              <div className="rounded-xl overflow-hidden border border-gray-200 mb-2.5 shadow-2xs">
                <img
                  src={csrHcdcImg}
                  alt="Opodis trao tặng 10.000 chai sát khuẩn và quà tặng đến HCDC"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Tuyến đầu HCDC
                </span>
                <h3 className="text-[13px] font-bold text-gray-900">
                  Đồng hành cùng tuyến đầu chống đại dịch
                </h3>
              </div>
              <p className="text-[12px] leading-[18px] text-gray-600">
                Giai đoạn cao điểm chống dịch COVID-19, Opodis kịp thời trao tặng <strong>10.000 chai dung dịch sát khuẩn y tế</strong> và <strong>1.200 phần bánh</strong> đến Trung tâm Kiểm soát Bệnh tật TP.HCM (HCDC), được HCDC gửi Thư Cảm Ơn vinh danh nghĩa cử cao đẹp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DOANH NGHIỆP, NHÀ PHÂN PHỐI & 80+ BỆNH VIỆN */}
      <section id="about-network" className="mx-3.5 mb-4 scroll-mt-14">
        <div className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
          <div className="flex items-center space-x-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-primary-soft text-primary flex items-center justify-center flex-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Mạng lưới tin cậy</span>
              <h2 className="text-[16px] font-black text-gray-900 leading-tight">
                Hệ thống phân phối & Cơ sở pháp lý
              </h2>
            </div>
          </div>

          {/* Đối tác 80+ bệnh viện */}
          <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 mb-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[16px]">🏥</span>
              <h3 className="text-[13px] font-bold text-emerald-950">
                Tin dùng tại hơn 80+ Bệnh viện lớn toàn quốc
              </h3>
            </div>
            <p className="text-[12px] leading-[18px] text-emerald-900/80">
              Các sản phẩm Opodis Pharma hiện diện rộng rãi tại: Bệnh viện Từ Dũ, BV Hùng Vương, BV Chợ Rẫy, BV Nhi Đồng, Viện Pasteur, BV Đại học Y Dược... khẳng định độ tin cậy y khoa cao nhất.
            </p>
          </div>

          {/* Thông tin chi tiết 2 công ty */}
          <div className="space-y-3 text-[12.5px]">
            {/* Đơn vị sản xuất */}
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-start space-x-3">
              <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center justify-center p-1.5 flex-none mt-0.5">
                <img src={opodisLogo} alt="Opodis Pharma Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wide">Đơn vị sản xuất</span>
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
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-start space-x-3">
              <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center justify-center p-1.5 flex-none mt-0.5">
                <img src={triNghiaLogo} alt="Trí Nghĩa Pharma Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Nhà phân phối độc quyền</span>
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
            <h4 className="text-[12px] font-bold text-gray-700 mb-2">Gian hàng trực tuyến chính hãng:</h4>
            <div className="grid grid-cols-3 gap-2">
              <a
                href="https://shopee.vn/opodispharma"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-2 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-700 font-bold text-[11px] text-center hover:bg-orange-100 transition-colors"
              >
                Shopee Mall
              </a>
              <a
                href="https://www.lazada.vn/shop/mn7k3oup/"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-2 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-700 font-bold text-[11px] text-center hover:bg-blue-100 transition-colors"
              >
                Lazada Mall
              </a>
              <a
                href="https://www.tiktok.com/@opodis.pharma"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-800 font-bold text-[11px] text-center hover:bg-gray-200 transition-colors"
              >
                TikTok Shop
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. KÊNH THÔNG TIN CHÍNH THỨC & LIÊN HỆ */}
      <section className="mx-3.5 mb-4">
        <h2 className="text-[14px] font-black text-gray-900 mb-2.5 px-1 uppercase tracking-wide">
          Kênh liên hệ & Hỗ trợ trực tiếp
        </h2>
        <div className="space-y-2.5">
          {/* Website Opodis */}
          <a
            href="https://opodispharma.com/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs active:scale-[0.985] transition-all group"
          >
            <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
              <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center text-primary flex-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-medium text-gray-500">Website chính thức</span>
                <span className="text-[14px] font-bold text-primary truncate">
                  https://opodispharma.com/
                </span>
              </div>
            </div>
            <div className="text-gray-400 group-hover:text-primary transition-colors flex-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </a>

          {/* Hotline */}
          <a
            href="tel:02837582741"
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs active:scale-[0.985] transition-all group"
          >
            <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 flex-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-medium text-gray-500">Hotline tư vấn dược sĩ</span>
                <span className="text-[14px] font-bold text-primary truncate">(0283) 7582 741</span>
              </div>
            </div>
            <div className="text-gray-400 group-hover:text-primary transition-colors flex-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </a>
        </div>
      </section>

      {/* 9. WIDGET QUAN TÂM ZALO OA */}
      <section className="mx-3.5 mb-4">
        <FollowOAWidget />
      </section>
    </div>
  );
}
