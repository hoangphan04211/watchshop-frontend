"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { API_URL } from "@/api/config";
import { getProductCategories } from "@/api/apiProduct";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/_components/ui/ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes, faChevronDown } from "@fortawesome/free-solid-svg-icons";

function FilterContent({ query, setQuery, filters, setFilters, categories, onFilterClick }) {
  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <h3 className="font-serif text-sm uppercase tracking-[0.3em] text-foreground flex items-center gap-3">
          <FontAwesomeIcon icon={faFilter} className="text-[10px] text-accent" />
          Tìm ưu tú
        </h3>
        <div className="relative">
          <input
            placeholder="Tên sản phẩm..."
            className="w-full bg-transparent border-b border-border py-4 text-xs font-light text-foreground placeholder-slate-400 focus:outline-none focus:border-accent transition-colors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent">
              <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">Phân loại</h4>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => { setFilters(s => ({ ...s, category: "" })); onFilterClick?.(); }}
            className={`text-left text-xs tracking-widest uppercase transition-colors ${!filters.category ? 'text-accent font-medium' : 'text-foreground/70 hover:text-accent'}`}
          >
            Mọi danh mục
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => { setFilters(s => ({ ...s, category: String(c.id) })); onFilterClick?.(); }}
              className={`text-left text-xs tracking-widest uppercase transition-colors ${Number(filters.category) === c.id ? 'text-accent font-medium' : 'text-foreground/70 hover:text-accent'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">Khoảng giá</h4>
        <div className="flex flex-col gap-4">
          {[
            { id: "", label: "Tất cả mức giá" },
            { id: "duoi-2", label: "Dưới 2 triệu" },
            { id: "2-5", label: "2 - 5 triệu" },
            { id: "5-10", label: "5 - 10 triệu" },
            { id: "tren-10", label: "Trên 10 triệu" }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => { setFilters(s => ({ ...s, price: p.id })); onFilterClick?.(); }}
              className={`text-left text-xs tracking-widest uppercase transition-colors ${filters.price === p.id ? 'text-accent font-medium' : 'text-foreground/70 hover:text-accent'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-8 border-t border-border/50">
        <button
          onClick={() => { setFilters({ category: "", price: "", sale: false, status: "", sort: "" }); onFilterClick?.(); }
          }
          className="text-[9px] uppercase tracking-[0.4em] font-medium text-muted-foreground hover:text-accent transition-colors"
        >
          Xóa tất cả bộ lọc
        </button>
      </div>
    </div>
  );
}

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

  if (loading) return (
    <div className="container mx-auto px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1 h-96 bg-slate-50 dark:bg-slate-900/20 animate-pulse" />
        <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <div key={i} className="aspect-[3/4] bg-slate-50 dark:bg-slate-900/10 animate-pulse" />)}
        </div>
      </div>
    </div>
  );

  if (error) return <div className="p-20 text-center font-serif text-xl text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
        <div className="text-center md:text-left space-y-3">
          <span className="text-accent text-xs font-medium uppercase tracking-[0.4em]">Bộ sưu tập tinh hoa</span>
          <h1 className="font-serif text-3xl md:text-6xl text-foreground tracking-wide capitalize">
            Sản phẩm <span className="text-accent font-serif italic text-xl md:text-4xl">({filtered.length})</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button
            className="lg:hidden flex items-center gap-3 px-6 py-3 border border-border text-[10px] uppercase tracking-[0.2em] font-medium hover:border-accent transition-colors shrink-0"
            onClick={() => document.getElementById('mobile-filters')?.classList.toggle('hidden')}
          >
            <FontAwesomeIcon icon={faFilter} className="text-accent" />
            Bộ lọc
          </button>


        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 md:gap-16">
        <aside className="lg:col-span-1 border-r border-border/50 pr-8 hidden lg:block h-fit sticky top-36">
          <FilterContent query={query} setQuery={setQuery} filters={filters} setFilters={setFilters} categories={categories} />
        </aside>

        <div id="mobile-filters" className="hidden lg:hidden fixed inset-0 z-[100] bg-white dark:bg-slate-950 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-serif text-2xl tracking-widest uppercase italic">Bộ lọc</h2>
            <button
              onClick={() => document.getElementById('mobile-filters')?.classList.add('hidden')}
              className="text-2xl p-2"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <FilterContent query={query} setQuery={setQuery} filters={filters} setFilters={setFilters} categories={categories} onFilterClick={() => document.getElementById('mobile-filters')?.classList.add('hidden')} />

          <div className="mt-12">
            <button
              onClick={() => document.getElementById('mobile-filters')?.classList.add('hidden')}
              className="w-full py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.4em] font-medium"
            >
              Xem kết quả ({filtered.length})
            </button>
          </div>
        </div>

        <main className="lg:col-span-3">
          {filtered.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-border/50 bg-slate-50/50 dark:bg-slate-900/5">
              <p className="font-serif text-lg text-muted-foreground italic mb-6">Chúng tôi không tìm thấy sản phẩm phù hợp.</p>
              <button
                onClick={() => { setFilters({ category: "", price: "", sale: false, status: "", sort: "" }); setQuery(""); }}
                className="text-[10px] uppercase tracking-[0.3em] font-medium text-accent border-b border-accent/30 pb-1"
              >
                Trở lại tất cả sản phẩm
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-12">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-serif text-slate-400">Đang chuẩn bị danh mục...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

