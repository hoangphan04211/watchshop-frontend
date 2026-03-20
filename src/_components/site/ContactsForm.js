"use client";

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
        <section className="container mx-auto px-4 mt-32 mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-8">
                    <div className="space-y-3">
                        <span className="text-accent text-xs font-medium uppercase tracking-[0.4em]">
                           Phục vụ tận tâm
                        </span>
                        <h2 className="font-serif text-4xl md:text-6xl text-foreground leading-tight tracking-wide">
                            Liên hệ <br /> <span className="text-accent italic">Tư vấn</span>
                        </h2>
                    </div>
                    <p className="text-muted-foreground font-light text-base md:text-lg max-w-md leading-relaxed">
                        Đội ngũ chuyên gia của Hoang Watch luôn sẵn sàng đồng hành cùng quý khách trong việc lựa chọn những tuyệt tác thời gian phù hợp nhất.
                    </p>
                    <div className="pt-6 space-y-6">
                        <div className="flex items-start gap-6 group">
                            <span className="text-accent font-serif text-2xl opacity-40 group-hover:opacity-100 transition-opacity">01.</span>
                            <div className="space-y-1">
                                <h4 className="text-[11px] font-medium uppercase tracking-[0.2em]">Tư vấn chuyên sâu</h4>
                                <p className="text-xs text-muted-foreground font-light">Am hiểu tường tận về các dòng máy Thụy Sĩ.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-6 group">
                            <span className="text-accent font-serif text-2xl opacity-40 group-hover:opacity-100 transition-opacity">02.</span>
                            <div className="space-y-1">
                                <h4 className="text-[11px] font-medium uppercase tracking-[0.2em]">Thẩm định thật giả</h4>
                                <p className="text-xs text-muted-foreground font-light">Quy trình kiểm tra nghiêm ngặt, chuyên nghiệp.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-8 md:p-12 bg-white dark:bg-slate-900/40 border border-border shadow-2xl space-y-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Họ và tên</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className={`w-full bg-transparent border-b border-border py-3 text-foreground placeholder-slate-400 focus:outline-none focus:border-accent transition-colors ${errors.name ? "border-red-500" : ""}`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Số điện thoại</label>
                            <input
                                type="text"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className={`w-full bg-transparent border-b border-border py-3 text-foreground placeholder-slate-400 focus:outline-none focus:border-accent transition-colors ${errors.phone ? "border-red-500" : ""}`}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className={`w-full bg-transparent border-b border-border py-3 text-foreground placeholder-slate-400 focus:outline-none focus:border-accent transition-colors ${errors.email ? "border-red-500" : ""}`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Yêu cầu tư vấn</label>
                        <textarea
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            className={`w-full h-24 bg-transparent border-b border-border py-3 text-foreground placeholder-slate-400 focus:outline-none focus:border-accent transition-colors resize-none ${errors.content ? "border-red-500" : ""}`}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-foreground text-background text-[10px] font-medium uppercase tracking-[0.4em] transition-all hover:bg-accent hover:text-white disabled:opacity-50"
                    >
                        {loading ? "Đang xử lý..." : "Gửi yêu cầu"}
                    </button>
                </form>
            </div>
    </section>
  );
}
