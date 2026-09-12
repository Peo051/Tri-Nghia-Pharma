import { useLocation, useNavigate } from "react-router-dom";
import { BackIcon } from "./vectors";
import { useRouteHandle } from "@/hooks";
import opodisLogo from "@/static/logo-opodis.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [handle] = useRouteHandle();

  const showBack = location.key !== "default" && handle?.back !== false;

  return (
    <header className="h-14 w-full flex items-center px-4 py-2 bg-background border-b border-border/70 flex-none pr-[106px] shadow-[0_1px_4px_rgba(17,105,54,0.04)] justify-between">
      <div className="flex items-center space-x-1.5 min-w-0">
        {showBack && (
          <button
            type="button"
            aria-label="Quay lại"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-section active:bg-section/80 transition cursor-pointer text-foreground flex-none -ml-1.5 mr-0.5"
            onClick={() => navigate(-1)}
          >
            <BackIcon />
          </button>
        )}
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


