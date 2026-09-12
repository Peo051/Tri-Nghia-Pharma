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
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-soft text-primary uppercase tracking-wider flex-none">
          Official
        </span>
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
