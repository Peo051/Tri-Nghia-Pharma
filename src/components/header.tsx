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
      <header className="h-14 w-full flex items-center justify-between px-4 py-2 bg-primary text-white flex-none pr-[106px] shadow-[0_2px_10px_rgba(17,105,54,0.16)]">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white text-primary flex items-center justify-center font-black text-lg shadow-sm flex-none">
            O
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] font-bold tracking-tight leading-tight truncate">
              OPODIS PHARMA
            </span>
            <span className="text-[10.5px] text-white/75 leading-none font-normal mt-0.5 truncate">
              Dược phẩm & chăm sóc sức khỏe
            </span>
          </div>
        </div>
        <span className="text-[10px] font-semibold tracking-[0.12em] text-white/80 uppercase flex-none">
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
