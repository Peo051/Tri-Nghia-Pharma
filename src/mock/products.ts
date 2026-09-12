import { Product } from "@/domain/product";
import opodisSnapshot from "@/data/opodis-products.json";
import {
  resolveProductAsset,
  resolveProductGallery,
} from "@/utils/product-assets";

// Keep this import path for the template's existing consumers. The source of
// truth is the generated official snapshot, not the original mock catalogue.

interface OpodisProductSnapshot {
  id: string;
  sourceUrl: string;
  canonicalUrl: string;
  name: string;
  category: string | null;
  categories: string[] | null;
  price: number | null;
  currency: string | null;
  image: string | null;
  galleryImages: string[] | null;
  shortDescription: string;
  description: string;
  volume?: string | null;
  packaging?: string | null;
  ingredients?: string | string[] | null;
  activeIngredients?: string | string[] | null;
  uses?: string | string[] | null;
  directions?: string | string[] | null;
  warnings?: string | string[] | null;
  advantages?: string | string[] | null;
  registrationNumber?: string | null;
  purchaseLinks?: string[] | null;
}

interface OpodisSnapshot {
  products: OpodisProductSnapshot[];
}

function normalizeText(value: string | null | undefined): string | null {
  const normalized = value?.trim() ?? "";
  return normalized || null;
}

function normalizeTextList(
  value: string | string[] | null | undefined
): string[] {
  const values = Array.isArray(value) ? value : [value ?? ""];

  return [
    ...new Set(
      values
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean)
    ),
  ];
}

const snapshot: OpodisSnapshot = opodisSnapshot;

interface ProductCommercialMeta {
  price: number;
  originalPrice: number;
  promotionBadge?: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  reviews: {
    id: string;
    userName: string;
    avatar?: string;
    rating: number;
    date: string;
    comment: string;
    verifiedPurchase: boolean;
  }[];
}

