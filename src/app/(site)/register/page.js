"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { addUser, checkUserExists } from "@/api/apiUser";
import { toast } from "react-toastify";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const formRef = useRef(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        password_confirmation: "",
        roles: "customer",
    });

    const [errors, setErrors] = useState({});
    const [checking, setChecking] = useState({
        email: false,
        username: false,
        phone: false,
    });
    const [visible, setVisible] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ✅ Đóng form khi click ra ngoài (chỉ ẩn, không reload)
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

    // ✅ Validate từng trường
    const validate = (name, value) => {
        let error = "";
        switch (name) {
            // case "name":
            //     if (value.trim().length < 3) error = "Tên phải có ít nhất 3 ký tự";
            //     break;
            // case "email":
            //     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            //         error = "Email không hợp lệ";
            //     break;
            // case "phone":
            //     if (!/^(0|\+84)[0-9]{9,10}$/.test(value))
            //         error = "Số điện thoại không hợp lệ";
            //     break;
            // case "username":
            //     if (value.trim().length < 6) {
            //         error = "Tên đăng nhập phải có ít nhất 6 ký tự";
            //     } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
            //         error = "Tên đăng nhập chỉ được chứa chữ và số, không dấu, không khoảng trắng";
            //     } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(value)) {
            //         error = "Tên đăng nhập phải có cả chữ và số";
            //     }
            //     break;
            case "password":
                if (value.length < 6) error = "Mật khẩu phải có ít nhất 6 ký tự";
                break;
            case "password_confirmation":
                if (value !== form.password)
                    error = "Mật khẩu xác nhận không khớp";
                break;
            default:
                break;
        }
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    // ✅ Kiểm tra trùng dữ liệu
    useEffect(() => {
        const delay = setTimeout(() => {
            ["email", "username", "phone"].forEach(async (field) => {
                const value = form[field];
                if (value && !errors[field]) {
                    try {
                        setChecking((prev) => ({ ...prev, [field]: true }));
                        const res = await checkUserExists(field, value);
                        if (res.exists) {
                            setErrors((prev) => ({
                                ...prev,
                                [field]:
                                    field === "email"
                                        ? "Email đã được sử dụng"
                                        : field === "username"
                                            ? "Tên đăng nhập đã tồn tại"
                                            : "Số điện thoại đã được đăng ký",
                            }));
                        } else {
                            setErrors((prev) => ({ ...prev, [field]: "" }));
                        }
                    } catch (err) {
                        console.error(err);
                    } finally {
                        setChecking((prev) => ({ ...prev, [field]: false }));
                    }
                }
            });
        }, 600);
        return () => clearTimeout(delay);
    }, [form.email, form.username, form.phone]);

    // ✅ Cập nhật form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        // validate(name, value);
    };

    // ✅ Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra các trường trống
        const newErrors = {};
        Object.entries(form).forEach(([key, value]) => {
            if (key !== "roles" && !value.trim()) {
                newErrors[key] = "Trường này không được để trống";
            } else {
                validate(key, value);
            }
        });

        setErrors((prev) => ({ ...prev, ...newErrors }));

        const hasError = Object.values({ ...errors, ...newErrors }).some((msg) => msg);
        if (hasError) {
            toast.error("Vui lòng kiểm tra lại thông tin");
            return;
        }

        try {
            setIsSubmitting(true);
            await addUser(form);
            toast.success("🎉 Đăng ký thành công!");
            setTimeout(() => router.push("/login"), 800);
        } catch {
            toast.error("Đăng ký thất bại, vui lòng thử lại");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-zinc-900/60 backdrop-blur-md z-50 p-4 overflow-y-auto"
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
                        className="relative w-full max-w-[500px] bg-white/90 dark:bg-zinc-950/70 rounded-[2rem] shadow-2xl p-10 border border-[var(--border)] backdrop-blur my-8"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-widest uppercase mb-2">
                                Đăng ký
                            </h1>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Tạo tài khoản HoangWatch</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            {[
                                { label: "Tên", name: "name", type: "text" },
                                { label: "Email", name: "email", type: "email" },
                                { label: "Số điện thoại", name: "phone", type: "text" },
                                { label: "Tên đăng nhập", name: "username", type: "text" },
                                { label: "Mật khẩu", name: "password", type: "password" },
                                {
                                    label: "Xác nhận mật khẩu",
                                    name: "password_confirmation",
                                    type: "password",
                                },
                            ].map(({ label, name, type }) => (
                                <div key={name}>
                                    <label className="block text-zinc-900 dark:text-zinc-100 font-bold text-xs uppercase tracking-widest mb-2">
                                        {label}
                                    </label>
                                    <input
                                        type={type}
                                        name={name}
                                        value={form[name]}
                                        onChange={handleChange}
                                        placeholder={`Nhập ${label.toLowerCase()}...`}
                                        className={`w-full px-5 py-3.5 rounded-xl border text-sm bg-zinc-50 dark:bg-zinc-900/40 focus:bg-white dark:focus:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all ${errors[name]
                                            ? "border-red-400"
                                            : "border-[var(--border)]"
                                            }`}
                                    />
                                    {checking[name] && (
                                        <p className="text-xs text-zinc-500 italic mt-2 font-medium">
                                            Đang kiểm tra...
                                        </p>
                                    )}
                                    {errors[name] && (
                                        <p className="text-red-500 text-xs font-medium mt-2">{errors[name]}</p>
                                    )}
                                </div>
                            ))}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 mt-6 rounded-xl font-bold text-white uppercase tracking-widest text-sm transition-all duration-300 ${isSubmitting
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
                                    "Đăng ký"
                                )}
                            </button>
                        </form>

                        <p className="text-center text-zinc-600 dark:text-zinc-300 mt-8 text-sm font-medium border-t border-[var(--border)] pt-6">
                            Đã có tài khoản?{" "}
                            <Link
                                href="/login"
                                className="text-zinc-900 dark:text-zinc-100 hover:text-black dark:hover:text-white hover:underline font-black uppercase tracking-wider ml-1"
                            >
                                Đăng nhập
                            </Link>
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
