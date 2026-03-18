"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import { loginUser } from "@/api/apiUser";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const formRef = useRef(null);
    const { login } = useAuth();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [visible, setVisible] = useState(true);

    // ✅ Validate cơ bản
    const validate = (name, value) => {
        let error = "";
        if (name === "username" && value.trim().length < 3)
            error = "Tên đăng nhập phải có ít nhất 3 ký tự";
        if (name === "password" && value.length < 6)
            error = "Mật khẩu phải có ít nhất 6 ký tự";
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        validate(name, value);
    };

    // ✅ Đóng form khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (formRef.current && !formRef.current.contains(e.target)) {
                setVisible(false);
                setTimeout(() => router.push("/"), 250);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [router]);

    // ✅ Xử lý đăng nhập
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra bỏ trống
        const newErrors = {};
        if (!form.username.trim()) newErrors.username = "Vui lòng nhập tên đăng nhập";
        if (!form.password.trim()) newErrors.password = "Vui lòng nhập mật khẩu";

        setErrors((prev) => ({ ...prev, ...newErrors }));

        if (Object.values({ ...errors, ...newErrors }).some((msg) => msg)) {
            toast.error("Vui lòng nhập đầy đủ và chính xác thông tin!");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await loginUser({
                username: form.username,
                password: form.password,
            });

            // ✅ Đăng nhập thành công
            if (res?.token) {
                login(res.user, res.token);
                const role = res.user?.roles?.toLowerCase();
                toast.success(`✅ Đăng nhập thành công! Chào mừng ${res.user?.name || res.user?.username}`);
                setTimeout(() => {
                    router.push(role === "admin" ? "/admin" : "/");
                }, 1000);
            }

        } catch (error) {
            // ✅ Xử lý lỗi từ backend
            const status = error?.response?.status;
            const data = error?.response?.data;

            if (status === 401) {
                toast.error(data?.error || "❌ Sai tên đăng nhập hoặc mật khẩu!");
            } else if (status === 404) {
                toast.error("❌ Tài khoản không tồn tại!");
            } else {
                toast.error("⚠️ Lỗi đăng nhập, vui lòng thử lại!");
            }

            if (!error.response) {
                toast.error("🚫 Không thể kết nối đến máy chủ!");
            }

            console.error("Chi tiết lỗi đăng nhập:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-zinc-900/60 backdrop-blur-md z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        ref={formRef}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="relative w-full max-w-[420px] bg-white/90 dark:bg-zinc-950/70 rounded-[2rem] shadow-2xl p-10 border border-[var(--border)] backdrop-blur"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-widest uppercase mb-2">
                                Đăng nhập
                            </h1>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Chào mừng trở lại HoangWatch</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-zinc-900 dark:text-zinc-100 font-bold text-xs uppercase tracking-widest mb-2">
                                    Tên đăng nhập
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="Nhập tên đăng nhập..."
                                    className={`w-full px-5 py-3.5 rounded-xl border text-sm bg-zinc-50 dark:bg-zinc-900/40 focus:bg-white dark:focus:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all ${errors.username
                                        ? "border-red-400"
                                        : "border-[var(--border)]"
                                        }`}
                                    disabled={isSubmitting}
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-xs font-medium mt-2">{errors.username}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-zinc-900 dark:text-zinc-100 font-bold text-xs uppercase tracking-widest mb-2">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Nhập mật khẩu..."
                                    className={`w-full px-5 py-3.5 rounded-xl border text-sm bg-zinc-50 dark:bg-zinc-900/40 focus:bg-white dark:focus:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all ${errors.password
                                        ? "border-red-400"
                                        : "border-[var(--border)]"
                                        }`}
                                    disabled={isSubmitting}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-xs font-medium mt-2">{errors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 mt-4 rounded-xl font-bold text-white uppercase tracking-widest text-sm transition-all duration-300 ${isSubmitting
                                    ? "bg-zinc-400 cursor-not-allowed"
                                    : "bg-zinc-900 hover:bg-black hover:shadow-xl hover:shadow-black/20 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 dark:shadow-none"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Đang xử lý...</span>
                                    </div>
                                ) : (
                                    "Đăng nhập"
                                )}
                            </button>
                        </form>

                        <p className="text-center text-zinc-600 dark:text-zinc-300 mt-8 text-sm font-medium border-t border-[var(--border)] pt-6">
                            Chưa có tài khoản?{" "}
                            <Link
                                href="/register"
                                className="text-zinc-900 dark:text-zinc-100 hover:text-black dark:hover:text-white hover:underline font-black uppercase tracking-wider ml-1"
                            >
                                Đăng ký
                            </Link>
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
