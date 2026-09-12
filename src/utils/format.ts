export function formatPrice(price: number | null | undefined): string {
  if (price == null) {
    return "Liên hệ";
  }

  return `${new Intl.NumberFormat("vi-VN").format(price)} ₫`;
}
