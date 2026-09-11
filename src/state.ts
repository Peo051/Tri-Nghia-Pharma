import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { Cart, Category, Color, Product as TemplateProduct } from "@/types";
import { Product as OpodisProduct } from "@/domain/product";
import banners from "@/mock/banners.json";
import categories from "@/mock/categories.json";
import { products } from "@/mock/products";
import { getUserInfo } from "zmp-sdk";

function toTemplateProduct(
  product: OpodisProduct,
  index: number
): TemplateProduct {
  return {
    id: index + 1,
    name: product.name,
    price: product.price,
    image: product.image,
    category: {
      id: index + 1,
      name: product.category,
      image: product.image,
    },
    details: [
      {
        title: "Mô tả sản phẩm",
        content: `${product.shortDescription}\n\n${product.description}`,
      },
    ],
  };
}

const templateProducts = products.map(toTemplateProduct);

export const userState = atom(() =>
  getUserInfo({
    avatarType: "normal",
  })
);

export const bannersState = atom<string[]>(banners);

export const tabsState = atom(["Tất cả", "Nam", "Nữ", "Trẻ em"]);

export const selectedTabIndexState = atom(0);

export const categoriesState = atom<Category[]>(categories);

export const categoriesStateUpwrapped = categoriesState;

export const productsState = atom<TemplateProduct[]>(templateProducts);

export const flashSaleProductsState = atom((get) => get(productsState));

export const recommendedProductsState = atom((get) => get(productsState));

export const sizesState = atom(["S", "M", "L", "XL"]);

export const selectedSizeState = atom<string | undefined>(undefined);

export const colorsState = atom<Color[]>([
  {
    name: "Đỏ",
    hex: "#FFC7C7",
  },
  {
    name: "Xanh dương",
    hex: "#DBEBFF",
  },
  {
    name: "Xanh lá",
    hex: "#D1F0DB",
  },
  {
    name: "Xám",
    hex: "#D9E2ED",
  },
]);

export const selectedColorState = atom<Color | undefined>(undefined);

export const productState = atomFamily((id: number) =>
  atom((get) => get(productsState).find((product) => product.id === id))
);

export const cartState = atom<Cart>([]);

export const selectedCartItemIdsState = atom<number[]>([]);

export const checkoutItemsState = atom((get) => {
  const ids = get(selectedCartItemIdsState);
  const cart = get(cartState);
  return cart.filter((item) => ids.includes(item.id));
});

export const cartTotalState = atom((get) => {
  const items = get(checkoutItemsState);
  return {
    totalItems: items.length,
    totalAmount: items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    ),
  };
});

export const keywordState = atom("");

export const searchResultState = atom(async (get) => {
  const keyword = get(keywordState);
  const products = await get(productsState);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return products.filter((product) =>
    product.name.toLowerCase().includes(keyword.toLowerCase())
  );
});
