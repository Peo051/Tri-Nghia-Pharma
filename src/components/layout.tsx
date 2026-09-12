import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { Suspense, useEffect } from "react";
import { PageSkeleton } from "./skeleton";
import { Toaster } from "react-hot-toast";
import { ScrollRestoration } from "./scroll-restoration";
import { fetchZaloUserInfo, syncUserToSystem } from "@/utils/user-sync";

export default function Layout() {
  useEffect(() => {
    // Tự động lấy thông tin Zalo của người dùng khi truy cập app và đồng bộ lên hệ thống
    fetchZaloUserInfo().then((profile) => {
      if (profile.id || profile.name) {
        syncUserToSystem(profile);
      }
    });
  }, []);

  return (
    <div className="w-full max-w-full h-full min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="min-h-0 flex-1 w-full max-w-full overflow-y-auto overflow-x-hidden relative bg-section/30">
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
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
