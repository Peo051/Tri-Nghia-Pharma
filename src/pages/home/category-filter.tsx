export interface CategoryFilterOption {
  id: string;
  label: string;
  count?: number;
  activeClassName?: string;
  inactiveClassName?: string;
}

interface CategoryFilterProps {
  options: CategoryFilterOption[];
  selectedId: string;
  onSelectCategory: (id: string) => void;
}

export default function CategoryFilter({
  options,
  selectedId,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Danh mục sản phẩm"
      className="w-full flex items-center gap-2 overflow-x-auto px-4 no-scrollbar pb-1 scroll-px-4"
    >
      {options.map((item) => {
        const isSelected = selectedId === item.id;
        const selectedClass =
          item.activeClassName || "bg-primary text-white font-semibold shadow-sm";
        const unselectedClass =
          item.inactiveClassName ||
          "bg-section text-foreground/85 hover:bg-primary-soft/60 border border-border/60 font-medium";

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectCategory(item.id)}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-pill text-xs whitespace-nowrap transition-all duration-150 cursor-pointer flex-none flex items-center justify-center active:scale-95 ${
              isSelected ? selectedClass : unselectedClass
            }`}
          >
            <span>{item.label}</span>
            {typeof item.count === "number" && (
              <span
                className={`ml-1.5 text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : item.inactiveClassName
                    ? "bg-white text-pink-700 border border-pink-200/80"
                    : "bg-white text-subtitle border border-border/60"
                }`}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
      {/* Trailing spacer ensures the last chip scrolls completely into view with 16px page edge clearance */}
      <div className="w-2 flex-none h-1 pointer-events-none" aria-hidden="true" />
    </div>
  );
}
