"use client";

import "../globals.css";
import Link from "next/link";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingCart,
  faSearch,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Toaster, toast } from "react-hot-toast";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import api from "@/api/axios";
import { usePathname, useRouter } from "next/navigation";
import { getClientMenu } from "@/api/apiMenu";
import { getClientSetting } from "@/api/apiSetting";
import { getClientPostBySlug } from "@/api/apiPost";
import { ThemeProvider } from "@/_components/ui/ThemeProvider";
import ThemeToggle from "@/_components/ui/ThemeToggle";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

/* ======================= YÊU CẦU LOGIN ======================= */
function RequireLogin({ children, onClick }) {
  const { user } = useAuth();
  const [blocked, setBlocked] = useState(false);
  const router = useRouter();

  const handleClick = (e) => {
    if (!user && !blocked) {
      e.preventDefault?.();
      toast.error("Vui lòng đăng nhập để tiếp tục!");
      setBlocked(true);
      setTimeout(() => {
        setBlocked(false);
        router.push("/login");
      }, 800);
    } else {
      onClick?.(e);
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer select-none">
      {children}
    </div>
  );
}

/* ======================= SEARCH BAR ======================= */
function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim())
      router.push(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full group">
      <input
        type="text"
        name="search-watch"
        id="search-watch-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm kiếm tuyệt tác..."
        className="w-full pl-12 pr-12 py-3 border border-border bg-white/70 dark:bg-slate-900/10 backdrop-blur-md text-foreground placeholder-slate-400 focus:outline-none focus:border-accent shadow-sm transition-all duration-300"
        autoComplete="off"
        suppressHydrationWarning
      />
    </form>
  );
}

/* ======================= HEADER ======================= */
function Header() {
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);

  const fetchCart = async () => {
    if (!user) return setCartCount(0);
    const token = localStorage.getItem("token");
    if (!token) return setCartCount(0);
    try {
      const res = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const details = res.data.cart?.details || [];
      const totalQty = details.reduce((sum, item) => sum + item.qty, 0);
      setCartCount(totalQty);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCart();
    const interval = setInterval(fetchCart, 4000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!showMenu) return;
    const handleDocMouseDown = (e) => {
      const el = dropdownRef.current;
      if (!el) return;
      if (el.contains(e.target)) return;
      setShowMenu(false);
    };
    document.addEventListener("mousedown", handleDocMouseDown);
    return () => document.removeEventListener("mousedown", handleDocMouseDown);
  }, [showMenu]);

  return (
    <header className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-border py-3">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex-1">
            {/* Handled by Navigation but keeping placeholder if needed */}
          </div>

          {/* Logo - Centered for Luxury feel */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link
              href="/"
              className="group flex flex-col items-center md:items-start"
            >
              <span className="font-serif text-2xl md:text-3xl font-light tracking-[0.3em] uppercase text-foreground leading-none">
                Hoang <span className="text-accent">Watch</span>
              </span>
              <span className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground mt-1 transition-all group-hover:text-accent">
                Swiss Heritage
              </span>
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex-1 flex justify-end items-center space-x-4 md:space-x-8">
            <div className="hidden lg:block w-64 mr-4">
              <SearchBar />
            </div>

            <div className="flex items-center space-x-5">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowMenu((v) => !v)}
                    className="flex items-center gap-2 hover:text-accent transition-colors"
                  >
                    <FontAwesomeIcon icon={faUser} className="text-lg" />
                    <span className="text-xs font-medium hidden sm:block uppercase tracking-wider">
                      {user.name || user.username}
                    </span>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-4 w-56 bg-white dark:bg-slate-900 shadow-2xl border border-border py-2 z-50">
                      <Link
                        href="/profile"
                        onClick={() => setShowMenu(false)}
                        className="block px-6 py-3 text-xs font-medium uppercase tracking-widest text-foreground hover:bg-muted hover:text-accent transition-all"
                      >
                        Tài khoản
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setShowMenu(false)}
                        className="block px-6 py-3 text-xs font-medium uppercase tracking-widest text-foreground hover:bg-muted hover:text-accent transition-all"
                      >
                        Đơn hàng
                      </Link>
                      <div className="border-t border-border my-1"></div>
                      <button
                        onClick={() => {
                          logout();
                          toast.success("Đã đăng xuất!");
                          setTimeout(() => router.push("/login"), 600);
                        }}
                        className="w-full text-left px-6 py-3 text-xs font-medium uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 hover:text-accent transition-colors"
                >
                  <FontAwesomeIcon icon={faUser} className="text-lg" />
                  <span className="text-xs font-medium hidden sm:block uppercase tracking-wider">
                    Đăng nhập
                  </span>
                </Link>
              )}

              <RequireLogin onClick={() => router.push("/cart")}>
                <div className="relative group flex items-center gap-2 cursor-pointer hover:text-accent transition-colors">
                  <div className="relative">
                    <FontAwesomeIcon icon={faShoppingCart} className="text-lg" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium hidden sm:block uppercase tracking-wider">
                    Giỏ hàng
                  </span>
                </div>
              </RequireLogin>

              <ThemeToggle className="hidden sm:flex" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ======================= NAVIGATION ======================= */
