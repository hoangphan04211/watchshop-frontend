"use client";

import { useEffect, useState } from "react";
import { getNewProducts } from "@/api/apiProduct";
import ProductCard from "../ui/ProductCard";

export default function ProductNew() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewProducts(8)
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
      <div className="container mx-auto px-4 mt-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[4/6] bg-slate-50 dark:bg-slate-900/20 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <section className="container mx-auto px-4 mt-32">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
        <div className="text-center md:text-left space-y-3">
          <span className="text-accent text-[10px] md:text-xs font-medium uppercase tracking-[0.4em]">
            Sản phẩm vừa ra mắt
          </span>
          <h3 className="font-serif text-3xl md:text-5xl text-foreground tracking-wide">
            Bộ sưu tập Mới
          </h3>
        </div>
        <a
          href="/products"
          className="group flex gap-4 items-center text-[11px] uppercase tracking-[0.3em] font-medium text-muted-foreground hover:text-accent transition-all duration-300"
        >
          <span>Khám phá tất cả</span>
          <span className="w-8 h-[1px] bg-border group-hover:w-12 group-hover:bg-accent transition-all duration-500"></span>
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} showNewBadge={true} />
        ))}
      </div>
    </section>
  );
}
