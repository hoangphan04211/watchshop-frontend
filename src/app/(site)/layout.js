"use client";

import "../globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingCart,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import { usePathname, useRouter } from "next/navigation";
import { getClientMenu } from "@/api/apiMenu";
import { getClientSetting } from "@/api/apiSetting";
import { getClientPostBySlug } from "@/api/apiPost";
import { ThemeProvider } from "@/_components/ui/ThemeProvider";
import ThemeToggle from "@/_components/ui/ThemeToggle";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      <FontAwesomeIcon
        icon={faSearch}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm kiếm sản phẩm..."
        className="w-full pl-12 pr-12 py-2.5 rounded-full border border-[var(--border)] bg-white/70 dark:bg-zinc-950/40 backdrop-blur-md text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] shadow-sm hover:shadow-md transition-all duration-300"
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

  return (
    <header className="flex justify-between items-center px-4 md:px-8 py-4 bg-white/80 dark:bg-zinc-950/60 backdrop-blur-md border-b border-[var(--border)] shadow-sm sticky top-0 z-50 transition-all duration-300">
      <Link
        href="/"
        className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-widest uppercase hover:opacity-80 transition-opacity duration-300 flex items-center gap-2"
      >
        <span className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 px-2 py-1 rounded-md text-xl md:text-2xl">
          H
        </span>
        <span>Watch</span>
      </Link>

      <div className="flex-1 flex justify-center max-w-lg mx-6">
        <SearchBar />
      </div>

      <div className="flex items-center space-x-3 md:space-x-6 text-xl text-zinc-700 dark:text-zinc-200">
        {user ? (
          <div
            className="relative"
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            <div className="flex items-center gap-2 bg-white/70 dark:bg-zinc-900/50 border border-[var(--border)] px-3 py-1.5 rounded-full shadow-sm hover:shadow-md cursor-pointer transition-all">
              <span className="text-sm text-zinc-800 dark:text-zinc-100 font-medium">
                {user.name || user.username}
              </span>
              <FontAwesomeIcon icon={faUser} className="text-zinc-600 dark:text-zinc-300 text-lg" />
            </div>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-56 bg-white/90 dark:bg-zinc-950/80 backdrop-blur-xl rounded-2xl shadow-xl border border-[var(--border)] p-2 z-50"
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-white rounded-xl transition-colors"
                  >
                    Thông tin cá nhân
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-white rounded-xl transition-colors"
                  >
                    Lịch sử đơn hàng
                  </Link>
                  <hr className="my-1 border-[var(--border)]" />
                  <button
                    onClick={() => {
                      logout();
                      toast.success("Đã đăng xuất!");
                      setTimeout(() => router.push("/login"), 600);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                  >
                    Đăng xuất
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors"
          >
            <span className="text-sm font-medium hidden sm:block">Đăng nhập</span>
            <FontAwesomeIcon
              icon={faUser}
              className="text-xl"
            />
          </Link>
        )}

        <RequireLogin onClick={() => router.push("/cart")}>
          <div className="relative cursor-pointer text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
            <span className="text-sm font-medium hidden sm:block">Giỏ hàng</span>
            <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="absolute -top-2.5 -right-3 bg-black text-white dark:bg-white dark:text-zinc-950 text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-lg border-2 border-white dark:border-zinc-950"
              >
                {cartCount}
              </motion.span>
            )}
          </div>
        </RequireLogin>

        <ThemeToggle className="hidden sm:inline-flex" />
      </div>
    </header>
  );
}

/* ======================= NAVIGATION ======================= */
function Navigation() {
  const [menus, setMenus] = useState([]);

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
    <nav className="bg-white/70 dark:bg-zinc-950/50 backdrop-blur-lg border-b border-[var(--border)] sticky top-[75px] z-40 hidden md:block">
      <ul className="container mx-auto flex flex-wrap gap-10 justify-center font-medium text-[15px] py-4 text-zinc-600 dark:text-zinc-300 uppercase tracking-widest">
        {menus.map((menu, i) => (
          <motion.li
            key={menu.id}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={menu.link || "#"}
              prefetch={true}
              className="relative group cursor-pointer hover:text-black dark:hover:text-white transition-colors"
            >
              {menu.name}
              <span className="absolute left-1/2 -bottom-1 w-0 h-[2px] bg-black dark:bg-white group-hover:w-full group-hover:left-0 transition-all duration-300 ease-out"></span>
            </Link>
          </motion.li>
        ))}
      </ul>
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

  // Lấy 3 nhóm footer theo ID cha trong MenuSeeder (6,7,8)
  const footerGroups = menus.filter((m) => [6, 7, 8].includes(m.id));

  return (
    <footer className="bg-zinc-950 text-zinc-400 mt-auto border-t border-zinc-900">
      <div className="container mx-auto px-10 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 border-b border-zinc-900 pb-12">
          {/* 3 nhóm menu footer */}
          {footerGroups.map((group) => (
            <div key={group.id}>
              <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">
                {group.name}
              </h3>
              <ul className="space-y-3 text-sm">
                {group.children?.map((item) => {
                  // Nếu link dạng "/posts/slug", tách slug
                  const slug = item.link?.startsWith("/posts/") ? item.link.split("/").pop() : null;

                  return (
                    <li key={item.id}>
                      <Link
                        href={item.link || "#"}
                        onClick={async (e) => {
                          if (slug) {
                            e.preventDefault();
                            try {
                              const data = await getClientPostBySlug(slug);
                              console.log("Chi tiết bài viết:", data);
                              // Chuyển trang sau khi fetch xong
                              router.push(item.link);
                            } catch (err) {
                              console.error(err);
                              toast.error("Không thể tải bài viết");
                            }
                          }
                        }}
                        className="hover:text-white transition duration-300"
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Cột Liên hệ */}
          <div>
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">
              Liên hệ
            </h3>
            <p className="text-sm leading-loose">
              {setting?.address || "123 Đường Đồng Hồ, TP.HCM"}
              <br />
              {setting?.phone || "0123 456 789"}
              <br />
              {setting?.email || "support@donghoshop.com"}
            </p>
            <div className="flex space-x-5 text-lg mt-6">
              <a
                href={setting?.facebook || "#"}
                className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a
                href={setting?.instagram || "#"}
                className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href={setting?.twitter || "#"}
                className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                aria-label="Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-10">
          <p className="text-xs text-zinc-500 uppercase tracking-widest">
            © 2025 {setting?.site_name || "HOANGWATCH"}. All rights reserved.
          </p>
          <div className="text-2xl font-black text-white tracking-widest uppercase mt-4 md:mt-0 flex gap-1">
            <span className="bg-white text-zinc-950 px-1 rounded-sm flex items-center justify-center">H</span>
            <span>WATCH</span>
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
    "/",
  ];
  const isPublic = publicPages.includes(pathname);

  return (
    <html lang="vi" className={inter.className}>
      <body className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800">
        <ThemeProvider>
          <AuthProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                style: { background: "#18181b", color: "#fff", borderRadius: "12px" },
              }}
            />
            <Header />
            <Navigation />
            <motion.main
              className="container mx-auto flex-grow px-4 md:px-8 py-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {isPublic ? children : <RequireLogin>{children}</RequireLogin>}
            </motion.main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
