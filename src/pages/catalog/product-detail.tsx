import Collapse from "@/components/collapse";
import HorizontalDivider from "@/components/horizontal-divider";
import { useNavigate, useParams } from "react-router-dom";
import { formatPrice } from "@/utils/format";
import { getProductById } from "@/utils/products";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = id ? getProductById(id) : undefined;

  if (!product) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <div className="text-xl font-medium">Không tìm thấy sản phẩm</div>
        <div className="text-sm text-subtitle">
          Sản phẩm không tồn tại hoặc đường dẫn không còn hợp lệ.
        </div>
        <button
          type="button"
          className="text-sm font-medium text-primary"
          onClick={() => navigate("/")}
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full bg-background">
      <div className="w-full px-4">
        <div className="py-2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-lg"
          />
        </div>
        <div className="text-2xs text-subtitle">{product.category}</div>
        <div className="text-xl font-medium text-primary mt-1">
          {formatPrice(product.price)}
        </div>
        <div className="text-lg font-medium mt-1">{product.name}</div>
        <div className="text-sm text-subtitle mt-2">
          {product.shortDescription}
        </div>
        {product.volume && (
          <div className="text-sm mt-2">Dung tích: {product.volume}</div>
        )}
      </div>

      <div className="bg-section h-2 w-full mt-4"></div>
      <Collapse
        items={[{ title: "Mô tả sản phẩm", content: product.description }]}
      />
      <HorizontalDivider />
      <div className="px-4 py-4 text-sm text-subtitle">
        Nội dung sản phẩm đang được cập nhật.
      </div>
    </div>
  );
}
