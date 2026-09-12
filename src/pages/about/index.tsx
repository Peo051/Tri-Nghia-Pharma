import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import triNghiaLogo from "@/static/logo-tringhia.png";
import opodisLogo from "@/static/logo-opodis.png";
import FollowOAWidget from "@/components/follow-oa-card";

import factory1Img from "@/static/about/factory-1.webp";
import factory2Img from "@/static/about/factory-2.webp";
import csrMuaThiImg from "@/static/about/csr-mua-thi.webp";
import csrHcdcImg from "@/static/about/csr-hcdc.webp";

const NAV_SECTIONS = [
  { id: "story", label: "Câu chuyện thảo dược" },
  { id: "factory", label: "Nhà máy chuẩn WHO" },
  { id: "products", label: "Giải pháp nổi bật" },
  { id: "mission", label: "Sứ mệnh & Cam kết" },
  { id: "csr", label: "Trách nhiệm xã hội" },
  { id: "network", label: "Điểm bán & Liên hệ" },
];

const HERBS = [
  {
    name: "Tràm Gió Tự Nhiên",
    latin: "Melaleuca cajuputi",
    badge: "Hoạt chất α-Terpineol",
    desc: "Kháng khuẩn, kháng nấm tự nhiên vượt trội, dịu nhẹ tối đa và an toàn tuyệt đối ngay cả với làn da nhạy cảm của mẹ bầu và trẻ sơ sinh.",
    color: "from-emerald-500/10 to-emerald-500/5",
  },
  {
    name: "Cao Trầu Không Chuẩn Hóa",
    latin: "Piper betle",
    badge: "Bảo vệ niêm mạc",
    desc: "Làm sạch sâu, khử mùi vùng nhạy cảm, duy trì hệ vi sinh khỏe mạnh và mang đến cảm giác thoáng sạch tự tin suốt cả ngày dài.",
    color: "from-teal-500/10 to-teal-500/5",
  },
  {
    name: "Cao Hạt Ngò Tinh Khiết",
    latin: "Coriandrum sativum",
    badge: "Thanh lọc biểu bì",
    desc: "Thải độc tự nhiên, làm mát tức thì, chống viêm và giải tỏa nhanh chóng cảm giác ngứa ngáy, khó chịu cho làn da mẫn cảm.",
    color: "from-green-500/10 to-green-500/5",
  },
  {
    name: "Kim Ngân Hoa & Cúc La Mã",
    latin: "Lonicera & Chamomile",
    badge: "Xoa dịu mẩn ngứa",
    desc: "Bộ đôi thảo mộc lành tính làm dịu rôm sẩy, hăm tã, cấp ẩm mềm mượt và phục hồi làn da non nớt của bé yêu một cách êm ái.",
    color: "from-amber-500/10 to-amber-500/5",
  },
  {
    name: "Lá Olive Sinh Học",
    latin: "Olea europaea",
    badge: "Chống oxy hóa",
    desc: "Giàu Oleuropein tự nhiên giúp tăng cường hàng rào tự bảo vệ của da, duy trì vẻ khỏe khoắn trước ô nhiễm và khói bụi đô thị.",
    color: "from-lime-500/10 to-lime-500/5",
  },
];

