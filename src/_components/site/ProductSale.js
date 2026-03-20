"use client";

import { useEffect, useState } from "react";
import { getSaleProducts } from "@/api/apiProduct";
import ProductCard from "../ui/ProductCard";

export default function ProductSale() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSaleProducts()
      .then((data) => {
        setSales(data);
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

  if (!sales.length) return null;

  return (
    <section className="container mx-auto px-4 mt-32">
      <div className="text-center mb-16 space-y-3">
        <span className="text-accent text-[10px] md:text-xs font-medium uppercase tracking-[0.4em]">
          Cơ hội sở hữu tuyệt tác
        </span>
        <h3 className="font-serif text-3xl md:text-5xl text-foreground tracking-wide">
          Ưu đãi Đặc quyền
        </h3>
        <div className="w-20 h-[1px] bg-accent/30 mx-auto mt-6"></div>
      </div>

      {sales.map((sale, idx) => (
        <div key={idx} className="mb-24 last:mb-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-border pb-6">
            <h4 className="font-serif text-2xl md:text-3xl text-foreground tracking-wide">
              {sale.sale_name}
            </h4>
            <div className="flex items-center gap-3 text-muted-foreground">
               <span className="text-[10px] uppercase tracking-widest font-medium">Thời gian:</span>
               <p className="text-xs font-light tracking-widest uppercase">
                {new Date(sale.date_begin).toLocaleDateString("vi-VN")} -{" "}
                {new Date(sale.date_end).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            {sale.products.map((product, i) => (
              <ProductCard key={i} product={product} showSaleBadge={true} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
