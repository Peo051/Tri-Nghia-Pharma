import { useLocation, useNavigate } from "react-router-dom";
import { BackIcon } from "./vectors";
import { useRouteHandle } from "@/hooks";
import opodisLogo from "@/static/logo-opodis.png";
import { useAtomValue } from "jotai";
import { userState } from "@/state";
import { Suspense } from "react";
import TransitionLink from "./transition-link";

function UserHeaderAvatar() {
  const user = useAtomValue(userState);

  return (
    <TransitionLink
      to="/customer"
      className="w-8 h-8 rounded-full overflow-hidden border border-primary/30 bg-primary-soft flex items-center justify-center flex-none hover:ring-2 hover:ring-primary/20 active:scale-95 transition-all shadow-xs cursor-pointer"
      aria-label="Trang cá nhân khách hàng"
    >
      {user?.userInfo?.avatar ? (
        <img
          src={user.userInfo.avatar}
          alt={user.userInfo.name || "User avatar"}
          className="w-full h-full object-cover"
        />
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )}
    </TransitionLink>
  );
}

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

      <Suspense
        fallback={
          <div className="w-8 h-8 rounded-full bg-primary-soft animate-pulse flex-none" />
        }
      >
        <UserHeaderAvatar />
      </Suspense>
    </header>
  );
}


