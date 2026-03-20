'use client';

import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "@/api/apiUser";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCheckCircle, faChevronLeft, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { IMAGE_URL } from "@/api/config";

export default function ProfileEditPage() {
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password_old: "",
        password_new: "",
        password_confirmation: "",
        avatar: null,
    });

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await getProfile();
                const data = res.data;
                setProfile(data);
                setForm(prev => ({
                    ...prev,
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                }));
                setPreview(data.avatar ? `${IMAGE_URL}/users/${data.avatar}` : null);
            } catch (error) {
                toast.error("Không thể tải thông tin hồ sơ");
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0];
            setForm({ ...form, [name]: file });
            setPreview(URL.createObjectURL(file));
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = {
                name: form.name,
                email: form.email,
                phone: form.phone,
                password_old: form.password_old,
                password_new: form.password_new,
                password_confirmation: form.password_confirmation,
                avatar: form.avatar,
            };
            const res = await updateProfile(data);
            toast.success(res.message || "Cập nhật hồ sơ thành công");
            router.push("/profile");
        } catch (error) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-6">
            <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-medium">Đang chuẩn bị trang chỉnh sửa...</p>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
            <div className="mb-16 space-y-4">
                <Link href="/profile" className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-accent transition-colors">
                    <FontAwesomeIcon icon={faChevronLeft} className="text-[8px]" />
                    Quay lại hồ sơ
                </Link>
                <h1 className="font-serif text-3xl md:text-5xl text-foreground tracking-tight">Cập nhật đặc quyền</h1>
            </div>

            <form onSubmit={handleUpdate} className="grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
                {/* Avatar Section */}
                <div className="lg:col-span-4 flex flex-col items-center space-y-8">
                    <div className="relative group cursor-pointer">
                        <div className="absolute -inset-4 border border-accent/10 scale-95 group-hover:scale-100 transition-transform duration-700" />
                        <div className="relative w-40 h-40 md:w-56 md:h-56 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                            <Image
                                src={preview || "/images/placeholder.jpg"}
                                alt="Avatar Preview"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <label className="absolute bottom-4 right-4 bg-accent text-white w-12 h-12 flex items-center justify-center shadow-xl cursor-pointer hover:bg-black transition-colors">
                            <FontAwesomeIcon icon={faCamera} className="text-[10px]" />
                            <input type="file" name="avatar" className="hidden" onChange={handleChange} accept="image/*" />
                        </label>
                    </div>
                    <p className="text-[9px] text-center text-muted-foreground uppercase tracking-widest leading-relaxed">
                        Chạm để thay đổi dấu ấn cá nhân.
                    </p>
                </div>

                {/* Form Section */}
                <div className="lg:col-span-8 space-y-16">
                    <div className="space-y-10">
                        <h3 className="text-[11px] uppercase tracking-[0.4em] font-medium text-foreground border-b border-border/50 pb-6">Thông tin định danh</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 font-medium">Họ và tên</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50/50 dark:bg-slate-900/5 border-b border-border/50 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 font-medium">Số điện thoại</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50/50 dark:bg-slate-900/5 border-b border-border/50 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 font-medium">Địa chỉ thư điện tử</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full bg-slate-50/50 dark:bg-slate-900/5 border-b border-border/50 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                            <h3 className="text-[11px] uppercase tracking-[0.4em] font-medium text-foreground">Bảo mật tài khoản</h3>
                             <FontAwesomeIcon icon={faShieldAlt} className="text-accent/40 text-[10px]" />
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 font-medium">Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    name="password_old"
                                    value={form.password_old}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50/50 dark:bg-slate-900/5 border-b border-border/50 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 font-medium">Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        name="password_new"
                                        value={form.password_new}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50/50 dark:bg-slate-900/5 border-b border-border/50 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 font-medium">Xác nhận mật khẩu</label>
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        value={form.password_confirmation}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50/50 dark:bg-slate-900/5 border-b border-border/50 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full py-5 text-[10px] uppercase tracking-[0.4em] font-medium transition-all duration-300 flex items-center justify-center gap-4 ${submitting
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-foreground text-background hover:bg-accent hover:text-white"
                            }`}
                    >
                        {submitting ? (
                            <div className="w-3 h-3 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <FontAwesomeIcon icon={faCheckCircle} className="text-[10px]" />
                        )}
                        {submitting ? "Đang xử lý..." : "Lưu thay đổi"}
                    </button>
                </div>
            </form>
        </div>
    );
}