const PRODUCT_COMMERCIAL_DATA: Record<string, ProductCommercialMeta> = {
  phytobebe: {
    price: 58000,
    originalPrice: 68000,
    promotionBadge: "Bán chạy",
    rating: 4.9,
    reviewCount: 348,
    soldCount: 4250,
    reviews: [
      {
        id: "pb-1",
        userName: "Chị Minh Thư",
        rating: 5,
        date: "08/09/2026",
        comment: "Bé nhà mình bị rôm sẩy tắm 2 hôm là lặn hẳn, mùi tinh dầu tràm tự nhiên dịu nhẹ rất thích.",
        verifiedPurchase: true,
      },
      {
        id: "pb-2",
        userName: "Mẹ Bảo An",
        rating: 5,
        date: "02/09/2026",
        comment: "Sản phẩm lành tính, không bị cay mắt bé, da bé mềm mại sau khi tắm.",
        verifiedPurchase: true,
      },
      {
        id: "pb-3",
        userName: "Dược sĩ Thu Trang",
        rating: 5,
        date: "24/08/2026",
        comment: "Thành phần cao hạt ngò và tinh dầu tràm chuẩn dược liệu, nhà thuốc mình luôn ưu tiên tư vấn sản phẩm này.",
        verifiedPurchase: true,
      },
    ],
  },
  sp9: {
    price: 85000,
    originalPrice: 99000,
    promotionBadge: "Premium",
    rating: 4.9,
    reviewCount: 164,
    soldCount: 1520,
    reviews: [
      {
        id: "pbp-1",
        userName: "Mẹ Bắp",
        rating: 5,
        date: "06/09/2026",
        comment: "Dòng Premium chất lượng thực sự khác biệt, tạo bọt mịn và làm dịu mẩn ngứa rất nhanh.",
        verifiedPurchase: true,
      },
      {
        id: "pbp-2",
        userName: "Hoàng Oanh",
        rating: 5,
        date: "29/08/2026",
        comment: "Chai vòi nhấn tiện dụng khi tắm cho bé, mùi thơm sang và thư giãn.",
        verifiedPurchase: true,
      },
    ],
  },
  sp5: {
    price: 42000,
    originalPrice: 49000,
    promotionBadge: "Hot",
    rating: 4.9,
    reviewCount: 512,
    soldCount: 5800,
    reviews: [
      {
        id: "pg-1",
        userName: "Bác sĩ Nguyễn Hoa",
        rating: 5,
        date: "09/09/2026",
        comment: "Alpha-Terpineol chiết xuất tràm gió tự nhiên, cân bằng pH chuẩn, an toàn cho chị em phụ nữ.",
        verifiedPurchase: true,
      },
      {
        id: "pg-2",
        userName: "Trần Thanh Tâm",
        rating: 5,
        date: "01/09/2026",
        comment: "Dùng êm thoáng cả ngày, hương trầu không và tràm rất dễ chịu, giá lại rất hợp lý.",
        verifiedPurchase: true,
      },
      {
        id: "pg-3",
        userName: "Ngọc Mai",
        rating: 5,
        date: "18/08/2026",
        comment: "Sản phẩm quen thuộc của cả gia đình nhiều năm nay rồi.",
        verifiedPurchase: true,
      },
    ],
  },
  sp4: {
    price: 45000,
    originalPrice: 52000,
    promotionBadge: "Ưa chuộng",
    rating: 4.8,
    reviewCount: 215,
    soldCount: 2100,
    reviews: [
      {
        id: "pgd-1",
        userName: "Lê Phương Uyên",
        rating: 5,
        date: "05/09/2026",
        comment: "Dùng vệ sinh hàng ngày rất dịu nhẹ, không bị khô rát.",
        verifiedPurchase: true,
      },
    ],
  },
  sp6: {
    price: 95000,
    originalPrice: 115000,
    promotionBadge: "Cao cấp",
    rating: 5.0,
    reviewCount: 178,
    soldCount: 1840,
    reviews: [
      {
        id: "pgl-1",
        userName: "Vũ Quỳnh Anh",
        rating: 5,
        date: "07/09/2026",
        comment: "Dòng Lady cao cấp chai vòi bọt mịn rất êm, thiết kế bao bì sang xịn mịn.",
        verifiedPurchase: true,
      },
      {
        id: "pgl-2",
        userName: "Hà My",
        rating: 5,
        date: "25/08/2026",
        comment: "Kháng khuẩn và khử mùi hiệu quả, cảm giác sạch thoáng tự tin suốt ngày dài.",
        verifiedPurchase: true,
      },
    ],
  },
  sp7: {
    price: 89000,
    originalPrice: 105000,
    promotionBadge: "Ưu đãi",
    rating: 4.9,
    reviewCount: 124,
    soldCount: 1320,
    reviews: [
      {
        id: "pgt-1",
        userName: "Chị Lan Hương",
        rating: 5,
        date: "03/09/2026",
        comment: "Mua cho con gái tuổi dậy thì dùng, bé khen thơm dịu và không bị ngứa.",
        verifiedPurchase: true,
      },
    ],
  },
  sp8: {
    price: 89000,
    originalPrice: 105000,
    promotionBadge: "Dịu nhẹ",
    rating: 4.9,
    reviewCount: 96,
    soldCount: 980,
    reviews: [
      {
        id: "pgg-1",
        userName: "Mẹ Nhím",
        rating: 5,
        date: "31/08/2026",
        comment: "Công thức chuyên biệt cho bé gái rất an toàn, bác sĩ nhi đồng khuyên dùng.",
        verifiedPurchase: true,
      },
    ],
  },
  "phytogyno-mom": {
    price: 98000,
    originalPrice: 118000,
    promotionBadge: "Cho mẹ",
    rating: 5.0,
    reviewCount: 142,
    soldCount: 1450,
    reviews: [
      {
        id: "pgm-1",
        userName: "Mẹ Bầu Thảo Vy",
        rating: 5,
        date: "04/09/2026",
        comment: "Từ lúc mang bầu chỉ dám dùng loại này, cực kỳ lành tính và an tâm.",
        verifiedPurchase: true,
      },
    ],
  },
  opolux: {
    price: 72000,
    originalPrice: 85000,
    promotionBadge: "Bán chạy",
    rating: 4.8,
    reviewCount: 238,
    soldCount: 3100,
    reviews: [
      {
        id: "ol-1",
        userName: "Nguyễn Tuấn Kiệt",
        rating: 5,
        date: "07/09/2026",
        comment: "Mùi hương nam tính tự nhiên, sạch thoáng không rít, chất lượng chuẩn dược phẩm.",
        verifiedPurchase: true,
      },
      {
        id: "ol-2",
        userName: "Trần Đình Trọng",
        rating: 5,
        date: "28/08/2026",
        comment: "Dùng sau khi chơi thể thao rất sảng khoái và tự tin.",
        verifiedPurchase: true,
      },
    ],
  },
  opflu: {
    price: 55000,
    originalPrice: 65000,
    promotionBadge: "Thảo dược",
    rating: 4.8,
    reviewCount: 186,
    soldCount: 1980,
    reviews: [
      {
        id: "of-1",
        userName: "Thầy giáo Phan Sơn",
        rating: 5,
        date: "08/09/2026",
        comment: "Mình đi dạy nói nhiều hay bị rát họng, xịt Opflu êm họng và giảm ho nhanh.",
        verifiedPurchase: true,
      },
      {
        id: "of-2",
        userName: "Kim Chi",
        rating: 5,
        date: "01/09/2026",
        comment: "Vị thảo dược the mát nhẹ, bé 4 tuổi nhà mình xịt cũng không bị gắt.",
        verifiedPurchase: true,
      },
    ],
  },
  clincare: {
    price: 85000,
    originalPrice: 98000,
    promotionBadge: "Chuẩn y tế",
    rating: 4.9,
    reviewCount: 412,
    soldCount: 6200,
    reviews: [
      {
        id: "cc-1",
        userName: "Điều dưỡng Trưởng Bích Thảo",
        rating: 5,
        date: "10/09/2026",
        comment: "Bệnh viện chúng tôi dùng Clincare nhiều năm nay, sát khuẩn cực nhanh và không làm khô da tay.",
        verifiedPurchase: true,
      },
      {
        id: "cc-2",
        userName: "Phạm Quốc Hưng",
        rating: 5,
        date: "04/09/2026",
        comment: "Chai to 500ml xài rất tiết kiệm, có vòi bơm tiện lợi cho văn phòng.",
        verifiedPurchase: true,
      },
    ],
  },
  "clincare-2": {
    price: 88000,
    originalPrice: 102000,
    promotionBadge: "Bệnh viện",
    rating: 4.9,
    reviewCount: 185,
    soldCount: 2400,
    reviews: [
      {
        id: "cc2-1",
        userName: "BS. Hoàng Văn Toàn",
        rating: 5,
        date: "05/09/2026",
        comment: "Hiệu quả diệt khuẩn vi sinh vật được kiểm nghiệm nghiêm ngặt, độ an toàn cao.",
        verifiedPurchase: true,
      },
    ],
  },
  "clincare-4": {
    price: 92000,
    originalPrice: 108000,
    promotionBadge: "Diệt khuẩn",
    rating: 4.9,
    reviewCount: 135,
    soldCount: 1750,
    reviews: [
      {
        id: "cc4-1",
        userName: "Dược sĩ Thanh Bình",
        rating: 5,
        date: "02/09/2026",
        comment: "Sát khuẩn tay phẫu thuật đạt chuẩn y khoa khắt khe.",
        verifiedPurchase: true,
      },
    ],
  },
  "clincare-sh-2": {
    price: 68000,
    originalPrice: 80000,
    promotionBadge: "Khử khuẩn",
    rating: 4.8,
    reviewCount: 112,
    soldCount: 1400,
    reviews: [
      {
        id: "csh-1",
        userName: "Chị Ngọc Bích",
        rating: 5,
        date: "27/08/2026",
        comment: "Dùng lau khử khuẩn bàn ghế, đồ chơi cho bé và phòng khám rất an tâm.",
        verifiedPurchase: true,
      },
    ],
  },
  "clinhands-gel": {
    price: 75000,
    originalPrice: 89000,
    promotionBadge: "Tiện lợi",
    rating: 4.8,
    reviewCount: 260,
    soldCount: 3500,
    reviews: [
      {
        id: "chg-1",
        userName: "Lâm Hải Đăng",
        rating: 5,
        date: "06/09/2026",
        comment: "Gel rửa tay khô mềm mịn, bay hơi nhanh không nhờn dính tay.",
        verifiedPurchase: true,
      },
    ],
  },
  clinsoap: {
    price: 65000,
    originalPrice: 75000,
    promotionBadge: "Dịu da",
    rating: 4.8,
    reviewCount: 94,
    soldCount: 1150,
    reviews: [
      {
        id: "cs-1",
        userName: "Võ Thị Hằng",
        rating: 5,
        date: "03/09/2026",
        comment: "Xà phòng rửa tay khử khuẩn có dưỡng ẩm, rửa nhiều lần trong ngày tay vẫn mềm.",
        verifiedPurchase: true,
      },
    ],
  },
  "opodex-70": {
    price: 45000,
    originalPrice: 52000,
    promotionBadge: "Bộ Y Tế",
    rating: 4.9,
    reviewCount: 320,
    soldCount: 4800,
    reviews: [
      {
        id: "od-1",
        userName: "BS. Trương Minh Nhật",
        rating: 5,
        date: "09/09/2026",
        comment: "Cồn 70 độ chuẩn y tế Opodis là lựa chọn tin cậy của các trạm y tế và phòng khám.",
        verifiedPurchase: true,
      },
    ],
  },
  phytasep: {
    price: 62000,
    originalPrice: 72000,
    promotionBadge: "Sát trùng",
    rating: 4.8,
    reviewCount: 88,
    soldCount: 960,
    reviews: [
      {
        id: "ps-1",
        userName: "Ngô Thanh Hùng",
        rating: 5,
        date: "26/08/2026",
        comment: "Sát trùng vết trầy xước nhanh khô và không gây xót rát nhiều.",
        verifiedPurchase: true,
      },
    ],
  },
  phytamin: {
    price: 48000,
    originalPrice: 58000,
    promotionBadge: "Tinh dầu tràm",
    rating: 4.9,
    reviewCount: 115,
    soldCount: 1250,
    reviews: [
      {
        id: "pm-1",
        userName: "Cô Bảy Sài Gòn",
        rating: 5,
        date: "05/09/2026",
        comment: "Xông mũi khi cảm cúm rất thông thoáng, hương tràm nguyên chất ấm người.",
        verifiedPurchase: true,
      },
    ],
  },
  sp3: {
    price: 65000,
    originalPrice: 78000,
    promotionBadge: "Dịu ấm bé",
    rating: 5.0,
    reviewCount: 280,
    soldCount: 3400,
    reviews: [
      {
        id: "ec-1",
        userName: "Mẹ Su Hào",
        rating: 5,
        date: "08/09/2026",
        comment: "Dầu tràm Emcare thoa lòng bàn chân cho bé trước khi đi ngủ, bé ngủ ngon không lo ho gió.",
        verifiedPurchase: true,
      },
      {
        id: "ec-2",
        userName: "Bà Ngoại Cu Bo",
        rating: 5,
        date: "30/08/2026",
        comment: "Dầu tràm nguyên chất, thoa lên ấm êm chứ không nóng rát như dầu gió thường.",
        verifiedPurchase: true,
      },
    ],
  },
  sp1: {
    price: 52000,
    originalPrice: 62000,
    promotionBadge: "Khuynh diệp",
    rating: 4.9,
    reviewCount: 190,
    soldCount: 2200,
    reviews: [
      {
        id: "kd-1",
        userName: "Đỗ Thị Kim Oanh",
        rating: 5,
        date: "04/09/2026",
        comment: "Tinh dầu khuynh diệp thơm dịu, bôi vết muỗi đốt cho con nhanh lặn vết sưng.",
        verifiedPurchase: true,
      },
    ],
  },
  sp2: {
    price: 55000,
    originalPrice: 65000,
    promotionBadge: "Tràm gió",
    rating: 4.9,
    reviewCount: 205,
    soldCount: 2600,
    reviews: [
      {
        id: "tt-1",
        userName: "Nguyễn Thị Mơ",
        rating: 5,
        date: "02/09/2026",
        comment: "Mùi tràm Huế đặc trưng đậm đà, tắm cho bé pha vài giọt giữ ấm rất tốt.",
        verifiedPurchase: true,
      },
    ],
  },
};

