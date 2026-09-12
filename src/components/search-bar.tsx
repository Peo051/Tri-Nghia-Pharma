import { forwardRef, InputHTMLAttributes } from "react";

export interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  className?: string;
  wrapperClassName?: string;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onClear, className = "", wrapperClassName = "", value, placeholder = "Tìm tên sản phẩm, hoạt chất, công dụng...", ...props }, ref) => {
    const hasValue = Boolean(value && String(value).length > 0);

    return (
      <div className={`px-4 ${wrapperClassName}`}>
        <div className="relative w-full flex items-center">
          {/* Search Icon */}
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary pointer-events-none flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <input
            ref={ref}
            type="search"
            value={value}
            className={`w-full h-11 pl-10 pr-10 bg-section/70 hover:bg-section focus:bg-white text-[14px] text-foreground font-medium rounded-2xl border border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-subtitle/70 placeholder:font-normal ${className}`}
            placeholder={placeholder}
            {...props}
          />

          {/* Clear button */}
          {hasValue && onClear && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Xóa nội dung tìm kiếm"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-foreground/10 hover:bg-foreground/20 active:scale-90 transition flex items-center justify-center text-subtitle cursor-pointer"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;

