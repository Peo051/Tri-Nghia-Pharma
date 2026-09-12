interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Luôn có trang 1
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Luôn có trang cuối
    pages.push(totalPages);
  }

  const handleSelectPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <nav
      aria-label="Phân trang sản phẩm"
      className={`w-full flex items-center justify-center gap-1.5 py-4 ${className}`}
    >
      {/* Nút Trước (Prev) */}
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => handleSelectPage(currentPage - 1)}
        className="h-8 px-2.5 rounded-lg border border-border/80 bg-surface text-foreground text-xs font-semibold flex items-center gap-1 transition disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-soft hover:text-primary active:scale-95 cursor-pointer shadow-2xs"
        aria-label="Trang trước"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span className="hidden sm:inline">Trước</span>
      </button>

      {/* Danh sách các số trang */}
      {pages.map((p, idx) => {
        if (typeof p === "string") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="w-8 h-8 flex items-center justify-center text-xs text-subtitle font-bold select-none"
            >
              •••
            </span>
          );
        }

        const isCurrent = p === currentPage;

        return (
          <button
            key={p}
            type="button"
            onClick={() => handleSelectPage(p)}
            aria-current={isCurrent ? "page" : undefined}
            className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition active:scale-95 cursor-pointer shadow-2xs ${
              isCurrent
                ? "bg-primary text-white shadow-xs"
                : "bg-surface border border-border/80 text-foreground hover:bg-primary-soft hover:text-primary"
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Nút Sau (Next) */}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => handleSelectPage(currentPage + 1)}
        className="h-8 px-2.5 rounded-lg border border-border/80 bg-surface text-foreground text-xs font-semibold flex items-center gap-1 transition disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-soft hover:text-primary active:scale-95 cursor-pointer shadow-2xs"
        aria-label="Trang sau"
      >
        <span className="hidden sm:inline">Sau</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
}