const PRODUCT_PILLARS = [
  {
    title: "OPODIS FAMILY PREMIUM",
    badge: "Thấu hiểu phụ nữ",
    desc: "Nâng niu từng giai đoạn cuộc đời phái đẹp – từ tuổi dậy thì, thanh xuân đến thiên chức làm mẹ với công thức cân bằng pH lý tưởng, lưu hương nhẹ nhàng quyến rũ.",
    highlight: "Phytogyno Mom • Phytogyno Lady • Phytogyno Teen • Phytogyno Girl",
  },
  {
    title: "CHĂM SÓC MẸ VÀ BÉ",
    badge: "Dịu lành như tình mẹ",
    desc: "Bảo bọc làn da bé yêu khỏi rôm sẩy, hăm kẽ và côn trùng cắn bằng tinh chất thảo dược dịu nhẹ, cho mẹ trọn vẹn an tâm trong từng khoảnh khắc nuôi con.",
    highlight: "Sữa tắm rôm sẩy Phytobebe • Baby Care • Xịt xua muỗi an toàn",
  },
  {
    title: "CHĂM SÓC GIA ĐÌNH & NAM GIỚI",
    badge: "Khô thoáng & Khỏe mạnh",
    desc: "Vệ sinh nam giới Opolux sạch sâu, khử mùi khô thoáng suốt 24h; kết hợp xịt họng thảo dược Opflu bảo vệ đường hô hấp cho cả nhà trước tác nhân gây bệnh.",
    highlight: "Vệ sinh nam Opolux • Xịt họng thảo dược Opflu • Tinh dầu Phytamin",
  },
  {
    title: "SÁT KHUẨN Y TẾ CHUYÊN DỤNG",
    badge: "Chuẩn mực bệnh viện",
    desc: "Tiêu chuẩn diệt khuẩn nghiêm ngặt đạt chuẩn phòng mổ y tế, khử khuẩn nhanh và bảo vệ dài lâu, được hơn 80 bệnh viện tuyến đầu tin dùng.",
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
      {/* 1. HERO BANNER: THƯƠNG HIỆU 25 NĂM */}
      <section className="mx-3.5 mt-3 mb-4 rounded-3xl bg-gradient-to-br from-[#0B4A24] via-[#116936] to-[#08351B] text-white p-5 relative overflow-hidden shadow-xl shadow-primary/25">
        {/* Nền ánh sáng mờ tạo chiều sâu cao cấp */}
        <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-52 h-52 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Huy hiệu 25 Năm */}
          <div className="inline-block px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-[11px] font-extrabold uppercase tracking-wider mb-3 backdrop-blur-xs">
            Hành trình 25 năm • Bảo vệ triệu gia đình Việt
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

          <h1 className="text-[23px] leading-[30px] font-black tracking-tight text-white">
            TINH HOA DƯỢC THẢO VIỆT
          </h1>
          <p className="text-[16px] leading-[23px] font-extrabold text-emerald-200 mt-0.5">
            Chăm sóc sức khỏe chuẩn y khoa
          </p>

          <p className="text-[12.5px] leading-[20px] text-white/90 mt-2.5 max-w-[330px]">
            Kế thừa hơn 25 năm nghiên cứu từ <strong>Dược liệu Trung Ương 2</strong>, Opodis Pharma tiên phong chuẩn hóa dược thảo Việt theo tiêu chuẩn GMP-WHO khắt khe nhất, trao gửi sự an tâm tuyệt đối và chăm sóc trọn vẹn sức khỏe cho bạn và gia đình mỗi ngày.
          </p>

          {/* 4 Chỉ số giá trị thương hiệu */}
          <div className="mt-4 pt-3.5 border-t border-white/15 grid grid-cols-4 gap-1.5 text-center">
            <div className="flex flex-col bg-white/10 rounded-2xl py-2 px-1 backdrop-blur-xs border border-white/10">
              <span className="text-[17px] font-black text-amber-300 leading-tight">25+</span>
              <span className="text-[9px] text-white/85 font-medium leading-tight mt-0.5">Năm uy tín</span>
            </div>
            <div className="flex flex-col bg-white/10 rounded-2xl py-2 px-1 backdrop-blur-xs border border-white/10">
              <span className="text-[15px] font-black text-white leading-tight">GMP</span>
              <span className="text-[9px] text-white/85 font-medium leading-tight mt-0.5">Chuẩn WHO</span>
            </div>
            <div className="flex flex-col bg-white/10 rounded-2xl py-2 px-1 backdrop-blur-xs border border-white/10">
              <span className="text-[17px] font-black text-amber-300 leading-tight">80+</span>
              <span className="text-[9px] text-white/85 font-medium leading-tight mt-0.5">Viện tin dùng</span>
            </div>
            <div className="flex flex-col bg-white/10 rounded-2xl py-2 px-1 backdrop-blur-xs border border-white/10">
              <span className="text-[15px] font-black text-white leading-tight">Triệu</span>
              <span className="text-[9px] text-white/85 font-medium leading-tight mt-0.5">Gia đình tin yêu</span>
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
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all flex-none cursor-pointer ${
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
          <div className="mb-3">
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Bí quyết từ thiên nhiên</span>
            <h2 className="text-[16px] font-black text-gray-900 leading-tight mt-0.5">
              Sức mạnh kháng khuẩn tự nhiên từ đại ngàn tràm gió
            </h2>
          </div>

          <div className="space-y-2.5 text-[13px] leading-[21px] text-gray-700 font-normal">
            <p>
              Khởi nguồn từ <strong>Công ty Dược liệu Trung Ương 2</strong> giữa rừng tràm gió miền Trung, Opodis Pharma dày công nghiên cứu và khai mở hoạt chất vàng <strong>α-Terpineol</strong> tự nhiên – giải pháp kháng khuẩn, làm dịu viêm vượt trội nhưng hoàn toàn êm dịu, không gây kích ứng.
            </p>
            <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/70">
              <p className="text-[12.5px] text-emerald-950 font-medium italic">
                “Kết hợp tinh hoa y học cổ truyền ngàn năm cùng công nghệ chiết xuất hiện đại, 5 công thức thảo dược kinh điển ra đời để chăm sóc dịu lành cho làn da nhạy cảm nhất của bạn và gia đình.”
              </p>
            </div>
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
                    <h3 className="text-[13px] font-bold text-gray-900">{herb.name}</h3>
                    <span className="text-[11px] text-gray-500 italic">({herb.latin})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-primary text-[10px] font-extrabold border border-primary/20 flex-none shadow-2xs">
                    {herb.badge}
                  </span>
                </div>
                <p className="text-[12px] text-gray-600 leading-[18px]">
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
          <div className="mb-3">
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Cam kết chất lượng đỉnh cao</span>
            <h2 className="text-[16px] font-black text-gray-900 leading-tight mt-0.5">
              Nhà máy chuẩn GMP-WHO — An tâm trên từng giọt sản phẩm
            </h2>
          </div>

          <p className="text-[13px] leading-[21px] text-gray-700">
            Tại Opodis Pharma, chất lượng không dừng lại ở lời hứa mà được chứng minh trên từng lô sản phẩm xuất xưởng. Toàn bộ quy trình sản xuất khép kín tại <strong>Nhà máy Tây Ninh đạt bộ 3 chứng nhận quốc tế danh giá: GMP-WHO, CGMP-ASEAN và ISO 13485:2016</strong>, bảo toàn trọn vẹn hoạt tính sinh học tự nhiên.
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
              <span className="text-[10px] text-gray-600 mt-0.5 leading-tight">Dược phẩm chuẩn thế giới</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-teal-50/70 border border-teal-200/60 text-center flex flex-col items-center">
              <span className="text-[13px] font-black text-teal-800">CGMP-ASEAN</span>
              <span className="text-[10px] text-gray-600 mt-0.5 leading-tight">Dược mỹ phẩm quốc tế</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-center flex flex-col items-center">
              <span className="text-[13px] font-black text-blue-800">ISO 13485</span>
              <span className="text-[10px] text-gray-600 mt-0.5 leading-tight">Thiết bị y tế an toàn</span>
            </div>
          </div>

          {/* Phòng kiểm nghiệm HPLC, GC, UV-Vis */}
          <div className="mt-4 pt-3.5 border-t border-gray-100">
            <h3 className="text-[14px] font-bold text-gray-900 mb-1.5">
              Hệ thống kiểm soát chất lượng chuẩn quốc tế HPLC, GC, UV-Vis
            </h3>
            <p className="text-[12.5px] leading-[20px] text-gray-600 mb-3">
              Chất lượng được chứng minh bằng khoa học thực nghiệm. Từng lô sản phẩm đều được phân tích hoạt chất và kiểm định vi sinh độc lập bằng hệ thống máy móc sắc ký tối tân, cam kết độ an toàn và ổn định sinh học tuyệt đối trước khi trao gửi đến khách hàng.
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
          <div className="mb-3">
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Giải pháp theo nhu cầu</span>
            <h2 className="text-[16px] font-black text-gray-900 leading-tight mt-0.5">
              Hệ sinh thái chăm sóc sức khỏe toàn diện cho cả gia đình
            </h2>
          </div>

          <p className="text-[12.5px] leading-[19px] text-gray-600 mb-3.5">
            Được nghiên cứu chuyên sâu để thấu hiểu và đáp ứng tối ưu từng giai đoạn cuộc sống, mang đến sự chăm sóc dịu lành và bảo vệ toàn diện:
          </p>

          <div className="space-y-3">
            {PRODUCT_PILLARS.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-200/80 hover:border-primary/30 transition-all flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-[13px] font-bold text-gray-900">{item.title}</h3>
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
            <span>Khám phá ngay giải pháp phù hợp với bạn</span>
            <span>→</span>
          </button>
        </div>
      </section>

      {/* 5. SỨ MỆNH & TẦM NHÌN */}
      <section id="about-mission" className="mx-3.5 mb-4 scroll-mt-14">
        <div className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
          <div className="mb-3">
            <span className="text-[11px] font-bold text-amber-700 tracking-wider uppercase">Giá trị cốt lõi</span>
            <h2 className="text-[16px] font-black text-gray-900 leading-tight mt-0.5">
              Sứ mệnh phụng sự & Tầm nhìn tương lai
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/70">
              <h3 className="text-[13px] font-black text-primary mb-1">
                Sứ Mệnh — Gìn giữ tinh hoa, nâng tầm chuẩn mực Việt
              </h3>
              <p className="text-[12px] leading-[18px] text-gray-600">
                Đưa tinh hoa dược thảo Việt Nam tiệm cận chuẩn mực y tế quốc tế, để bất kỳ gia đình nào cũng có thể an tâm sử dụng sản phẩm chăm sóc sức khỏe chất lượng cao, an toàn với chi phí hợp lý nhất.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-200/70">
              <h3 className="text-[13px] font-black text-blue-800 mb-1">
                Tầm Nhìn — Vì sức khỏe cộng đồng, vì niềm tin người Việt
              </h3>
              <p className="text-[12px] leading-[18px] text-gray-600">
                Trở thành biểu tượng niềm tin hàng đầu về dược liệu chuẩn y khoa tại Việt Nam, mang đến giải pháp chăm sóc sức khỏe bền vững, hạnh phúc cho hàng triệu gia đình.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOẠT ĐỘNG XÃ HỘI & TRÁCH NHIỆM CỘNG ĐỒNG (CSR) */}
      <section id="about-csr" className="mx-3.5 mb-4 scroll-mt-14">
        <div className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
          <div className="mb-2.5">
            <span className="text-[11px] font-bold text-rose-600 tracking-wider uppercase">Trách nhiệm cộng đồng</span>
            <h2 className="text-[16px] font-black text-gray-900 leading-tight mt-0.5">
              Khoa học và nhân ái — 25 năm lan tỏa yêu thương
            </h2>
          </div>

          <p className="text-[12.5px] leading-[19px] text-gray-600 mb-3.5">
            Opodis Pharma luôn tin rằng giá trị lớn nhất của khoa học là mang lại cuộc sống tốt đẹp hơn. Chúng tôi tự hào đồng hành cùng các chiến dịch nhân văn vì thế hệ tương lai và lực lượng y tế:
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
                  Tiếp sức mùa thi — Chắp cánh ước mơ tri thức
                </h3>
              </div>
              <p className="text-[12px] leading-[18px] text-gray-600">
                Đồng hành cùng chương trình <em>“Tiếp sức mùa thi”</em> của Thành Đoàn TP.HCM suốt 30 năm chiến dịch tình nguyện hè, trao gửi hàng ngàn phần quà tiếp thêm năng lượng cho sĩ tử vượt vũ môn. Năm 2023, Opodis vinh dự nhận <strong>Thư Cảm Ơn</strong> ghi nhận đóng góp bền bỉ.
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
                  Đồng hành cùng tuyến đầu — Chung tay vì sức khỏe cộng đồng
                </h3>
              </div>
              <p className="text-[12px] leading-[18px] text-gray-600">
                Giai đoạn cao điểm phòng chống đại dịch, Opodis kịp thời chi viện <strong>10.000 chai dung dịch sát khuẩn y tế</strong> và <strong>1.200 phần bánh</strong> đến Trung tâm Kiểm soát Bệnh tật TP.HCM (HCDC), góp phần tạo nên lá chắn phòng dịch vững vàng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DOANH NGHIỆP, NHÀ PHÂN PHỐI & 80+ BỆNH VIỆN */}
      <section id="about-network" className="mx-3.5 mb-4 scroll-mt-14">
        <div className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
          <div className="mb-3">
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Bảo chứng niềm tin</span>
            <h2 className="text-[16px] font-black text-gray-900 leading-tight mt-0.5">
              Hơn 80 bệnh viện lớn & Mạng lưới phân phối uy tín
            </h2>
          </div>

          {/* Đối tác 80+ bệnh viện */}
          <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 mb-3.5">
            <h3 className="text-[13px] font-bold text-emerald-950 mb-1">
              Bác sĩ và chuyên gia tại hơn 80 bệnh viện lớn tin chọn
            </h3>
            <p className="text-[12px] leading-[18px] text-emerald-900/80">
              Sự hiện diện tại các bệnh viện đầu ngành như Bệnh viện Từ Dũ, BV Hùng Vương, BV Chợ Rẫy, BV Nhi Đồng, Viện Pasteur... chính là bảo chứng vững chắc nhất cho chất lượng và độ an toàn của Opodis Pharma.
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
                <span className="text-[10px] font-bold text-primary uppercase tracking-wide">Đơn vị sản xuất chuẩn GMP-WHO</span>
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
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Nhà phân phối độc quyền toàn quốc</span>
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
          Kết nối với chuyên gia Opodis Pharma
        </h2>
        <div className="space-y-2.5">
          {/* Website Opodis */}
          <a
            href="https://opodispharma.com/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs active:scale-[0.985] transition-all group"
          >
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-[11px] font-medium text-gray-500">Website chính thức</span>
              <span className="text-[14px] font-bold text-primary truncate">
                https://opodispharma.com/
              </span>
            </div>
            <span className="text-primary font-bold text-[13px] flex-none">
              Khám phá ngay →
            </span>
          </a>

          {/* Hotline */}
          <a
            href="tel:02837582741"
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs active:scale-[0.985] transition-all group"
          >
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-[11px] font-medium text-gray-500">Hotline tư vấn dược sĩ 24/7</span>
              <span className="text-[14px] font-bold text-primary truncate">(0283) 7582 741</span>
            </div>
            <span className="text-primary font-bold text-[13px] flex-none">
              Tư vấn ngay →
            </span>
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
