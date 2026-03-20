"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addUser, checkUserExists } from "@/api/apiUser";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faUserPlus } from "@fortawesome/free-solid-svg-icons";

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

    const validate = (name, value) => {
        let error = "";
        switch (name) {
            case "password":
                if (value.length < 6) error = "Mật khẩu tối thiểu 6 ký tự";
                break;
            case "password_confirmation":
                if (value !== form.password)
                    error = "Xác nhận mật khẩu không khớp";
                break;
            default:
                break;
        }
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            ["email", "username", "phone"].forEach(async (field) => {
                const value = form[field];
                if (value && !errors[field] && value.trim() !== "") {
                    try {
                        setChecking((prev) => ({ ...prev, [field]: true }));
                        const res = await checkUserExists(field, value);
                        if (res.exists) {
                            setErrors((prev) => ({
                                ...prev,
                                [field]:
                                    field === "email"
                                        ? "Email đã tồn tại"
                                        : field === "username"
                                            ? "Tên đăng nhập đã tồn tại"
                                            : "Số điện thoại đã tồn tại",
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (name === "password" || name === "password_confirmation") {
            validate(name, value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        Object.entries(form).forEach(([key, value]) => {
            if (key !== "roles" && (!value || !value.toString().trim())) {
                newErrors[key] = "Thông tin không được để trống";
            }
        });

        setErrors((prev) => ({ ...prev, ...newErrors }));

        if (Object.values({ ...errors, ...newErrors }).some((msg) => msg)) {
            toast.error("Vui lòng hoàn thiện thông tin!");
            return;
        }

        try {
            setIsSubmitting(true);
            await addUser(form);
            toast.success("Khởi tạo tài khoản thành công!");
            setTimeout(() => router.push("/login"), 800);
        } catch {
            toast.error("Quá trình đăng ký thất bại. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return visible ? (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xl z-[100] p-4 overflow-y-auto animate-in fade-in duration-500"
            role="dialog"
            aria-modal="true"
        >
            <div
                ref={formRef}
                className="relative w-full max-w-[560px] bg-background border border-border/50 p-10 md:p-14 shadow-2xl my-8 animate-in zoom-in-95 duration-300"
            >
                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 border border-accent/20 text-accent mb-2">
                         <FontAwesomeIcon icon={faUserPlus} className="text-sm" />
                    </div>
                    <h1 className="font-serif text-3xl md:text-4xl text-foreground tracking-wide uppercase">
                        Đăng ký
                    </h1>
                    <p className="text-[10px] text-accent uppercase tracking-[0.4em] font-medium">
                        Gia nhập WatchShop
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { label: "Họ và tên", name: "name", type: "text" },
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
                        <div key={name} className={name === "name" || name === "email" ? "md:col-span-2 space-y-2" : "space-y-2"}>
                            <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 font-medium">
                                {label}
                            </label>
                            <div className="relative">
                                <input
                                    type={type}
                                    name={name}
                                    value={form[name]}
                                    onChange={handleChange}
                                    className={`w-full bg-slate-50/50 dark:bg-slate-900/5 border-b px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors ${errors[name]
                                        ? "border-red-400"
                                        : "border-border/50"
                                        }`}
                                />
                                {checking[name] && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 border border-t-accent rounded-full animate-spin" />
                                )}
                            </div>
                            {errors[name] && (
                                <p className="text-red-500 text-[9px] uppercase tracking-wider ml-1">{errors[name]}</p>
                            )}
                        </div>
                    ))}

                    <div className="md:col-span-2 pt-6">
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
                                <span>Tạo tài khoản</span>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-10 pt-8 border-t border-border/50 text-center space-y-4">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        Đã có tài khoản thành viên?
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-3 text-[10px] text-foreground hover:text-accent font-medium uppercase tracking-[0.3em] transition-colors"
                    >
                        <span>Đăng nhập ngay</span>
                        <FontAwesomeIcon icon={faArrowRight} className="text-[9px]" />
                    </Link>
                </div>
            </div>
        </div>
    ) : null;
}
