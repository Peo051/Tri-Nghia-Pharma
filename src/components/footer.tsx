import {
  AboutNavIcon,
  CategoryIcon,
  HomeIcon,
  OffersNavIcon,
  ProfileIcon,
} from "./vectors";
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
    name: "Trang chủ",
    path: "/",
    icon: HomeIcon,
    isActiveRoute: (pathname) => pathname === "/" || pathname.startsWith("/product"),
  },
  {
    name: "Danh mục",
    path: "/catalog",
    icon: CategoryIcon,
    isActiveRoute: (pathname) =>
      pathname.startsWith("/catalog") ||
      pathname.startsWith("/categories") ||
      pathname.startsWith("/category/"),
  },
  {
    name: "Ưu đãi",
    path: "/offers",
    icon: OffersNavIcon,
    isActiveRoute: (pathname) => pathname.startsWith("/offers"),
  },
  {
    name: "Khách hàng",
    path: "/customer",
    icon: ProfileIcon,
    isActiveRoute: (pathname) =>
      pathname.startsWith("/customer") || pathname.startsWith("/profile"),
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
    <footer className="sticky bottom-0 z-30 w-full flex-none border-t border-border/80 bg-background/95 shadow-[0_-4px_16px_rgba(17,105,54,0.08)] backdrop-blur-md">
      <nav
        aria-label="Điều hướng chính"
        className="w-full max-w-lg mx-auto px-1.5 pt-1.5 grid"
        style={{
          gridTemplateColumns: `repeat(${NAV_ITEMS.length}, 1fr)`,
          paddingBottom: `max(8px, env(safe-area-inset-bottom))`,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = item.isActiveRoute(location.pathname);

          return (
            <TransitionLink
              to={item.path}
              key={item.path}
              className={`flex flex-col items-center justify-center min-h-[52px] py-1 px-0.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive ? "text-primary font-semibold" : "text-subtitle font-normal hover:text-foreground"
              }`}
            >
              <div
                className={`w-9 h-7 flex items-center justify-center rounded-xl transition-colors ${
                  isActive ? "bg-primary-soft" : "bg-transparent"
                }`}
              >
                <item.icon active={isActive} />
              </div>
              <span
                className={`text-[10px] leading-4 mt-0.5 tracking-tight whitespace-nowrap ${
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
