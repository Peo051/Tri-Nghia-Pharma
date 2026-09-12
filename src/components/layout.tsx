import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import FloatingContact from "./floating-contact";
import PromoPopup from "./promo-popup";
import { Suspense, useEffect, useRef } from "react";
import { PageSkeleton } from "./skeleton";
import { Toaster } from "react-hot-toast";
import { ScrollRestoration } from "./scroll-restoration";
import { fetchZaloUserInfo, syncUserToSystem } from "@/utils/user-sync";

const TAB_ROUTES = new Set([
  "/",
  "/catalog",
  "/categories",
  "/cart",
  "/news",
  "/customer",
  "/profile",
  "/about",
]);

export default function Layout() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    // Tự động lấy thông tin Zalo của người dùng khi truy cập app và đồng bộ lên hệ thống
    fetchZaloUserInfo().then((profile) => {
      if (profile.id || profile.name) {
        syncUserToSystem(profile);
      }
    });
  }, []);

  const isCurrentTab = TAB_ROUTES.has(location.pathname);
  const isPrevTab = TAB_ROUTES.has(prevPathRef.current);

  let transitionClass = "page-transition-fade";
  if (location.pathname !== prevPathRef.current) {
    if (navigationType === "POP") {
      transitionClass = "page-transition-pop";
    } else if (isCurrentTab && isPrevTab) {
      transitionClass = "page-transition-tab";
    } else {
      transitionClass = "page-transition-push";
    }
  } else {
    transitionClass = isCurrentTab ? "page-transition-tab" : "page-transition-fade";
  }

  useEffect(() => {
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  return (
    <div className="w-full max-w-full h-full min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="min-h-0 flex-1 w-full max-w-full overflow-y-auto overflow-x-hidden relative bg-background">
        <div key={location.pathname} className={`page-transition-wrapper ${transitionClass}`}>
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <Footer />
      <FloatingContact />
      <PromoPopup />
      <Toaster
        containerClassName="toast-container"
        containerStyle={{
          top: "calc(50% - 24px)",
        }}
      />
      <ScrollRestoration />
    </div>
  );
}
