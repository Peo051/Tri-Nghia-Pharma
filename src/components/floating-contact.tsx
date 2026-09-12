import React from "react";
import { openChat } from "zmp-sdk";

export default function FloatingContact() {
  const handleOpenZalo = () => {
    try {
      openChat({
        type: "oa",
        id: "4318657068771012646",
        message: "Xin chào Opodis Pharma, tôi cần tư vấn sản phẩm",
        success: () => {},
        fail: () => {
          window.open("https://zalo.me/02837582741", "_blank");
        },
      });
    } catch {
      window.open("https://zalo.me/02837582741", "_blank");
    }
  };

  const handleOpenMessenger = () => {
    window.open("https://m.me/opodispharma", "_blank");
  };

  return (
    <aside
      aria-label="Liên hệ nhanh"
      className="fixed right-2.5 bottom-[76px] z-40 flex flex-col items-center gap-1.5 select-none pointer-events-none"
    >
      {/* 1. Messenger Button */}
      <div className="relative w-14 h-14 flex items-center justify-center pointer-events-auto">
        <span
          className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#8b5cf6]/25 floating-pulse-outer pointer-events-none"
          style={{ animationDelay: "0s" }}
        />
        <span
          className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-[#8b5cf6]/40 floating-pulse-inner pointer-events-none"
          style={{ animationDelay: "0s" }}
        />
        <button
          type="button"
          onClick={handleOpenMessenger}
          aria-label="Chat qua Facebook Messenger"
          title="Chat qua Messenger"
          className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-[#9333ea] to-[#7c3aed] text-white flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-90 transition-transform cursor-pointer"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.517 3.735 7.209.195.144.316.368.324.61l.07 1.905c.023.637.674 1.053 1.24.786l2.122-.998c.19-.089.41-.097.607-.024.898.333 1.877.514 2.902.514 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.066 12.428l-2.545-2.715-4.966 2.715 5.46-5.797 2.609 2.715 4.903-2.715-5.461 5.797z" />
          </svg>
        </button>
      </div>

      {/* 2. Zalo Button */}
      <div className="relative w-14 h-14 flex items-center justify-center pointer-events-auto">
        <span
          className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#0068ff]/25 floating-pulse-outer pointer-events-none"
          style={{ animationDelay: "0.4s" }}
        />
        <span
          className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-[#0068ff]/40 floating-pulse-inner pointer-events-none"
          style={{ animationDelay: "0.4s" }}
        />
        <button
          type="button"
          onClick={handleOpenZalo}
          aria-label="Chat qua Zalo OA"
          title="Chat qua Zalo"
          className="relative z-10 w-10 h-10 rounded-full bg-[#0068ff] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-90 transition-transform cursor-pointer"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true"
          >
            {/* White speech bubble */}
            <path
              d="M24 6C13.5 6 5 13.6 5 23c0 4.8 2.2 9.1 5.8 12.2l-1.6 6.3a1 1 0 001.3 1.2l6.9-3.4c2.1.6 4.3 1 6.6 1 10.5 0 19-7.6 19-17S34.5 6 24 6z"
              fill="#FFFFFF"
            />
            {/* Blue Zalo stylized text inside */}
            <text
              x="24"
              y="28"
              textAnchor="middle"
              fill="#0068FF"
              fontFamily="Tahoma, sans-serif"
              fontWeight="900"
              fontSize="14"
              letterSpacing="-0.5"
            >
              Zalo
            </text>
          </svg>
        </button>
      </div>

      {/* 3. Hotline Call Button */}
      <div className="relative w-14 h-14 flex items-center justify-center pointer-events-auto">
        <span
          className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#dc2626]/25 floating-pulse-outer pointer-events-none"
          style={{ animationDelay: "0.8s" }}
        />
        <span
          className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-[#dc2626]/40 floating-pulse-inner pointer-events-none"
          style={{ animationDelay: "0.8s" }}
        />
        <a
          href="tel:02837582741"
          aria-label="Gọi hotline tư vấn: 0283 7582 741"
          title="Gọi Hotline: (0283) 7582 741"
          className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-white flex items-center justify-center shadow-lg shadow-red-500/30 hover:scale-105 active:scale-90 transition-transform cursor-pointer"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="animate-pulse"
            aria-hidden="true"
          >
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.44-5.15-3.75-6.59-6.59l1.97-1.57c.28-.28.36-.67.25-1.02A11.36 11.36 0 018.97 3.99c0-.55-.45-1-1-1H4.01c-.55 0-1 .45-1 1 0 9.39 7.63 17.02 17 17.02.55 0 1-.45 1-1v-3.99c0-.55-.45-1-1-1z" />
          </svg>
        </a>
      </div>
    </aside>
  );
}
