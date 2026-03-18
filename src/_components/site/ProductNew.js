"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { getNewProducts } from "@/api/apiProduct";
import { IMAGE_URL } from "@/api/config";

export default function ProductNew() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewProducts(8) // lấy 8 sản phẩm mới
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-600 py-10">
        Đang tải sản phẩm mới...
      </p>
    );
  }

  if (!products.length) {
    return (
      <p className="text-center text-gray-500 py-10">
        Hiện chưa có sản phẩm mới.
      </p>
    );
  }

  return (
    <section data-aos="fade-up" className="container mx-auto px-4 mt-32">
      <div className="flex justify-between items-end mb-12 border-b border-[var(--border)] pb-4">
        <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-wider uppercase">
          Bộ sưu tập mới
        </h3>
        <a
          href="/products"
          className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest"
        >
          Xem tất cả +
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group relative bg-white/90 dark:bg-zinc-950/40 rounded-3xl p-4 border border-[var(--border)] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
          >
            {/* === Nhãn Hết hàng/Mới === */}
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
              {product.stock === 0 ? (
                <span className="bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                  Hết hàng
                </span>
              ) : (
                <span className="bg-white/90 backdrop-blur-md text-black text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                  Mới
                </span>
              )}
            </div>

            {/* === Ảnh sản phẩm === */}
            <div className="w-full aspect-[4/5] overflow-hidden rounded-2xl mb-6 relative bg-zinc-50 dark:bg-zinc-900/40">
              <Image
                src={
                  product.image
                    ? `${IMAGE_URL}/products/${product.image}`
                    : "/images/placeholder.jpg"
                }
                alt={product.name}
                fill
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${product.stock === 0 ? "opacity-60 grayscale" : ""
                  }`}
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 rounded-2xl" />
            </div>

            {/* === Tên sản phẩm === */}
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2 uppercase tracking-wide px-2 group-hover:text-black dark:group-hover:text-white transition-colors">
              {product.name}
            </h4>

            {/* === Giá sản phẩm === */}
            <div className="mt-auto px-2 mb-4">
              {product.price_sale ? (
                <div className="flex items-center gap-3">
                  <p className="font-extrabold text-lg text-zinc-950 dark:text-zinc-50">
                    {Number(product.price_sale).toLocaleString()} đ
                  </p>
                  <p className="text-zinc-400 font-medium line-through text-sm">
                    {Number(product.price).toLocaleString()} đ
                  </p>
                </div>
              ) : (
                <p className="text-zinc-900 dark:text-zinc-100 font-bold text-lg">
                  {Number(product.price).toLocaleString()} đ
                </p>
              )}
            </div>

            {/* === Nút hành động === */}
            <div className="flex gap-2">
              <button
                className={`flex-1 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all duration-300 ${product.stock === 0
                  ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  : "bg-zinc-900 text-white hover:bg-black hover:shadow-xl hover:shadow-black/20 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                  }`}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Tạm hết hàng" : "Mua ngay"}
              </button>

              <button
                className={`w-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${product.stock === 0
                  ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  : "bg-zinc-100 text-zinc-600 hover:bg-black hover:text-white dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-white dark:hover:text-zinc-950"
                  }`}
                disabled={product.stock === 0}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
