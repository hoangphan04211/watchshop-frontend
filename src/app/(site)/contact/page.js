'use client';

import { useState } from "react";
import { createContact } from "@/api/apiContact";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMapMarkerAlt, faPhoneAlt, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function ContactPage() {
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
    else if (!/^\d{9,11}$/.test(form.phone)) newErrors.phone = "Số điện thoại không hợp lệ";
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
      toast.success("Thông điệp của bạn đã được gửi đi. Chúng tôi sẽ sớm phản hồi.");
      setForm({ name: "", email: "", phone: "", content: "" });
      setErrors({});
    } catch {
      toast.error("Quá trình gửi thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 md:py-32">
      <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
        {/* LEFT: Information & Address */}
        <div className="lg:col-span-5 space-y-16">
          <div className="space-y-6">
            <span className="text-accent text-[10px] uppercase tracking-[0.6em] font-medium">Trung tâm hỗ trợ</span>
            <h1 className="font-serif text-4xl md:text-6xl text-foreground tracking-tight leading-tight uppercase">
              Kết nối <br />
              giá trị thượng lưu
            </h1>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-sm">
              Trải nghiệm dịch vụ tư vấn chuyên nghiệp từ các chuyên gia đồng hồ hàng đầu. Mọi thắc mắc của quý khách là ưu tiên hàng đầu của chúng tôi.
            </p>
          </div>

          <div className="space-y-12">
            {[
              { icon: faMapMarkerAlt, label: "Đại lộ di sản", value: "20 Tăng Nhơn Phú, Thủ Đức, TP. Hồ Chí Minh" },
              { icon: faPhoneAlt, label: "Đường dây nóng", value: " (+84) 123 456 789" },
              { icon: faEnvelope, label: "Thư điện tử", value: "concierge@watchshop.vn" },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 items-start group">
                <div className="w-10 h-10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 shrink-0">
                  <FontAwesomeIcon icon={item.icon} className="text-[10px]" />
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-accent font-semibold">{item.label}</p>
                  <p className="text-foreground text-sm font-medium tracking-wide">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-[400px] relative group overflow-hidden bg-slate-100 dark:bg-slate-900 border border-border/50">
             <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3270.7244707437508!2d106.77247247408816!3d10.830715058191942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752701a34a5d5f%3A0x30056b2fdf668565!2zQ2FvIMSQ4bqzbmcgQ8O0bmcgVGjGsMahbmcgVFAuSENN!5e1!3m2!1svi!2s!4v1762695372358!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale contrast-125 opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 dark:invert dark:hue-rotate-180"
              ></iframe>
              <div className="absolute inset-0 pointer-events-none border border-white/10" />
          </div>
        </div>

        {/* RIGHT: Contact Form */}
        <div className="lg:col-span-7 pt-4 lg:pt-0">
          <div className="bg-slate-50/50 dark:bg-slate-900/10 border border-border/50 p-10 md:p-16 space-y-12">
              <div className="space-y-4">
                 <h3 className="font-serif text-2xl text-foreground capitalize">Gửi thông điệp của bạn</h3>
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">Vui lòng điền thông tin bên dưới, chuyên viên của chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Quý danh</label>
                    <input
                      type="text"
                      placeholder="Ông/Bà..."
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`w-full bg-transparent border-b px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors ${
                        errors.name ? "border-red-400" : "border-border/50"
                      }`}
                    />
                    {errors.name && <p className="text-red-400 text-[9px] uppercase tracking-wider ml-1 mt-1">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Số điện thoại</label>
                    <input
                      type="text"
                      placeholder="09xx..."
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={`w-full bg-transparent border-b px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors ${
                        errors.phone ? "border-red-400" : "border-border/50"
                      }`}
                    />
                    {errors.phone && <p className="text-red-400 text-[9px] uppercase tracking-wider ml-1 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Địa chỉ thư điện tử</label>
                  <input
                    type="email"
                    placeholder="example@watchshop.vn"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full bg-transparent border-b px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors ${
                      errors.email ? "border-red-400" : "border-border/50"
                    }`}
                  />
                  {errors.email && <p className="text-red-400 text-[9px] uppercase tracking-wider ml-1 mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Lời nhắn</label>
                  <textarea
                    placeholder="Quý khách quan tâm đến dịch vụ hoặc sản phẩm nào?"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className={`w-full min-h-[160px] bg-transparent border-b px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors resize-none ${
                      errors.content ? "border-red-400" : "border-border/50"
                    }`}
                  />
                  {errors.content && <p className="text-red-400 text-[9px] uppercase tracking-wider ml-1 mt-1">{errors.content}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-5 text-[10px] uppercase tracking-[0.4em] font-medium transition-all duration-300 flex items-center justify-center gap-4 ${
                    loading 
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                      : "bg-foreground text-background hover:bg-accent hover:text-white"
                  }`}
                >
                  {loading ? (
                    <div className="w-3 h-3 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div>
                  ) : <FontAwesomeIcon icon={faPaperPlane} className="text-[10px]" />}
                  {loading ? "Đang gửi đi..." : "Gửi yêu cầu khởi tạo"}
                </button>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
}
