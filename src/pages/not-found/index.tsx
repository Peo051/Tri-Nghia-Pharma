import TransitionLink from "@/components/transition-link";

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="w-14 h-14 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-4">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.5h.01" />
          <path d="M14.5 9.5h.01" />
          <path d="M9 15c1.8-1 4.2-1 6 0" />
        </svg>
      </div>
      <h1 className="text-lg font-bold text-foreground font-display">Không tìm thấy trang</h1>
      <p className="mt-1.5 max-w-[280px] text-sm leading-5 text-subtitle">
        Liên kết bạn mở không tồn tại hoặc đã được thay đổi.
      </p>
      <TransitionLink
        to="/"
        className="mt-6 inline-flex min-h-[42px] items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-bold text-white shadow-sm active:scale-95 transition-transform font-display"
      >
        Về trang chủ
      </TransitionLink>
    </div>
  );
}
