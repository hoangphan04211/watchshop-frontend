'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getProductBySlug } from "@/api/apiProduct";
import { toast } from "react-hot-toast";
import { IMAGE_URL } from "@/api/config";
import { motion, AnimatePresence } from "framer-motion";
import { useCartApi } from "@/api/apiCart";

export default function ProductDetail() {
  const { slug } = useParams();
  const [productData, setProductData] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1); // số lượng
  const [mainImage, setMainImage] = useState(null);
  const [thumbImages, setThumbImages] = useState([]);
  const [updating, setUpdating] = useState(false); // flag load ngầm

  const { addToCart } = useCartApi();

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const data = await getProductBySlug(slug);
        setProductData(data);
        const allImages = [data.product, ...(data.product.images || [])];
        setMainImage(allImages[0]);
        setThumbImages(allImages.slice(1));
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <p className="p-8">Đang tải...</p>;
  if (!productData) return <p className="p-8">Không tìm thấy sản phẩm.</p>;

  const { product, related } = productData;

  const groupedAttributes =
    product.attributes?.reduce((acc, attr) => {
      if (!acc[attr.name]) acc[attr.name] = [];
      if (!acc[attr.name].includes(attr.value)) acc[attr.name].push(attr.value);
      return acc;
    }, {}) || {};

  const handleSelectAttr = (name, value) => {
    setSelectedAttributes((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeQty = async (newQty) => {
    if (newQty < 1) return; // không lưu 0
    if (newQty > 20) newQty = 20; // tối đa 20
    setQty(newQty);
  };

  const handleAddToCart = async () => {
    if (product.stock <= 0) {
      toast.error("❌ Sản phẩm đã hết hàng!");
      return;
    }
    if (qty > product.stock) {
      toast.error(`❌ Chỉ còn ${product.stock} sản phẩm trong kho!`);
      return;
    }

    const requiredAttrs = Object.keys(groupedAttributes);
    for (let attr of requiredAttrs) {
      if (!selectedAttributes[attr]) {
        toast.error(`Vui lòng chọn ${attr.toLowerCase()}!`);
        return;
      }
    }

    // load ngầm
    setUpdating(true);
    try {
      await addToCart(product.id, qty, selectedAttributes);
      toast.success(" Đã thêm vào giỏ hàng!");
    } catch (err) {
      console.error(err);
      toast.error(" Thêm giỏ hàng thất bại!");
    } finally {
      setUpdating(false);
    }
  };

  const swapImage = (img) => {
    if (img.id === mainImage.id) return;
    const newThumbs = thumbImages.filter((i) => i.id !== img.id);
    newThumbs.unshift(mainImage);
    setMainImage(img);
    setThumbImages(newThumbs);
  };

  return (
    <div className="p-8">
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 rounded-xl p-6 shadow-lg transition-all ${product.stock <= 0 ? "opacity-50 grayscale" : "hover:shadow-2xl"}`}>
        {/* Ảnh sản phẩm */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={mainImage.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden"
            >
              <Image
                src={mainImage.url || `${IMAGE_URL}/products/${mainImage.image}`}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-96 object-cover cursor-pointer rounded-xl border transition-all hover:scale-105"
                onClick={() => swapImage(mainImage)}
              />
            </motion.div>
          </AnimatePresence>
          {thumbImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {thumbImages.map((img) => (
                <Image
                  key={img.id}
                  src={img.url || `${IMAGE_URL}/products/${img.image}`}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover border rounded-xl hover:scale-110 transition cursor-pointer"
                  onClick={() => swapImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thông tin chi tiết */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
            <p className="text-gray-600 mb-2">Danh mục: {product.category?.name}</p>

            {/* Giá */}
            <div className="mb-4 flex items-baseline gap-3">
              {product.price_sale ? (
                <>
                  <span className="text-xl text-gray-500 line-through">{product.price.toLocaleString()}₫</span>
                  <span className="text-2xl text-red-600 font-bold">{product.price_sale.toLocaleString()}₫</span>
                </>
              ) : (
                <span className="text-2xl text-blue-700 font-semibold">{product.price.toLocaleString()}₫</span>
              )}
            </div>

            <p className={`mb-4 font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : "Hết hàng"}
            </p>

            {/* Thuộc tính */}
            {Object.entries(groupedAttributes).map(([name, values]) => (
              <div key={name} className="mb-4">
                <h3 className="font-semibold mb-2">{name}</h3>
                <div className="flex gap-2 flex-wrap">
                  {values.map((val) => {
                    const selected = selectedAttributes[name] === val;
                    return (
                      <button
                        key={val}
                        onClick={() => handleSelectAttr(name, val)}
                        className={`px-4 py-2 rounded-lg border transition ${selected ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"}`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Chọn số lượng */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => handleChangeQty(qty - 1)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
                disabled={updating || qty <= 1}
              >-</button>
              <input
                type="number"
                min={1}
                max={20}
                value={qty}
                onChange={(e) => handleChangeQty(parseInt(e.target.value) || 1)}
                className="w-16 text-center border rounded"
              />
              <button
                onClick={() => handleChangeQty(qty + 1)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
                disabled={updating || qty >= 20 || qty >= product.stock}
              >+</button>
            </div>

          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || updating || qty === 0}
            className={`mt-3 px-6 py-2 rounded-xl font-semibold transition-all ${product.stock <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
          >
            {updating ? "Đang thêm..." : "Thêm vào giỏ hàng"}
          </button>
        </div>
      </div>

      {/* Mô tả sản phẩm */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Mô tả sản phẩm</h2>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      </div>

      {/* Sản phẩm liên quan */}
      {related?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((item) => (
              <a
                key={item.id}
                href={`/products/${item.slug}`}
                className={`border rounded-xl p-3 hover:shadow-lg transition-all ${item.stock <= 0 ? "opacity-50 grayscale" : ""}`}
              >
                <Image
                  src={`${IMAGE_URL}/products/${item.image}`}
                  alt={item.name}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover rounded-xl mb-2 transition-all hover:scale-105"
                />
                <h3 className="font-medium text-gray-800 line-clamp-1">{item.name}</h3>
                {item.price_sale ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-gray-500 line-through">{item.price.toLocaleString()}₫</span>
                    <span className="text-blue-700 font-semibold">{item.price_sale.toLocaleString()}₫</span>
                  </div>
                ) : (
                  <span className="text-blue-700 font-semibold">{item.price.toLocaleString()}₫</span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
