import React, { useState, useRef, useEffect, useCallback } from "react";
import { openOutApp, openWebview } from "zmp-sdk";

const STORAGE_POS_KEY = "floating_contact_pos_v2";
const STORAGE_COLLAPSE_KEY = "floating_contact_collapsed";
const BUTTON_WIDTH = 56;
const BUTTON_HEIGHT = 56;
const PADDING = 8;
const HEADER_OFFSET = 52;
const FOOTER_OFFSET = 68;

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

function getSafeBounds() {
  if (typeof window === "undefined") {
    return { minX: PADDING, maxX: 320, minY: HEADER_OFFSET, maxY: 600 };
  }
  const minX = PADDING;
  const maxX = Math.max(minX, window.innerWidth - BUTTON_WIDTH - PADDING);
  const minY = HEADER_OFFSET;
  const maxY = Math.max(minY, window.innerHeight - BUTTON_HEIGHT - FOOTER_OFFSET);
  return { minX, maxX, minY, maxY };
}

function getInitialPosition(): { x: number; y: number } {
  const bounds = getSafeBounds();
  if (typeof window === "undefined") {
    return { x: bounds.maxX, y: bounds.maxY };
  }
  try {
    const saved = localStorage.getItem(STORAGE_POS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed.x === "number" && typeof parsed.y === "number") {
        return {
          x: clamp(parsed.x, bounds.minX, bounds.maxX),
          y: clamp(parsed.y, bounds.minY, bounds.maxY),
        };
      }
    }
  } catch {}

  return {
    x: bounds.maxX,
    y: clamp(window.innerHeight - 150, bounds.minY, bounds.maxY),
  };
}

