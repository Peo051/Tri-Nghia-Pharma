import { useAtomValue } from "jotai";
import {
  UIMatch,
  useLocation,
  useMatches,
  useNavigate,
} from "react-router-dom";
import { categoriesStateUpwrapped } from "@/state";
import { BackIcon } from "./vectors";
import { useMemo } from "react";
import { useRouteHandle } from "@/hooks";
import opodisLogo from "@/static/logo-opodis.png";

export default function Header() {
  const categories = useAtomValue(categoriesStateUpwrapped);
  const navigate = useNavigate();
  const location = useLocation();
  const [handle, match] = useRouteHandle();

  const title = useMemo(() => {
    if (handle) {
      if (typeof handle.title === "function") {
        return handle.title({ categories, params: match.params });
      } else {
        return handle.title;
      }
    }
  }, [handle, categories]);

  const showBack = location.key !== "default" && handle?.back !== false;

  if (handle?.logo) {
    return (
      <header className="h-14 w-full flex items-center justify-between px-4 py-2 bg-background border-b border-border/70 flex-none pr-[106px] shadow-[0_1px_4px_rgba(17,105,54,0.04)]">
        <div className="flex items-center min-w-0">
          <img
            src={opodisLogo}
            alt="Opodis Pharma Logo"
            className="h-8 max-h-8 w-auto object-contain object-left"
          />
        </div>
        <div className="flex items-center space-x-1.5 flex-none">
          <button
            type="button"
            onClick={() => navigate("/search")}
            aria-label="Tìm kiếm sản phẩm"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-section active:bg-section/80 text-foreground/80 transition cursor-pointer"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-soft text-primary uppercase tracking-wider flex-none">
            Official
          </span>
        </div>
      </header>
    );
  }

  return (
    <header className="h-12 w-full flex items-center pl-2 pr-[106px] py-1.5 space-x-1.5 bg-background border-b border-border/60 flex-none justify-between">
      <div className="flex items-center min-w-0 flex-1 space-x-1.5">
        {showBack && (
          <button
            type="button"
            aria-label="Quay lại"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-section active:bg-section/80 transition cursor-pointer text-foreground flex-none"
            onClick={() => navigate(-1)}
          >
            <BackIcon />
          </button>
        )}
        <h1 className="text-page-title truncate flex-1 font-semibold">{title}</h1>
      </div>
      {location.pathname !== "/search" && (
        <button
          type="button"
          onClick={() => navigate("/search")}
          aria-label="Tìm kiếm sản phẩm"
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-section active:bg-section/80 text-foreground/80 transition cursor-pointer flex-none ml-1"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      )}
    </header>
  );
}

