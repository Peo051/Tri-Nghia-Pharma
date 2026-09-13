import Layout from "@/components/layout";
import AboutPage from "@/pages/about";
import CartPage from "@/pages/cart";
import CatalogPage from "@/pages/catalog";
import ProductDetailPage from "@/pages/catalog/product-detail";
import CustomerPage from "@/pages/customer";
import HomePage from "@/pages/home";
import NewsPage from "@/pages/news";
import NotFoundPage from "@/pages/not-found";
import SearchPage from "@/pages/search";
import { getBasePath } from "@/utils/zma";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <HomePage />,
          handle: { logo: true },
        },
        {
          path: "catalog",
          element: <CatalogPage />,
          handle: {
            title: "Danh mục sản phẩm",
            back: false,
          },
        },
        {
          path: "cart",
          element: <CartPage />,
          handle: { title: "Giỏ hàng" },
        },
        {
          path: "news",
          element: <NewsPage />,
          handle: {
            title: "Tin tức & Sự kiện",
            back: false,
          },
        },
        {
          path: "customer",
          element: <CustomerPage />,
          handle: {
            title: "Kết nối Opodis",
            back: false,
          },
        },
        {
          path: "product/:id",
          element: <ProductDetailPage />,
          handle: {
            title: "Chi tiết sản phẩm",
            scrollRestoration: 0,
          },
        },
        {
          path: "about",
          element: <AboutPage />,
          handle: { title: "Giới thiệu" },
        },
        {
          path: "search",
          element: <SearchPage />,
          handle: { title: "Tìm kiếm" },
        },
        {
          path: "*",
          element: <NotFoundPage />,
          handle: {
            title: "Không tìm thấy trang",
            back: false,
          },
        },
      ],
    },
  ],
  { basename: getBasePath() }
);

export default router;
