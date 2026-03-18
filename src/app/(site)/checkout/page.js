'use client';

import { useState, useEffect } from "react";
import { useCheckoutApi } from "@/api/apiCheckout";
import { useCartApi } from "@/api/apiCart";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IMAGE_URL } from "@/api/config";

export default function CheckoutForm() {
  const { checkout } = useCheckoutApi();
  const { getCart } = useCartApi();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    note: "",
  });

  const [errors, setErrors] = useState({});
  const [cartDetails, setCartDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }

    const fetchCart = async () => {
      try {
        const res = await getCart();
        setCartDetails(res.data.cart?.details || []);
      } catch {
        toast.error("Không thể tải giỏ hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const formatCurrency = (num) =>
    num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const total = cartDetails.reduce(
    (sum, item) => sum + (item.price_sale || item.price) * item.qty,
    0
  );

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Họ tên không được để trống";
    if (!form.email.trim()) newErrors.email = "Email không được để trống";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Email không hợp lệ";
    if (!form.phone.trim()) newErrors.phone = "Số điện thoại không được để trống";
    else if (!/^[0-9]{9,15}$/.test(form.phone)) newErrors.phone = "Số điện thoại không hợp lệ";
    if (!form.address.trim()) newErrors.address = "Địa chỉ không được để trống";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const res = await checkout(form);
      toast.success(res.data.message || "Đặt hàng thành công");
      router.push(`/orders/${res.data.order_id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi thanh toán");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Vui lòng chờ...</div>;
  if (cartDetails.length === 0) return <div className="p-4 text-center">Giỏ hàng trống</div>;

  return (
    <div className="max-w-6xl mx-auto mt-12 mb-24 px-4">
      <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-wider uppercase">Thủ Tục Thanh Toán</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium tracking-wide">Vui lòng điền thông tin giao hàng</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10">
        {/* Left side: Info */}
        <div className="flex-[1.2] flex flex-col gap-6">
          <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest mb-2 border-b border-[var(--border)] pb-4">Thông Tin Vận Chuyển</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/** Họ tên */}
            <div className="relative">
              <input
                type="text"
                placeholder="Họ tên"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full p-4 rounded-xl border ${errors.name ? "border-red-500" : "border-[var(--border)]"} bg-zinc-50 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900/60 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 absolute -bottom-4">{errors.name}</p>}
            </div>

            {/** Phone */}
            <div className="relative">
              <input
                type="text"
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={`w-full p-4 rounded-xl border ${errors.phone ? "border-red-500" : "border-[var(--border)]"} bg-zinc-50 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900/60 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1 absolute -bottom-4">{errors.phone}</p>}
            </div>
          </div>

          {/** Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full p-4 rounded-xl border ${errors.email ? "border-red-500" : "border-[var(--border)]"} bg-zinc-50 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900/60 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 absolute -bottom-4">{errors.email}</p>}
          </div>

          {/** Address */}
          <div className="relative">
            <input
              type="text"
              placeholder="Địa chỉ nhận hàng (Ví dụ: Số nhà, Tên đường, Phường/Xã...)"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={`w-full p-4 rounded-xl border ${errors.address ? "border-red-500" : "border-[var(--border)]"} bg-zinc-50 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900/60 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all`}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1 absolute -bottom-4">{errors.address}</p>}
          </div>

          {/** Note */}
          <div>
            <textarea
              placeholder="Ghi chú thêm cho đơn hàng (tuỳ chọn)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full p-4 rounded-xl border border-[var(--border)] bg-zinc-50 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900/60 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all min-h-[120px]"
            />
          </div>
        </div>

        {/* Right side: Cart */}
        <div className="flex-[0.8] lg:flex-1 bg-white/90 dark:bg-zinc-950/40 border border-[var(--border)] shadow-xl shadow-zinc-200/40 dark:shadow-none rounded-3xl p-8 flex flex-col h-fit lg:sticky lg:top-24">
          <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 mb-6 uppercase tracking-widest border-b border-[var(--border)] pb-4">Tóm Tắt Đơn Hàng</h3>
          
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {cartDetails.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3 border-b border-[var(--border)] last:border-0">
                <div className="w-16 h-16 relative rounded-xl border border-zinc-100 overflow-hidden bg-zinc-50 shrink-0">
                  <Image
                    src={item.product.image ? `${IMAGE_URL}/products/${item.product.image}` : "/images/default.jpg"}
                    alt={item.product.name || "Sản phẩm"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute -top-1 -right-1 bg-zinc-900 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold z-10 border-2 border-white">
                    {item.qty}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm line-clamp-2 uppercase tracking-wide">{item.product.name}</p>
                  {item.attributes && Object.keys(item.attributes).length > 0 && (
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider mt-1">
                      {Object.entries(item.attributes).map(([key, value]) => `${value}`).join(" / ")}
                    </div>
                  )}
                </div>
                <div className="font-bold text-zinc-900 dark:text-zinc-100 shrink-0">
                   {formatCurrency((item.price_sale || item.price) * item.qty)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--border)] mt-6 pt-6 space-y-4">
             <div className="flex justify-between text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-widest text-sm">
                <span>Tạm tính</span>
                <span className="text-zinc-900 dark:text-zinc-100">{formatCurrency(total)}</span>
             </div>
             <div className="flex justify-between text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-widest text-sm">
                <span>Phí giao hàng</span>
                <span className="text-zinc-900 dark:text-zinc-100">Miễn phí</span>
             </div>
             <div className="flex justify-between items-end border-t border-[var(--border)] pt-4 mt-4">
                <span className="text-zinc-900 dark:text-zinc-100 font-black uppercase tracking-widest">Tổng Thanh Toán</span>
                <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{formatCurrency(total)}</span>
             </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-8 bg-zinc-900 hover:bg-black dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-black/20 dark:shadow-none"
          >
            {submitting ? "Đang xử lý..." : "Đặt Hàng Ngay"}
          </button>
        </div>
      </form>
    </div>
  );
}
