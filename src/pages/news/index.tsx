import React, { useState } from "react";
import { openWebview } from "zmp-sdk";
import opodisLogo from "@/static/logo-opodis.png";
import csaMeBauImg from "@/static/news/csa-me-bau.jpg";
import viemPhuKhoaTetImg from "@/static/news/viem-phu-khoa-tet.png";
import lacNoiMacImg from "@/static/news/lac-noi-mac-tu-cung.png";

interface NewsItem {
  id: string;
  title: string;
  category: "csa" | "market" | "sharing";
  categoryLabel: string;
  date: string;
  day: string;
  month: string;
  image: string;
  excerpt: string;
  link: string;
}

const NEWS_LIST: NewsItem[] = [
  {
    id: "hanh-trinh-yeu-thuong",
    title:
      "HÀNH TRÌNH YÊU THƯƠNG: OPODIS PHARMA ĐỒNG HÀNH CÙNG MẸ BẦU TẠI BỆNH VIỆN QUỐC TẾ CITY VÀ BỆNH VIỆN ĐA KHOA HOÀN MỸ THỦ ĐỨC",
    category: "csa",
    categoryLabel: "Hoạt động CSA",
    date: "18/08/2026",
    day: "18",
    month: "Aug",
    image: csaMeBauImg,
    excerpt:
      "Opodis Pharma xin gửi lời cảm ơn chân thành đến hàng trăm mẹ bầu đã tham gia ngày hội chăm sóc sức khỏe thai kỳ và đón nhận những phần quà ý nghĩa.",
    link: "https://opodispharma.com/index.php/2026/08/18/hanh-trinh-yeu-thuong-opodis-pharma-dong-hanh-cung-me-bau-tai-benh-vien-quoc-te-city-va-benh-vien-da-khoa-hoan-my-thu-duc/",
  },
  {
    id: "viem-nhiem-phu-khoa-tet",
    title: "Nguyên nhân gây viêm nhiễm phụ khoa thường gặp ngày Tết Nguyên Đán",
    category: "market",
    categoryLabel: "Tin tức thị trường",
    date: "11/02/2026",
    day: "11",
    month: "Feb",
    image: viemPhuKhoaTetImg,
    excerpt:
      "Dịp Tết Nguyên Đán là một trong những khoảng thời gian bận rộn nhất trong năm, các thói quen sinh hoạt thay đổi dễ dẫn đến viêm nhiễm phụ khoa nếu không chú ý chăm sóc đúng cách.",
    link: "https://opodispharma.com/index.php/2026/02/11/nguyen-nhan-gay-viem-nhiem-phu-khoa-thuong-gap-ngay-tet-nguyen-dan/",
  },
  {
    id: "lac-noi-mac-tu-cung",
    title:
      "Lạc nội mạc tử cung: Căn bệnh tiềm ẩn mà hàng triệu phụ nữ đang chịu đựng",
    category: "sharing",
    categoryLabel: "Góc chia sẻ",
    date: "06/02/2026",
    day: "06",
    month: "Feb",
    image: lacNoiMacImg,
    excerpt:
      "Lạc nội mạc tử cung (Endometriosis) là một trong những căn bệnh phụ khoa phổ biến nhưng thường bị xem nhẹ, gây ra những cơn đau mãn tính và ảnh hưởng khả năng làm mẹ.",
    link: "https://opodispharma.com/index.php/2026/02/06/lac-noi-mac-tu-cung-can-benh-tiem-an-ma-hang-trieu-phu-nu-dang-chiu-dung/",
  },
];

type CategoryFilter = "all" | "csa" | "market" | "sharing";

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "csa", label: "HOẠT ĐỘNG CSA" },
  { id: "market", label: "TIN TỨC THỊ TRƯỜNG" },
  { id: "sharing", label: "GÓC CHIA SẺ" },
];

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState<CategoryFilter>("all");

  const filteredNews =
    activeTab === "all"
      ? NEWS_LIST
      : NEWS_LIST.filter((item) => item.category === activeTab);

  const handleOpenLink = (url: string) => {
    try {
      openWebview({
        url,
        config: {
          style: "normal",
          leftButton: "back",
        },
        fail: () => {
          window.open(url, "_blank");
        },
      });
    } catch {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="w-full min-h-full pb-12 bg-background">
      {/* 1. Website Banner Box */}
      <div className="mx-4 mt-3.5 mb-4 rounded-2xl bg-gradient-to-br from-white via-primary-soft/40 to-primary-soft/80 border border-primary/20 p-3.5 shadow-[0_2px_10px_rgba(17,105,54,0.05)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-white p-1 border border-primary/20 shadow-xs flex items-center justify-center flex-none">
            <img
              src={opodisLogo}
              alt="Opodis Pharma"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <span className="text-[10.5px] font-bold text-primary uppercase tracking-wide block">
              Website chính thức
            </span>
            <h2 className="text-[13.5px] font-black text-foreground truncate">
              opodispharma.com
            </h2>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleOpenLink("https://opodispharma.com/")}
          className="flex-none px-3 py-1.5 rounded-xl bg-primary text-white text-[12px] font-bold hover:bg-primary-dark transition active:scale-95 shadow-xs flex items-center gap-1 cursor-pointer"
        >
          <span>Xem web</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </button>
      </div>

      {/* 2. Tiêu đề & Danh mục Tabs (Chuẩn theo ảnh mẫu) */}
      <section className="px-4 mb-3">
        <h1 className="text-[18px] leading-tight font-black text-primary uppercase tracking-tight mb-3">
          TIN TỨC VÀ SỰ KIỆN
        </h1>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-[12px] font-bold whitespace-nowrap transition cursor-pointer flex-none ${
                  isActive
                    ? "bg-[#116936] text-white shadow-xs"
                    : "bg-white text-primary/80 border border-primary/20 hover:bg-primary-soft/50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Danh sách bài viết Tin tức */}
      <div className="px-4 space-y-4">
        {filteredNews.map((item) => (
          <article
            key={item.id}
            onClick={() => handleOpenLink(item.link)}
            className="group rounded-2xl bg-white border border-border/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden cursor-pointer hover:shadow-md transition-all active:scale-[0.99] flex flex-col"
          >
            {/* Hình ảnh bài viết với Date Badge góc trái */}
            <div className="relative w-full aspect-[16/9] bg-section/40 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Date Badge chuẩn theo ảnh mẫu */}
              <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-xs border-2 border-[#116936] rounded-md px-2 py-1 flex flex-col items-center justify-center min-w-[38px] shadow-xs">
                <span className="text-[14px] font-black text-[#116936] leading-none">
                  {item.day}
                </span>
                <span className="text-[9.5px] font-bold text-[#116936] uppercase leading-tight mt-0.5">
                  {item.month}
                </span>
              </div>

              {/* Category label pill góc phải */}
              <div className="absolute top-2.5 right-2.5 z-10 bg-black/55 backdrop-blur-xs text-white text-[10.5px] font-semibold px-2 py-0.5 rounded-full">
                {item.categoryLabel}
              </div>
            </div>

            {/* Nội dung bài viết */}
            <div className="p-3.5 flex flex-col flex-1">
              <h2 className="text-[14px] leading-[20px] font-bold text-primary group-hover:text-primary-dark transition line-clamp-2 uppercase tracking-tight mb-1.5">
                {item.title}
              </h2>

              <p className="text-[12px] leading-[18px] text-subtitle line-clamp-2 mb-3 flex-1">
                {item.excerpt}
              </p>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11.5px] font-semibold text-primary">
                <span>Đọc bài viết trên opodispharma.com</span>
                <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  <span>→</span>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
