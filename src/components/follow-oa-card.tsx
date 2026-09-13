import React, { useEffect, useState } from "react";
import { followOA, openChat, showOAWidget } from "zmp-sdk";
import opodisLogo from "@/static/logo-opodis.png";

interface FollowOAProps {
  guidingText?: string;
  className?: string;
}

export default function FollowOAWidget({
  guidingText = "Quan tâm OA để nhận các đặc quyền ưu đãi",
  className = "",
}: FollowOAProps) {
  const [followed, setFollowed] = useState(false);
  const [hasNativeWidget, setHasNativeWidget] = useState(false);
  const rawId = React.useId();
  const widgetContainerId = "oaWidget_" + rawId.replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    try {
      showOAWidget({
        id: widgetContainerId,
        guidingText,
        color: "#FFFFFF",
        onStatusChange: (isFollowed) => {
          if (typeof isFollowed === "boolean") {
            setFollowed(isFollowed);
          }
        },
      })
        .then(() => {
          setTimeout(() => {
            const el = document.getElementById(widgetContainerId);
            if (el && el.querySelector("iframe")) {
              setHasNativeWidget(true);
            }
          }, 350);
        })
        .catch(() => {});
    } catch {}
  }, [widgetContainerId, guidingText]);

  const handleFollow = async () => {
    try {
      await followOA({
        id: "4318657068771012646",
        showDialogConfirm: true,
      });
      setFollowed(true);
    } catch {
      try {
        openChat({
          type: "oa",
          id: "4318657068771012646",
          message: "Xin chào Opodis Pharma, tôi muốn quan tâm OA",
        });
      } catch {
        window.open("https://zalo.me/0789394239", "_blank");
      }
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Container widget native Zalo OA */}
      <div
        id={widgetContainerId}
        className={hasNativeWidget ? "w-full" : "hidden"}
      />

      {/* Fallback & Custom Styled OA Card (Chuẩn theo giao diện Zalo OA) */}
      {!hasNativeWidget && (
        <div className="w-full rounded-2xl bg-white border border-border/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-4 transition-all">
          <p className="text-[13.5px] font-semibold text-foreground/85 leading-snug mb-3">
            {guidingText}
          </p>
          <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {/* Logo / Avatar với verified checkmark badge */}
              <div className="relative w-11 h-11 flex-none">
                <div className="w-11 h-11 rounded-2xl bg-white p-1 border border-primary/20 shadow-xs flex items-center justify-center overflow-hidden">
                  <img
                    src={opodisLogo}
                    alt="Opodis Pharma"
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Verified Checkmark Badge */}
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#f59e0b] border-2 border-white flex items-center justify-center shadow-xs"
                  title="Official Account đã xác thực"
                >
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>

              {/* Tên OA & Official Account: Luôn hiển thị đầy đủ, không bị cắt chữ hay ba chấm */}
              <div className="min-w-0 flex-1">
                <h4 className="text-[14px] font-bold text-foreground leading-tight whitespace-nowrap">
                  Opodis Pharma
                </h4>
                <p className="text-[11.5px] text-subtitle leading-tight mt-0.5 whitespace-nowrap">
                  Official Account
                </p>
              </div>
            </div>

            {/* Nút Quan tâm: Kích thước tinh gọn, đảm bảo không gian cho tên thương hiệu */}
            <button
              type="button"
              onClick={handleFollow}
              className={`flex-none px-3.5 py-1.5 rounded-xl text-[12.5px] font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1 active:scale-95 ${
                followed
                  ? "bg-section text-subtitle border border-border/80"
                  : "bg-[#0068ff] hover:bg-[#0058db] text-white"
              }`}
            >
              {followed ? (
                <>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Đã quan tâm</span>
                </>
              ) : (
                <span>Quan tâm</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