function Navigation() {
  const [menus, setMenus] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    getClientMenu().then((data) => {
      const mainMenus = data.filter((m) =>
        ["Trang chủ", "Sản phẩm", "Bài viết", "Liên hệ", "Về Chúng Tôi"].includes(
          m.name
        )
      );
      setMenus(mainMenus);
    });
  }, []);

  return (
    <nav className="bg-white dark:bg-slate-950 border-b border-border z-40">
      <div className="container mx-auto px-4">
        {/* Desktop Menu */}
        <div className="hidden md:flex justify-center py-4">
          <ul className="flex items-center space-x-12">
            {menus.map((menu) => (
              <li key={menu.id}>
                <Link
                  href={menu.link || "#"}
                  className="font-serif text-[13px] uppercase tracking-[0.25em] text-foreground/70 hover:text-accent transition-all duration-300 relative group py-2"
                >
                  {menu.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-500 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Nav Button */}
        <div className="md:hidden flex justify-between items-center py-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground hover:text-accent transition-colors"
          >
            <FontAwesomeIcon icon={mobileOpen ? faTimes : faBars} className="text-xl" />
          </button>

          <div className="lg:hidden w-1/2">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`md:hidden fixed inset-0 bg-white dark:bg-slate-950 z-[60] transition-transform duration-500 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8">
          <div className="flex justify-between items-center mb-12">
            <span className="font-serif text-xl tracking-widest uppercase italic">Menu</span>
            <button onClick={() => setMobileOpen(false)} className="text-2xl">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <ul className="space-y-8">
            {menus.map((menu) => (
              <li key={menu.id}>
                <Link
                  href={menu.link || "#"}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-2xl uppercase tracking-widest text-foreground hover:text-accent transition-all block border-b border-border/50 pb-4"
                >
                  {menu.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-16 flex justify-center space-x-6">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ======================= FOOTER ======================= */
function Footer() {
  const [menus, setMenus] = useState([]);
  const [setting, setSetting] = useState(null);
  const router = useRouter();

  useEffect(() => {
    Promise.all([getClientMenu(), getClientSetting()])
      .then(([menuData, settingData]) => {
        setMenus(menuData);
        setSetting(settingData);
      })
      .catch(console.error);
  }, []);

  const footerGroups = menus.filter((m) => [6, 7, 8].includes(m.id));

  return (
    <footer className="bg-slate-950 text-slate-400 pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl font-light tracking-[0.3em] uppercase text-white leading-none">
                HOANG <span className="text-accent">WATCH</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs font-light tracking-wide">
              Trải nghiệm di sản đồng hồ Thụy Sĩ sang trọng. Chúng tôi mang đến những tuyệt tác thời gian từ những thương hiệu danh tiếng nhất thế giới.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-accent transition-colors"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="#" className="hover:text-accent transition-colors"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="#" className="hover:text-accent transition-colors"><FontAwesomeIcon icon={faTwitter} /></a>
            </div>
          </div>

          {/* Dynamic Menus */}
          {footerGroups.map((group) => (
            <div key={group.id} className="space-y-8">
              <h3 className="font-serif text-sm uppercase tracking-[0.3em] text-white">
                {group.name}
              </h3>
              <ul className="space-y-4 font-light text-sm tracking-wide">
                {group.children?.map((item) => (
                  <li key={item.id}>
                    <Link href={item.link || "#"} className="hover:text-accent transition-all flex items-center group">
                      <span className="w-0 h-[1px] bg-accent mr-0 transition-all group-hover:w-4 group-hover:mr-2"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div className="space-y-8">
            <h3 className="font-serif text-sm uppercase tracking-[0.3em] text-white">
              Thông tin liên hệ
            </h3>
            <ul className="space-y-4 font-light text-sm tracking-wide">
              <li className="flex items-start gap-3">
                <span className="text-accent shrink-0">Địa chỉ:</span>
                <span>{setting?.address || "123 Đường Đồng Hồ, TP.HCM"}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-accent shrink-0">Hotline:</span>
                <a href={`tel:${setting?.phone}`} className="hover:text-white transition-colors">{setting?.phone || "0123 456 789"}</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-accent shrink-0">Email:</span>
                <a href={`mailto:${setting?.email}`} className="hover:text-white transition-colors">{setting?.email || "support@hoangwatch.com"}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] uppercase tracking-[0.2em] font-medium text-slate-500">
          <p>© 2025 {setting?.site_name || "HOANG WATCH"}. Crafted for Elegance.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


/* ======================= MAIN LAYOUT ======================= */
export default function SiteLayout({ children }) {
  const pathname = usePathname();
  const publicPages = [
    "/login",
    "/register",
    "/products",
    "/posts",
    "/contact",
    "/about",
    "/",
  ];
  const isPublic = publicPages.includes(pathname) || pathname.startsWith("/products/");

  return (
    <html lang="vi" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-background text-foreground min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-foreground">
        <ThemeProvider>
          <AuthProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#1e293b",
                  color: "#fff",
                  borderRadius: "0px",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em"
                },
              }}
            />
            <div className="sticky top-0 z-[100] shadow-sm">
              <Header />
              <Navigation />
            </div>
            <main className="flex-grow">
              {isPublic ? children : <RequireLogin>{children}</RequireLogin>}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
