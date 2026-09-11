import { AboutNavIcon, ProductNavIcon } from "./vectors";
import TransitionLink from "./transition-link";
import { useLocation } from "react-router-dom";

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ active?: boolean }>;
  isActiveRoute: (pathname: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "Sản phẩm",
    path: "/",
    icon: ProductNavIcon,
    isActiveRoute: (pathname) => pathname === "/" || pathname.startsWith("/product"),
  },
  {
    name: "Giới thiệu",
    path: "/about",
    icon: AboutNavIcon,
    isActiveRoute: (pathname) => pathname.startsWith("/about"),
  },
];

export default function Footer() {
  const location = useLocation();

  return (
    <footer className="w-full flex-none bg-background border-t border-border z-30 shadow-[0_-2px_8px_rgba(0,0,0,0.03)]">
      <nav
        aria-label="Điều hướng chính"
        className="w-full max-w-lg mx-auto px-4 pt-1.5 grid"
        style={{
          gridTemplateColumns: `repeat(${NAV_ITEMS.length}, 1fr)`,
          paddingBottom: `max(12px, env(safe-area-inset-bottom))`,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = item.isActiveRoute(location.pathname);

          return (
            <TransitionLink
              to={item.path}
              key={item.path}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive ? "text-primary font-semibold" : "text-subtitle font-normal hover:text-foreground"
              }`}
            >
              <div
                className={`w-9 h-7 flex items-center justify-center rounded-pill transition-colors ${
                  isActive ? "bg-primary-soft" : "bg-transparent"
                }`}
              >
                <item.icon active={isActive} />
              </div>
              <span
                className={`text-[12px] leading-4 mt-0.5 tracking-tight ${
                  isActive ? "text-primary font-semibold" : "text-subtitle"
                }`}
              >
                {item.name}
              </span>
            </TransitionLink>
          );
        })}
      </nav>
    </footer>
  );
}
