"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { loginUser } from "@/api/apiUser";
import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faClock } from "@fortawesome/free-solid-svg-icons";

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

    const validate = (name, value) => {
        let error = "";
        if (name === "username" && value.trim().length < 3)
            error = "Tên đăng nhập tối thiểu 3 ký tự";
        if (name === "password" && value.length < 6)
            error = "Mật khẩu tối thiểu 6 ký tự";
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        validate(name, value);
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!form.username.trim()) newErrors.username = "Vui lòng nhập tên đăng nhập";
        if (!form.password.trim()) newErrors.password = "Vui lòng nhập mật khẩu";

        setErrors((prev) => ({ ...prev, ...newErrors }));

        if (Object.values({ ...errors, ...newErrors }).some((msg) => msg)) {
            toast.error("Vui lòng kiểm tra lại thông tin!");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await loginUser({
                username: form.username,
                password: form.password,
            });

            if (res?.token) {
                login(res.user, res.token);
                const role = res.user?.roles?.toLowerCase();
                toast.success(`Chào mừng trở lại, ${res.user?.name || res.user?.username}`);
                setTimeout(() => {
                    router.push(role === "admin" ? "/admin" : "/");
                }, 800);
            }

        } catch (error) {
            const status = error?.response?.status;
            const data = error?.response?.data;

            if (status === 401) {
                toast.error(data?.error || "Sai tên đăng nhập hoặc mật khẩu.");
            } else if (status === 404) {
                toast.error("Tài khoản không tồn tại.");
            } else {
                toast.error("Lễ đăng nhập thất bại. Vui lòng thử lại.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        visible ? (
            <div
                className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xl z-[100] p-4 animate-in fade-in duration-500"
                role="dialog"
                aria-modal="true"
            >
                <div
                    ref={formRef}
                    className="relative w-full max-w-[480px] bg-background border border-border/50 p-10 md:p-16 shadow-2xl animate-in zoom-in-95 duration-300"
                >
                    <div className="text-center mb-12 space-y-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 border border-accent/20 text-accent mb-4">
                             <FontAwesomeIcon icon={faClock} className="text-sm" />
                        </div>
                        <h1 className="font-serif text-3xl md:text-4xl text-foreground tracking-wide uppercase">
                            Đăng nhập
                        </h1>
                        <p className="text-[10px] text-accent uppercase tracking-[0.4em] font-medium">
                            Đặc quyền thành viên
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 font-medium">
                                Tên đăng nhập
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className={`w-full bg-slate-50/50 dark:bg-slate-900/5 border-b px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors ${errors.username
                                    ? "border-red-400"
                                    : "border-border/50"
                                    }`}
                                disabled={isSubmitting}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-[9px] uppercase tracking-wider ml-1">{errors.username}</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 font-medium">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className={`w-full bg-slate-50/50 dark:bg-slate-900/5 border-b px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors ${errors.password
                                    ? "border-red-400"
                                    : "border-border/50"
                                    }`}
                                disabled={isSubmitting}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-[9px] uppercase tracking-wider ml-1">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-5 text-[10px] uppercase tracking-[0.4em] font-medium transition-all duration-300 flex items-center justify-center gap-4 ${isSubmitting
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-foreground text-background hover:bg-accent hover:text-white shadow-xl shadow-black/5"
                                }`}
                        >
                            {isSubmitting ? (
                                <div className="w-3 h-3 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <span>Tiếp tục</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-border/50 text-center space-y-4">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                            Chưa có tài khoản HoangWatch?
                        </p>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-3 text-[10px] text-foreground hover:text-accent font-medium uppercase tracking-[0.3em] transition-colors"
                        >
                            <span>Khởi tạo ngay</span>
                            <FontAwesomeIcon icon={faArrowRight} className="text-[9px]" />
                        </Link>
                    </div>
                </div>
            </div>
        ) : null
    );
}
