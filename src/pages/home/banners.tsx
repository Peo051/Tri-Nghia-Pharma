import Carousel from "@/components/carousel";
import bannerPremium from "@/static/banners/banner-premium.jpg";
import bannerMeVaBe from "@/static/banners/banner-me-va-be.jpg";
import bannerClincare from "@/static/banners/banner-clincare.jpg";
import bannerOpolux from "@/static/banners/banner-opolux.jpg";

export interface BannerItem {
  id: string;
  image: string;
  title: string;
  category: string;
}

const BANNERS_DATA: BannerItem[] = [
  {
    id: "premium",
    image: bannerPremium,
    title: "Opodis Family Premium — Thảo dược dịu lành chuẩn Premium",
    category: "OPODIS FAMILY PREMIUM",
  },
  {
    id: "me-va-be",
    image: bannerMeVaBe,
    title: "Chăm sóc Mẹ và Bé — Dịu êm cho bé, yên tâm cho mẹ",
    category: "CHĂM SÓC MẸ VÀ BÉ",
  },
  {
    id: "clincare",
    image: bannerClincare,
    title: "Khử khuẩn y tế Clincare — Bảo vệ sức khỏe từ đôi tay",
    category: "KHỬ KHUẨN – SÁT KHUẨN",
  },
  {
    id: "opolux",
    image: bannerOpolux,
    title: "Dung dịch vệ sinh nam Opolux — Chuẩn sạch cho phái mạnh",
    category: "CHĂM SÓC GIA ĐÌNH",
  },
];

interface BannersProps {
  onSelectCategory?: (category: string) => void;
}

export default function Banners({ onSelectCategory }: BannersProps) {
  return (
    <div className="w-full">
      <Carousel
        slides={BANNERS_DATA.map((banner) => (
          <div
            key={banner.id}
            onClick={() => onSelectCategory?.(banner.category)}
            className="w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-border/70 bg-section/80 cursor-pointer active:scale-[0.99] transition-transform"
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        ))}
      />
    </div>
  );
}

