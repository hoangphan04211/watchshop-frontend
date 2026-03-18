'use client';

import { useState } from "react";
import { createContact } from "@/api/apiContact";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    content: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ====== Validate ======
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

  // ====== Handle Submit ======
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
    <section className="w-full min-h-screen bg-white py-20 px-4 mt-20">
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-start">

        {/* LEFT: Content & Contact Form */}
        <div className="flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-zinc-900 mb-4 tracking-wider uppercase">Liên hệ với chúng tôi</h1>
            <p className="text-zinc-500 font-medium leading-relaxed">
              Trải nghiệm dịch vụ chăm sóc khách hàng đẳng cấp. Hãy để lại thông tin, chuyên viên tư vấn của chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full bg-white flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="relative">
                <input
                    type="text"
                    placeholder="Họ tên"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full p-4 rounded-xl border bg-zinc-50 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 focus:bg-white transition-all
                    ${errors.name ? "border-red-500" : "border-zinc-200"}`}
                />
                {errors.name && <p className="absolute -bottom-5 left-0 text-red-500 text-xs font-medium">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div className="relative">
                <input
                    type="text"
                    placeholder="Số điện thoại"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`w-full p-4 rounded-xl border bg-zinc-50 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 focus:bg-white transition-all
                    ${errors.phone ? "border-red-500" : "border-zinc-200"}`}
                />
                {errors.phone && <p className="absolute -bottom-5 left-0 text-red-500 text-xs font-medium">{errors.phone}</p>}
                </div>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full p-4 rounded-xl border bg-zinc-50 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 focus:bg-white transition-all
                  ${errors.email ? "border-red-500" : "border-zinc-200"}`}
              />
              {errors.email && <p className="absolute -bottom-5 left-0 text-red-500 text-xs font-medium">{errors.email}</p>}
            </div>

            {/* Content */}
            <div className="relative">
              <textarea
                placeholder="Nội dung liên hệ"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className={`w-full min-h-[140px] p-4 rounded-xl border bg-zinc-50 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 focus:bg-white transition-all
                  ${errors.content ? "border-red-500" : "border-zinc-200"}`}
              />
              {errors.content && <p className="absolute -bottom-5 left-0 text-red-500 text-xs font-medium">{errors.content}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`py-4 px-8 mt-2 rounded-xl text-white font-bold uppercase tracking-widest text-sm shadow-lg transition-all duration-300
                ${loading ? "bg-zinc-400" : "bg-zinc-900 hover:bg-black hover:shadow-black/20"}`}
            >
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </form>
        </div>

        {/* RIGHT: Google Map */}
        <div className="rounded-3xl overflow-hidden shadow-sm border border-zinc-100 h-[600px] w-full grayscale contrast-125">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3270.7244707437508!2d106.77247247408816!3d10.830715058191942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752701a34a5d5f%3A0x30056b2fdf668565!2zQ2FvIMSQ4bqzbmcgQ8O0bmcgVGjGsMahbmcgVFAuSENN!5e1!3m2!1svi!2s!4v1762695372358!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

      </div>
    </section>
  );
}
