"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { API_URL } from "@/api/config";
import { getProductCategories } from "@/api/apiProduct";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

function ProductsContent({ initialLimit = 100 }) {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const [filters, setFilters] = useState({
    category: initialCategory,
    price: "",
    sale: false,
    status: "",
    sort: "",
  });

  // Load sản phẩm
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetch(`${API_URL}/products/all/${initialLimit}`)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : data.data ?? data.products ?? [];
        setProducts(list);
      })
      .catch((err) => {
        console.error(err);
        setError("Không thể tải sản phẩm");
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [initialLimit]);

  // Load category từ API có sẵn
  useEffect(() => {
    getProductCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  const parsePrice = (p) => (p == null ? 0 : Number(String(p).replace(/[^\d.-]+/g, "")));

  const filtered = useMemo(() => {
    let list = products.slice();

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => (p.name || "").toLowerCase().includes(q));
    }

    if (filters.category) list = list.filter((p) => p.category?.id === Number(filters.category));
    if (filters.sale) list = list.filter((p) => p.price_sale != null);
    if (filters.status) {
      if (filters.status === "con-hang") list = list.filter((p) => (p.stock ?? 0) > 0);
      else if (filters.status === "het-hang") list = list.filter((p) => (p.stock ?? 0) <= 0);
    }
    if (filters.price) {
      list = list.filter((p) => {
        const base = parsePrice(p.price_sale ?? p.price);
        switch (filters.price) {
          case "duoi-2": return base < 2000000;
          case "2-5": return base >= 2000000 && base <= 5000000;
          case "5-10": return base > 5000000 && base <= 10000000;
          case "tren-10": return base > 10000000;
          default: return true;
        }
      });
    }

    if (filters.sort) {
      if (filters.sort === "gia-tang") list.sort((a, b) => parsePrice(a.price_sale ?? a.price) - parsePrice(b.price_sale ?? b.price));
      else if (filters.sort === "gia-giam") list.sort((a, b) => parsePrice(b.price_sale ?? b.price) - parsePrice(a.price_sale ?? a.price));
      else if (filters.sort === "moi-nhat") list.sort((a, b) => new Date(b.created_at ?? b.createdAt ?? 0) - new Date(a.created_at ?? a.createdAt ?? 0));
    }

    return list;
  }, [products, filters, query]);

  if (loading) return <div className="p-6 text-center">Đang tải sản phẩm...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (

    <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar bộ lọc */}
      <aside className="md:col-span-1 bg-white/90 dark:bg-zinc-950/40 rounded-3xl p-6 space-y-6 sticky top-24 h-fit shadow-sm border border-[var(--border)]">
        <h2 className="text-lg font-black tracking-wider uppercase text-zinc-900 dark:text-zinc-100 mb-4">Bộ lọc</h2>

        <input
          placeholder="Tìm kiếm..."
          className="w-full border border-[var(--border)] rounded-xl px-4 py-3 mb-4 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />


        <select
          className="w-full border border-[var(--border)] rounded-xl px-4 py-3 mb-4 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all appearance-none"
          value={filters.category}
          onChange={(e) => setFilters((s) => ({ ...s, category: e.target.value }))}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          className="w-full border border-[var(--border)] rounded-xl px-4 py-3 mb-4 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all appearance-none"
          value={filters.price}
          onChange={(e) => setFilters((s) => ({ ...s, price: e.target.value }))}
        >
          <option value="">Tất cả mức giá</option>
          <option value="duoi-2">Dưới 2 triệu</option>
          <option value="2-5">2 - 5 triệu</option>
          <option value="5-10">5 - 10 triệu</option>
          <option value="tren-10">Trên 10 triệu</option>
        </select>

        <label className="flex items-center justify-between mb-2 cursor-pointer select-none border border-[var(--border)] rounded-xl p-3 bg-zinc-50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-colors">
          <span className="text-zinc-700 dark:text-zinc-200 font-medium text-sm uppercase tracking-wider">Sale</span>
          <div
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 
      ${filters.sale ? "bg-black dark:bg-white" : "bg-zinc-300 dark:bg-zinc-700"}`}
          >
            <div
              className={`bg-white dark:bg-zinc-950 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300
        ${filters.sale ? "translate-x-5" : ""}`}
            ></div>
          </div>
          <input
            type="checkbox"
            checked={filters.sale}
            onChange={(e) => setFilters((s) => ({ ...s, sale: e.target.checked }))}
            className="hidden"
          />
        </label>


        <select
          className="w-full border border-[var(--border)] rounded-xl px-4 py-3 mb-4 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all appearance-none"
          value={filters.status}
          onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value }))}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="con-hang">Còn hàng</option>
          <option value="het-hang">Hết hàng</option>
        </select>

        <select
          className="w-full border border-[var(--border)] rounded-xl px-4 py-3 mb-4 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all appearance-none"
          value={filters.sort}
          onChange={(e) => setFilters((s) => ({ ...s, sort: e.target.value }))}
        >
          <option value="">Mặc định</option>
          <option value="gia-tang">Giá tăng dần</option>
          <option value="gia-giam">Giá giảm dần</option>
          <option value="moi-nhat">Mới nhất</option>
        </select>

        <button
          onClick={() =>
            setFilters({ category: "", price: "", sale: false, status: "", sort: "" })
          }
          className="w-full py-3 rounded-xl bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 transition-colors uppercase tracking-widest text-xs font-bold"
        >
          Xóa bộ lọc
        </button>
      </aside>

      {/* Product list */}
      <main className="md:col-span-3">
        <div className="flex justify-between items-end mb-8 border-b border-[var(--border)] pb-4">
            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-wider uppercase">
                Tất cả sản phẩm <span className="text-zinc-400 text-xl">({filtered.length})</span>
            </h1>
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 bg-white/90 dark:bg-zinc-950/40 rounded-3xl border border-[var(--border)] text-center text-zinc-500 dark:text-zinc-400">
              Không tìm thấy sản phẩm phù hợp.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => {
              const isOut = (product.stock ?? 0) <= 0;
              const discount = product.price_sale ? product.price - product.price_sale : 0;

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group relative bg-white/90 dark:bg-zinc-950/40 rounded-3xl p-4 border border-[var(--border)] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
                >
                  {/* Nhãn */}
                  <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                      {product.price_sale && (
                        <span className="bg-red-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-sm">
                          Sale {(discount / product.price * 100).toFixed(0)}%
                        </span>
                      )}
                      {isOut && (
                        <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-md">
                            Hết hàng
                        </span>
                      )}
                  </div>

                  <div className="w-full aspect-[4/5] overflow-hidden rounded-2xl mb-4 relative bg-zinc-50 dark:bg-zinc-900/40">
                    <Image
                      src={product.image_url || "/images/default.jpg"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className={`object-cover transition-transform duration-700 group-hover:scale-110 ${isOut ? "grayscale opacity-60" : ""}`}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 rounded-2xl" />
                  </div>

                  <div className="flex-1 flex flex-col px-1">
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm uppercase tracking-wider line-clamp-2 mb-2 group-hover:text-black dark:group-hover:text-white transition-colors">{product.name}</h3>
                    
                    <div className="mt-auto mb-3">
                      {product.price_sale ? (
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-red-600">
                             {Number(product.price_sale).toLocaleString()} đ
                          </p>
                          <p className="text-zinc-400 font-medium line-through text-xs">
                             {Number(product.price).toLocaleString()} đ
                          </p>
                        </div>
                      ) : (
                         <p className="text-zinc-900 dark:text-zinc-100 font-bold">
                            {Number(product.price).toLocaleString()} đ
                         </p>
                      )}
                    </div>

                    {/* Nút hành động */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (isOut) {
                          toast.error("Sản phẩm đã hết hàng!");
                          return;
                        }
                        toast.success(`${product.name} đã được thêm vào giỏ hàng!`);
                      }}
                      className={`w-full py-3 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all duration-300 ${isOut ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" : "bg-zinc-900 text-white hover:bg-black hover:shadow-xl hover:shadow-black/20"
                        } ${!isOut ? "dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100" : ""}`}
                    >
                      {isOut ? "Tạm Hết Hàng" : "Mua Ngay"}
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Đang tải sản phẩm...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