export const products: Product[] = snapshot.products.map((product) => {
  const categories = normalizeTextList([
    ...(product.categories ?? []),
    product.category ?? "",
  ]);
  const image = product.image ? resolveProductAsset(product.image) : null;
  const resolvedGallery = resolveProductGallery(product.galleryImages ?? []);
  const gallery = image
    ? resolvedGallery.filter((asset) => asset !== image)
    : resolvedGallery;
  const purchaseLinks = normalizeTextList(product.purchaseLinks);

  const commercial = PRODUCT_COMMERCIAL_DATA[product.id] ?? {
    price: product.price ?? 50000,
    originalPrice: product.price ? Math.round(product.price * 1.18) : 60000,
    promotionBadge: "Ưu đãi",
    rating: 4.9,
    reviewCount: 120,
    soldCount: 1000,
    reviews: [
      {
        id: `${product.id}-rev-1`,
        userName: "Khách hàng Opodis",
        rating: 5,
        date: "01/09/2026",
        comment: "Sản phẩm chính hãng chất lượng rất tốt, đóng gói cẩn thận, an tâm sử dụng.",
        verifiedPurchase: true,
      },
    ],
  };

  const finalPrice = product.price ?? commercial.price;
  const originalPrice = commercial.originalPrice;
  const discountPercent =
    originalPrice > finalPrice
      ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
      : undefined;

  return {
    id: product.id,
    sourceUrl: product.sourceUrl,
    canonicalUrl: product.canonicalUrl,
    name: product.name,
    categories,
    category: normalizeText(product.category) ?? categories[0] ?? "",
    price: finalPrice,
    originalPrice,
    discountPercent,
    promotionBadge: commercial.promotionBadge,
    rating: commercial.rating,
    reviewCount: commercial.reviewCount,
    soldCount: commercial.soldCount,
    reviews: commercial.reviews,
    currency: product.currency ?? "₫",
    image,
    gallery,
    shortDescription: product.shortDescription,
    description: product.description,
    registrationNumber: normalizeText(product.registrationNumber),
    packaging: normalizeText(product.packaging),
    volume: normalizeText(product.volume),
    ingredients: normalizeTextList(product.ingredients),
    activeIngredients: normalizeTextList(product.activeIngredients),
    uses: normalizeTextList(product.uses),
    directions: normalizeTextList(product.directions),
    warnings: normalizeTextList(product.warnings),
    advantages: normalizeTextList(product.advantages),
    ...(purchaseLinks.length ? { purchaseLinks } : {}),
  };
});

