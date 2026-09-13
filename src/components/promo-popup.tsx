import React, { useEffect, useState } from "react";
import promoPopupImg from "@/static/promo-popup.jpg";

let hasDismissedPopup = false;

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!hasDismissedPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    hasDismissedPopup = true;
    setIsOpen(false);
  };

  const handleAction = () => {
    handleClose();
    const target =
      document.getElementById("flash-sale-heading") ||
      document.getElementById("home-products");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Khuyến mãi đặc biệt"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs select-none animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div
        className="relative max-w-[340px] w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút X đóng popup ở góc trên bên phải */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Đóng popup khuyến mãi"
          title="Đóng"
          className="absolute -top-3.5 -right-3.5 z-20 w-9 h-9 rounded-full bg-white text-gray-700 hover:text-black shadow-xl border border-gray-200/80 flex items-center justify-center hover:scale-110 active:scale-90 transition-all cursor-pointer"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Khung chứa ảnh Poster khuyến mãi */}
        <div
          onClick={handleAction}
          className="w-full rounded-xl overflow-hidden shadow-2xl border border-white/30 bg-white cursor-pointer group active:scale-[0.98] transition-transform"
        >
          <img
            src={promoPopupImg}
            alt="Opodis Pharma Sale 09.09 Deal Đỉnh Quà Xịn"
            className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>

        {/* Nút hành động nhanh bên dưới poster */}
        <button
          type="button"
          onClick={handleAction}
          className="mt-3.5 w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-primary to-primary-dark text-white font-extrabold text-[14px] shadow-lg shadow-primary/30 hover:brightness-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 font-display"
        >
          <span>SĂN DEAL NGAY</span>
          <span>→</span>
        </button>

        {/* Nút X phụ bên dưới tiện thao tác trên mobile */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Đóng"
          className="mt-3 text-white/80 hover:text-white text-[12px] font-medium underline underline-offset-4 cursor-pointer transition-colors"
        >
          Bỏ qua ưu đãi này
        </button>
      </div>
    </aside>
  );
}
