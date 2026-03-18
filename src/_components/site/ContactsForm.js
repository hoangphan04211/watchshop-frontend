'use client';

import { useState } from "react";
import { createContact } from "@/api/apiContact";
import { toast } from "react-hot-toast";

export default function ContactForm() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        content: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Họ tên không được để trống";
        if (!form.email.trim()) newErrors.email = "Email không được để trống";
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) newErrors.email = "Email không hợp lệ";
        if (!form.phone.trim()) newErrors.phone = "Số điện thoại không được để trống";
        else if (!/^\d{9,11}$/.test(form.phone)) newErrors.phone = "Số điện thoại không hợp lệ (9-11 số)";
        if (!form.content.trim()) newErrors.content = "Nội dung không được để trống";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await createContact(form);
            toast.success("Gửi liên hệ thành công!");
            setForm({ name: "", email: "", phone: "", content: "" });
            setErrors({});
        } catch {
            toast.error("Gửi liên hệ thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[1200px] mx-auto mt-24 mb-10 px-4">
            <div className="text-center mb-10">
                 <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-wider uppercase">Liên Hệ Tư Vấn</h3>
                 <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Để lại thông tin, chuyên viên sẽ gọi lại cho bạn ngay</p>
            </div>
            <form
                onSubmit={handleSubmit}
                className="p-8 md:p-10 rounded-3xl bg-white/90 dark:bg-zinc-950/40 border border-[var(--border)] shadow-xl shadow-zinc-200/50 dark:shadow-none flex flex-col md:flex-row gap-6 md:gap-10 items-stretch"
            >
            {/* Left: Name, Email, Phone */}
            <div className="flex-1 flex flex-col gap-3">
                {["name", "email", "phone"].map((field) => (
                    <div key={field} className="relative">
                        <input
                            type={field === "email" ? "email" : "text"}
                            placeholder={field === "name" ? "Họ tên" : field === "email" ? "Email" : "Số điện thoại"}
                            value={form[field] || ""}
                            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                            className={`w-full h-12 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-[var(--border)]
                          text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all
                          ${errors[field] ? "border-red-500" : ""}`}
                        />
                        {errors[field] && (
                            <p className="absolute -bottom-5 left-0 text-red-500 text-xs">{errors[field]}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Right: Content */}
            <div className="flex-[1.5] relative">
                <textarea
                    placeholder="Nội dung liên hệ"
                    value={form.content || ""}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className={`w-full h-full min-h-[110px] p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-[var(--border)]
                      text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all`}
                />
                {errors.content && (
                    <p className="absolute -bottom-5 left-0 text-red-500 text-xs">{errors.content}</p>
                )}
            </div>

            {/* Submit button */}
            <button
                type="submit"
                disabled={loading}
                className={`py-3 px-8 rounded-xl text-white font-bold tracking-widest uppercase text-sm transition-all duration-300
                    ${loading ? "bg-zinc-400" : "bg-zinc-900 hover:bg-black hover:shadow-lg hover:shadow-black/20 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"}`}
            >
                {loading ? "Đang gửi..." : "Gửi Liên Hệ"}
            </button>
            </form>
        </div>
    );
}
