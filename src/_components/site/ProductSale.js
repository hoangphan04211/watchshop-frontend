"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getSaleProducts } from "@/api/apiProduct";
import { IMAGE_URL } from "@/api/config";

export default function ProductSale() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSaleProducts()
      .then((data) => {
        console.log("SALE PRODUCTS DATA:", data);
        setSales(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center py-10 text-gray-600">Đang tải danh sách khuyến mãi...</p>;
  }

  if (!sales.length) {
    return <p className="text-center text-gray-500 py-10">Không có khuyến mãi nào hiện tại.</p>;
  }

  return (
    <section data-aos="fade-up" className="container mx-auto px-4 mt-32">
      <div className="flex justify-between items-end mb-12 border-b border-[var(--border)] pb-4">
        <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-wider uppercase">
          Ưu đãi đặc quyền
        </h3>
      </div>

      {sales.map((sale, idx) => (
        <div key={idx} className="mb-20">
          {/* === Tiêu đề khuyến mãi === */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-l-4 border-black dark:border-white pl-4">
            <h4 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">
              {sale.sale_name}
            </h4>
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 tracking-widest uppercase mt-2 sm:mt-0">
              {new Date(sale.date_begin).toLocaleDateString("vi-VN")} -{" "}
              {new Date(sale.date_end).toLocaleDateString("vi-VN")}
            </p>
          </div>

          {/* === Danh sách sản phẩm trong khuyến mãi === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {sale.products.map((product, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative bg-white/90 dark:bg-zinc-950/40 rounded-3xl p-4 border border-[var(--border)] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
              >
                {/* Gắn nhãn */}
                <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                  <span className="bg-red-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                    Sale
                  </span>
                  {product.stock === 0 && (
                    <span className="bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                      Hết hàng
                    </span>
                  )}
                </div>

                <div className="w-full aspect-[4/5] overflow-hidden rounded-2xl mb-6 relative bg-zinc-50 dark:bg-zinc-900/40">
                  <Image
                    src={
                      product.image
                        ? `${IMAGE_URL}/products/${product.image}`
                        : "/images/placeholder.jpg"
                    }
                    alt={product.name}
                    width={400}
                    height={300}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${product.stock === 0 ? "opacity-60 grayscale" : ""
                      }`}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 rounded-2xl" />
                </div>

                <h5 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2 uppercase tracking-wide px-2 group-hover:text-black dark:group-hover:text-white transition-colors">
                  {product.name}
                </h5>

                {/* === Giá sản phẩm === */}
                <div className="mt-auto px-2 mb-2">
                  {product.price_sale ? (
                    <div className="flex items-center gap-3">
                      <p className="font-extrabold text-lg text-red-600">
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
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
