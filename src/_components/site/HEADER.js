"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPhone,
    faEnvelope,
    faSearch,
    faGlobe,
    faUser,
    faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import {
    faFacebookF,
    faInstagram,
    faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-lg border-b border-pink-200">
            {/* === TOPBAR === */}
            <div className="bg-gradient-to-r from-pink-700 via-rose-600 to-pink-700 text-white text-sm py-2 px-8 flex justify-between items-center">
                <div className="flex items-center space-x-5 text-xs md:text-sm tracking-wide">
                    <span className="flex items-center gap-2 hover:text-rose-200 transition">
                        <FontAwesomeIcon icon={faPhone} /> 0123 456 789
                    </span>
                    <span className="flex items-center gap-2 hover:text-rose-200 transition">
                        <FontAwesomeIcon icon={faEnvelope} /> support@hoangwatch.com
                    </span>
                </div>

                <div className="flex items-center space-x-3 text-xs md:text-sm">
                    <FontAwesomeIcon icon={faGlobe} />
                    <span>VN / EN</span>
                </div>
            </div>

            {/* === MAIN HEADER === */}
            <div className="flex flex-col md:flex-row justify-between items-center px-8 py-5 bg-white/80 backdrop-blur-md gap-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-700 to-rose-500 tracking-wider drop-shadow-sm hover:scale-105 transition-transform duration-300"
                >
                    HoangWatch
                </Link>

                {/* Search */}
                <div className="flex-1 flex justify-center w-full md:w-auto">
                    <div className="flex items-center bg-white/90 border border-pink-300 rounded-full shadow-md overflow-hidden w-full md:w-2/4 min-w-[280px] hover:shadow-lg hover:scale-105 transition-all duration-300">
                        <input
                            type="text"
                            placeholder="⌕ Tìm kiếm đồng hồ sang trọng..."
                            className="bg-transparent text-gray-700 placeholder-gray-400 px-4 py-2 w-full outline-none text-sm md:text-base"
                        />
                        <button className="p-3 bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white transition-all duration-300 rounded-r-full">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </div>

                {/* User & Cart */}
                <div className="flex items-center space-x-6 text-xl md:text-2xl text-pink-600 relative">
                    <span className="text-sm md:text-base text-pink-700 font-medium">
                        Xin chào, Hoang
                    </span>
                    <Link
                        href="/profile"
                        aria-label="User"
                        className="hover:text-pink-500 transition-transform duration-300 hover:scale-110"
                    >
                        <FontAwesomeIcon icon={faUser} />
                    </Link>
                    <Link
                        href="/cart"
                        aria-label="Cart"
                        className="hover:text-pink-500 transition-transform duration-300 hover:scale-110 relative"
                    >
                        <FontAwesomeIcon icon={faShoppingCart} />
                        <span className="absolute -top-2 -right-3 bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                            3
                        </span>
                    </Link>
                </div>
            </div>

            {/* === NAVIGATION === */}
            <nav className="bg-white/70 backdrop-blur-lg border-t border-pink-200 shadow-inner">
                <ul className="container mx-auto flex flex-wrap justify-center gap-6 md:gap-10 font-semibold text-sm md:text-lg py-3 select-none">
                    {[
                        { href: "/", label: "Trang chủ" },
                        { href: "/products", label: "Sản phẩm" },
                        { href: "/brands", label: "Thương hiệu" },
                        { href: "/promotions", label: "Khuyến mãi" },
                        { href: "/posts", label: "Bài viết" },
                        { href: "/contact", label: "Liên hệ" },
                    ].map((item, idx) => (
                        <motion.li
                            key={idx}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                        >
                            <Link
                                href={item.href}
                                className="relative group transition duration-300 text-pink-700 hover:text-rose-500"
                            >
                                {item.label}
                                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-pink-400 to-rose-400 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        </motion.li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}