export default function FloatingContact() {
  const [position, setPosition] = useState<{ x: number; y: number }>(getInitialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_COLLAPSE_KEY) !== "true";
    } catch {
      return true;
    }
  });

  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const dragStartRef = useRef({ pointerX: 0, pointerY: 0, posX: 0, posY: 0 });

  // Tự động điều chỉnh hướng bung (bung xuống nếu ở nửa trên màn hình, bung lên nếu ở nửa dưới)
  const expandDirection = position.y < 240 ? "down" : "up";

  useEffect(() => {
    const handleResize = () => {
      const bounds = getSafeBounds();
      setPosition((prev) => ({
        x: clamp(prev.x, bounds.minX, bounds.maxX),
        y: clamp(prev.y, bounds.minY, bounds.maxY),
      }));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleExpand = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsExpanded((prev) => {
      const next = !prev;
      try {
        sessionStorage.setItem(STORAGE_COLLAPSE_KEY, String(!next));
      } catch {}
      return next;
    });
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    // Bỏ qua sự kiện kéo nếu nhấn vào nút thu gọn / mở rộng có data-no-drag
    if ((e.target as HTMLElement).closest('[data-no-drag="true"]')) {
      return;
    }
    isDraggingRef.current = false;
    hasMovedRef.current = false;
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!dragStartRef.current.pointerX && !dragStartRef.current.pointerY) return;
    const dx = e.clientX - dragStartRef.current.pointerX;
    const dy = e.clientY - dragStartRef.current.pointerY;

    if (!hasMovedRef.current && Math.hypot(dx, dy) > 10) {
      hasMovedRef.current = true;
      isDraggingRef.current = true;
      setIsDragging(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    }

    if (hasMovedRef.current) {
      const bounds = getSafeBounds();
      const newX = clamp(dragStartRef.current.posX + dx, bounds.minX, bounds.maxX);
      const newY = clamp(dragStartRef.current.posY + dy, bounds.minY, bounds.maxY);
      setPosition({ x: newX, y: newY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
    dragStartRef.current = { pointerX: 0, pointerY: 0, posX: 0, posY: 0 };
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}

      setIsDragging(false);
      try {
        localStorage.setItem(STORAGE_POS_KEY, JSON.stringify(position));
      } catch {}
      setTimeout(() => {
        hasMovedRef.current = false;
      }, 80);
    } else {
      hasMovedRef.current = false;
      setIsDragging(false);
    }
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    // Chỉ chặn click nếu thực sự vừa thực hiện kéo di chuyển
    if (hasMovedRef.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

const ZALO_OA_URL = "https://zalo.me/0789394239";
const MESSENGER_URL =
  "https://www.messenger.com/t/678768355318156/?messaging_source=source%3Apages%3Amessage_shortlink&source_id=1441792&recurring_notification=0";

const openExternalUrl = (url: string) => {
  try {
    openOutApp({ url }).catch(() => {
      try {
        openWebview({
          url,
          config: { style: "normal", leftButton: "back" },
          fail: () => {
            window.location.href = url;
          },
        });
      } catch {
        window.location.href = url;
      }
    });
  } catch {
    try {
      openWebview({
        url,
        config: { style: "normal", leftButton: "back" },
        fail: () => {
          window.location.href = url;
        },
      });
    } catch {
      window.location.href = url;
    }
  }
};

  const handleOpenZalo = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    openExternalUrl(ZALO_OA_URL);
  };

  const handleOpenMessenger = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    openExternalUrl(MESSENGER_URL);
  };

  // Danh sách 3 nút liên hệ nhanh
  const contactButtonsNode = (
    <div
      className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
        expandDirection === "up" ? "origin-bottom" : "origin-top"
      } ${
        isExpanded
          ? `opacity-100 scale-100 max-h-[260px] pointer-events-auto ${
              expandDirection === "up" ? "mb-1.5" : "mt-1.5"
            }`
          : `opacity-0 scale-75 max-h-0 pointer-events-none overflow-hidden ${
              expandDirection === "up" ? "-translate-y-2 mb-0" : "translate-y-2 mt-0"
            }`
      }`}
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
        <a
          href={MESSENGER_URL}
          target="_blank"
          rel="noreferrer"
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
        </a>
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
        <a
          href={ZALO_OA_URL}
          target="_blank"
          rel="noreferrer"
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
            <path
              d="M24 6C13.5 6 5 13.6 5 23c0 4.8 2.2 9.1 5.8 12.2l-1.6 6.3a1 1 0 001.3 1.2l6.9-3.4c2.1.6 4.3 1 6.6 1 10.5 0 19-7.6 19-17S34.5 6 24 6z"
              fill="#FFFFFF"
            />
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
        </a>
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
          onClick={(e) => {
            if (hasMovedRef.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
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
    </div>
  );

  // Nút Thu gọn / Mở rộng (Toggle Button)
  const toggleButtonNode = (
    <div className="relative w-14 h-10 flex items-center justify-center pointer-events-auto">
      {isExpanded ? (
        <button
          type="button"
          data-no-drag="true"
          onClick={toggleExpand}
          aria-label="Thu gọn liên hệ"
          title="Thu gọn"
          className="w-8 h-8 rounded-full bg-white text-gray-600 hover:text-primary active:scale-90 hover:scale-105 shadow-md border border-gray-200/90 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {expandDirection === "up" ? (
              <path d="M6 9l6 6 6-6" />
            ) : (
              <path d="M18 15l-6-6-6 6" />
            )}
          </svg>
        </button>
      ) : (
        <div className="relative w-14 h-14 flex items-center justify-center">
          <span
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-primary/25 floating-pulse-outer pointer-events-none"
            style={{ animationDelay: "0s" }}
          />
          <span
            className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-primary/40 floating-pulse-inner pointer-events-none"
            style={{ animationDelay: "0s" }}
          />
          <button
            type="button"
            onClick={toggleExpand}
            aria-label="Mở liên hệ tư vấn"
            title="Mở liên hệ tư vấn (giữ để kéo di chuyển)"
            className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex flex-col items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-90 transition-all cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center -space-y-0.5">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {expandDirection === "up" ? (
                  <path d="M18 15l-6-6-6 6" />
                ) : (
                  <path d="M6 9l6 6 6-6" />
                )}
              </svg>
            </div>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <aside
      aria-label="Liên hệ nhanh"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        touchAction: "none",
      }}
      className={`z-40 flex flex-col items-center select-none touch-none ${
        isDragging
          ? "cursor-grabbing opacity-95 scale-105"
          : "cursor-grab"
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClickCapture={handleClickCapture}
    >
      {/* Khi bung lên: Nút con ở trên, nút toggle ở dưới. Khi bung xuống: Nút toggle ở trên, nút con ở dưới */}
      {expandDirection === "up" ? (
        <>
          {contactButtonsNode}
          {toggleButtonNode}
        </>
      ) : (
        <>
          {toggleButtonNode}
          {contactButtonsNode}
        </>
      )}
    </aside>
  );
}

