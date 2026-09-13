import React from "react";

import tuDuLogo from "@/static/partners/tu-du.webp";
import choRayLogo from "@/static/partners/cho-ray.webp";
import longChauLogo from "@/static/partners/long-chau.webp";
import vnvcLogo from "@/static/partners/vnvc.webp";
import pharmacityLogo from "@/static/partners/pharmacity.webp";
import tamAnhLogo from "@/static/partners/tam-anh.webp";
import quanY175Logo from "@/static/partners/quan-y-175.webp";
import nhiDong1Logo from "@/static/partners/nhi-dong-1.webp";
import hcdcLogo from "@/static/partners/hcdc.webp";
import siHospitalLogo from "@/static/partners/si-hospital.webp";
import giaDinhLogo from "@/static/partners/gia-dinh.webp";
import binhDanLogo from "@/static/partners/binh-dan.webp";
import nhietDoiLogo from "@/static/partners/nhiet-doi.webp";

export interface PartnerItem {
  id: string;
  name: string;
  shortName: string;
  type: string;
  logo: string;
}

export const PARTNERS_ROW_1: PartnerItem[] = [
  { id: "tu-du", name: "Bệnh viện Từ Dũ", shortName: "BV Từ Dũ", type: "Bệnh viện", logo: tuDuLogo },
  { id: "cho-ray", name: "Bệnh viện Chợ Rẫy", shortName: "BV Chợ Rẫy", type: "Bệnh viện", logo: choRayLogo },
  { id: "long-chau", name: "Nhà thuốc FPT Long Châu", shortName: "FPT Long Châu", type: "Nhà thuốc", logo: longChauLogo },
  { id: "vnvc", name: "Hệ thống Tiêm chủng VNVC", shortName: "Tiêm chủng VNVC", type: "Tiêm chủng", logo: vnvcLogo },
  { id: "pharmacity", name: "Nhà thuốc Pharmacity", shortName: "Pharmacity", type: "Nhà thuốc", logo: pharmacityLogo },
  { id: "tam-anh", name: "BV Đa khoa Tâm Anh", shortName: "BV Tâm Anh", type: "Bệnh viện", logo: tamAnhLogo },
  { id: "hcdc", name: "Trung tâm Kiểm soát Bệnh tật TP.HCM", shortName: "HCDC TP.HCM", type: "Y tế dự phòng", logo: hcdcLogo },
];

export const PARTNERS_ROW_2: PartnerItem[] = [
  { id: "quan-y-175", name: "Bệnh viện Quân Y 175", shortName: "BV Quân Y 175", type: "Bệnh viện", logo: quanY175Logo },
  { id: "nhi-dong-1", name: "Bệnh viện Nhi Đồng 1", shortName: "BV Nhi Đồng 1", type: "Bệnh viện", logo: nhiDong1Logo },
  { id: "si-hospital", name: "BV Phụ sản Quốc tế Sài Gòn", shortName: "SI Hospital", type: "Bệnh viện", logo: siHospitalLogo },
  { id: "gia-dinh", name: "Bệnh viện Nhân Dân Gia Định", shortName: "BV Gia Định", type: "Bệnh viện", logo: giaDinhLogo },
  { id: "binh-dan", name: "Bệnh viện Bình Dân", shortName: "BV Bình Dân", type: "Bệnh viện", logo: binhDanLogo },
  { id: "nhiet-doi", name: "Bệnh viện Bệnh Nhiệt Đới", shortName: "BV Bệnh Nhiệt Đới", type: "Bệnh viện", logo: nhietDoiLogo },
];

function PartnerCard({ partner }: { partner: PartnerItem }) {
  return (
    <div
      className="w-[124px] h-[64px] bg-white rounded-xl border border-gray-200/80 shadow-2xs px-2.5 py-1.5 flex flex-col items-center justify-center flex-none select-none transition-all hover:border-primary/40 active:scale-95"
      title={partner.name}
    >
      <div className="h-8 w-full flex items-center justify-center">
        <img
          src={partner.logo}
          alt={partner.name}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      </div>
      <span className="text-[9.5px] font-bold text-gray-700 leading-tight truncate max-w-full text-center mt-1">
        {partner.shortName}
      </span>
    </div>
  );
}

interface PartnerCarouselProps {
  showTitle?: boolean;
}

export default function PartnerCarousel({ showTitle = false }: PartnerCarouselProps) {
  return (
    <div className="w-full">
      {showTitle && (
        <div className="mb-3 px-1">
          <span className="text-[11px] font-bold text-primary tracking-wider uppercase">
            Hệ thống phân phối & Đối tác
          </span>
          <h3 className="text-section-title font-bold text-foreground leading-tight mt-0.5">
            Bệnh viện lớn & Chuỗi nhà thuốc hàng đầu tin dùng
          </h3>
        </div>
      )}

      {/* Container với hiệu ứng chạy ngang liên tục vô tận và viền gradient 2 bên */}
      <div className="relative overflow-hidden w-full py-1 space-y-2.5">
        {/* Dải gradient mờ 2 bên mép tạo hiệu ứng chuyển tiếp vô cực mềm mại */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        {/* Hàng 1: Chạy từ phải sang trái (24s) */}
        <div className="overflow-hidden w-full">
          <div className="animate-marquee-infinite gap-2.5">
            {PARTNERS_ROW_1.map((p, idx) => (
              <PartnerCard key={`row1-a-${p.id}-${idx}`} partner={p} />
            ))}
            {PARTNERS_ROW_1.map((p, idx) => (
              <PartnerCard key={`row1-b-${p.id}-${idx}`} partner={p} />
            ))}
          </div>
        </div>

        {/* Hàng 2: Chạy nhịp điệu ngược (28s) */}
        <div className="overflow-hidden w-full">
          <div className="animate-marquee-reverse gap-2.5">
            {PARTNERS_ROW_2.map((p, idx) => (
              <PartnerCard key={`row2-a-${p.id}-${idx}`} partner={p} />
            ))}
            {PARTNERS_ROW_2.map((p, idx) => (
              <PartnerCard key={`row2-b-${p.id}-${idx}`} partner={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
