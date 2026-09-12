import type { ComponentType } from "react";
import { useToBeImplemented } from "@/hooks";
import TransitionLink from "./transition-link";
import {
  CustomerSupportIcon,
  PackageIcon,
  ProfileIcon,
  VoucherIcon,
} from "./vectors";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: ComponentType<{ active?: boolean }>;
  to?: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "orders",
    label: "Lịch sử đơn hàng",
    description: "Đang cập nhật",
    icon: PackageIcon,
  },
  {
    id: "dealer",
    label: "Đăng ký đại lý",
    description: "Liên hệ Opodis",
    icon: CustomerSupportIcon,
  },
  {
    id: "offers",
    label: "Ưu đãi hiện có",
    description: "Xem thông tin",
    icon: VoucherIcon,
    to: "/offers",
  },
  {
    id: "loyalty",
    label: "Khách hàng thân thiết",
    description: "UI giới thiệu",
    icon: ProfileIcon,
    to: "/customer",
  },
];

interface QuickActionsProps {
  className?: string;
}

export default function QuickActions({ className = "" }: QuickActionsProps) {
  const showComingSoon = useToBeImplemented();

  return (
    <section
      aria-labelledby="quick-actions-title"
      className={`mx-4 ${className}`}
    >
      <h2
        id="quick-actions-title"
        className="text-section-title font-black text-primary mb-2.5"
      >
        Truy cập nhanh
      </h2>

      <div className="grid grid-cols-2 gap-2.5">
        {QUICK_ACTIONS.map((action) => {
          const ActionIcon = action.icon;
          const content = (
            <>
              <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center flex-none">
                <ActionIcon active />
              </div>
              <div className="min-w-0 flex-1">
                <strong className="block text-[12px] leading-4 text-foreground truncate">
                  {action.label}
                </strong>
                <span className="block text-[10px] leading-4 text-subtitle mt-0.5 truncate">
                  {action.description}
                </span>
              </div>
            </>
          );

          if (action.to) {
            return (
              <TransitionLink
                key={action.id}
                to={action.to}
                className="min-h-[70px] rounded-2xl bg-surface border border-border/70 p-3 flex items-center gap-2.5 active:scale-[0.985] transition-transform"
              >
                {content}
              </TransitionLink>
            );
          }

          return (
            <button
              key={action.id}
              type="button"
              onClick={showComingSoon}
              className="min-h-[70px] rounded-2xl bg-surface border border-border/70 p-3 flex items-center gap-2.5 text-left active:scale-[0.985] transition-transform cursor-pointer"
              aria-label={`${action.label}, tính năng đang cập nhật`}
            >
              {content}
            </button>
          );
        })}
      </div>
    </section>
  );
}
