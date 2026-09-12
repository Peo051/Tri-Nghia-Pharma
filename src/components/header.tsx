import { useAtomValue } from "jotai";
import {
  UIMatch,
  useLocation,
  useMatches,
  useNavigate,
} from "react-router-dom";
import { categoriesStateUpwrapped } from "@/state";
import triNghiaLogo from "@/static/logo-tringhia.png";
import { BackIcon } from "./vectors";
import { useMemo } from "react";
import { useRouteHandle } from "@/hooks";

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
      <header className="h-14 w-full flex items-center justify-between px-4 py-2 bg-background border-b border-border/60 flex-none pr-[106px]">
        <div className="flex items-center space-x-2.5">
          <img
            src={triNghiaLogo}
            alt="Logo Trí Nghĩa Pharma"
            className="w-9 h-9 rounded-full object-contain flex-none shadow-xs border border-border/60 bg-white p-0.5"
          />
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="text-[14px] font-bold text-primary tracking-tight leading-tight">
                OPODIS PHARMA
              </span>
              <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-primary-soft text-primary font-bold tracking-wide border border-primary/15">
                TRÍ NGHĨA
              </span>
            </div>
            <span className="text-[11px] text-subtitle leading-none font-normal mt-0.5">
              Dược phẩm & Khử khuẩn y tế
            </span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-12 w-full flex items-center pl-2 pr-[106px] py-1.5 space-x-1.5 bg-background border-b border-border/60 flex-none">
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
    </header>
  );
}
