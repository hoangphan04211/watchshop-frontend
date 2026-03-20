'use client';

import { useState, useEffect } from "react";
import { useCheckoutApi } from "@/api/apiCheckout";
import { useCartApi } from "@/api/apiCart";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IMAGE_URL } from "@/api/config";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved, faTruckFast, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

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
    num.toLocaleString("vi-VN") + "₫";

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
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin.");
      return;
    }

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

  if (loading) return (
    <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-6">
      <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
      <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400">Đang chuẩn bị trang thanh toán...</p>
    </div>
  );

  if (cartDetails.length === 0) return (
    <div className="container mx-auto px-4 py-32 text-center space-y-8">
      <h2 className="font-serif text-3xl md:text-5xl text-foreground tracking-wide">Giỏ hàng trống</h2>
      <Link href="/products" className="inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] font-medium text-foreground hover:text-accent transition-colors">
        <span>Quay lại bộ sưu tập</span>
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
      <div className="mb-20 text-center md:text-left space-y-3">
          <span className="text-accent text-xs font-medium uppercase tracking-[0.4em]">Hoàn tất tuyệt tác</span>
          <h1 className="font-serif text-4xl md:text-6xl text-foreground tracking-wide capitalize">Thanh toán</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        {/* Shipping Info */}
        <div className="lg:col-span-7 space-y-16">
          <div className="space-y-10">
            <h3 className="text-[11px] uppercase tracking-[0.4em] font-medium text-foreground border-b border-border/50 pb-6 ml-1">Thông tin vận chuyển</h3>
            
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/** Họ tên */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 font-medium">Họ và tên</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if(errors.name) setErrors({...errors, name: ""});
                    }}
                    className={`w-full bg-slate-50/50 dark:bg-slate-900/5 border-b px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors ${
                      errors.name ? "border-red-500/50" : "border-border/50"
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-[9px] uppercase tracking-wider ml-1">{errors.name}</p>}
                </div>

                {/** Phone */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 font-medium">Số điện thoại</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => {
                      setForm({ ...form, phone: e.target.value });
                      if(errors.phone) setErrors({...errors, phone: ""});
                    }}
                    className={`w-full bg-slate-50/50 dark:bg-slate-900/5 border-b px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors ${
                      errors.phone ? "border-red-500/50" : "border-border/50"
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-[9px] uppercase tracking-wider ml-1">{errors.phone}</p>}
                </div>
              </div>

              {/** Email */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 font-medium">Địa chỉ thư điện tử</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    if(errors.email) setErrors({...errors, email: ""});
                  }}
                  className={`w-full bg-slate-50/50 dark:bg-slate-900/5 border-b px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors ${
                    errors.email ? "border-red-500/50" : "border-border/50"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-[9px] uppercase tracking-wider ml-1">{errors.email}</p>}
              </div>

              {/** Address */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 font-medium">Địa chỉ nhận hàng</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => {
                    setForm({ ...form, address: e.target.value });
                    if(errors.address) setErrors({...errors, address: ""});
                  }}
                  className={`w-full bg-slate-50/50 dark:bg-slate-900/5 border-b px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors ${
                    errors.address ? "border-red-500/50" : "border-border/50"
                  }`}
                />
                {errors.address && <p className="text-red-500 text-[9px] uppercase tracking-wider ml-1">{errors.address}</p>}
              </div>

              {/** Note */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 font-medium">Ghi chú (tùy chọn)</label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full bg-slate-50/50 dark:bg-slate-900/5 border border-border/50 px-4 py-4 text-foreground focus:outline-none focus:border-accent transition-colors min-h-[120px] resize-none"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-border/50 pt-16">
             <div className="flex gap-4 items-start group">
                <div className="w-10 h-10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:border-accent transition-colors">
                   <FontAwesomeIcon icon={faShieldHalved} className="text-accent/50 text-xs" />
                </div>
                <div className="space-y-2">
                   <h4 className="text-[10px] uppercase tracking-widest font-medium">Dịch vụ bảo mật</h4>
                   <p className="text-[9px] text-muted-foreground uppercase tracking-widest leading-relaxed">Mọi giao dịch đều được mã hóa tuyệt đối.</p>
                </div>
             </div>
             <div className="flex gap-4 items-start group">
                <div className="w-10 h-10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:border-accent transition-colors">
                   <FontAwesomeIcon icon={faTruckFast} className="text-accent/50 text-xs" />
                </div>
                <div className="space-y-2">
                   <h4 className="text-[10px] uppercase tracking-widest font-medium">Đặc quyền vận chuyển</h4>
                   <p className="text-[9px] text-muted-foreground uppercase tracking-widest leading-relaxed">Giao hàng hỏa tốc trong vòng 24 giờ.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <div className="p-8 md:p-10 border border-border bg-slate-50/50 dark:bg-slate-900/10 space-y-10">
            <h3 className="font-serif text-xl md:text-2xl text-foreground border-b border-border pb-6">Đơn hàng của quý khách</h3>
            
            <div className="space-y-8 max-h-[350px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-accent/20">
              {cartDetails.map((item) => (
                <div key={item.id} className="flex gap-6 items-center">
                  <div className="relative w-16 h-16 bg-white dark:bg-slate-900 border border-border/50 shrink-0">
                    <Image
                      src={item.product.image ? `${IMAGE_URL}/products/${item.product.image}` : "/images/placeholder.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-contain p-2"
                    />
                    <div className="absolute -top-2 -right-2 bg-foreground text-background w-5 h-5 flex items-center justify-center text-[9px] font-medium border border-border/50">
                      {item.qty}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[11px] text-foreground uppercase tracking-tight line-clamp-1">{item.product.name}</p>
                    {item.attributes && Object.keys(item.attributes).length > 0 && (
                      <p className="text-[9px] text-muted-foreground uppercase tracking-[0.1em]">
                        {Object.entries(item.attributes).map(([key, value]) => `${value}`).join(" / ")}
                      </p>
                    )}
                    <p className="text-[11px] font-serif text-accent">
                       {formatCurrency((item.price_sale || item.price) * item.qty)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
               <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>Tạm tính</span>
                  <span className="text-foreground">{formatCurrency(total)}</span>
               </div>
               <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>Vận chuyển</span>
                  <span className="text-accent italic font-light">Đặc quyền miễn phí</span>
               </div>
               <div className="flex justify-between items-baseline pt-6 border-t border-border">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-foreground">Tổng cộng</span>
                  <span className="font-serif text-3xl text-foreground tracking-tight">{formatCurrency(total)}</span>
               </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-5 text-[10px] uppercase tracking-[0.4em] font-medium transition-all duration-300 flex items-center justify-center gap-4 ${
                submitting 
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                  : "bg-foreground text-background hover:bg-accent hover:text-white"
              }`}
            >
              {submitting ? (
                <div className="w-3 h-3 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faCircleCheck} className="text-[10px]" />
              )}
              {submitting ? "Đang xử lý..." : "Xác nhận đơn hàng"}
            </button>
            
            <p className="text-[9px] text-center text-muted-foreground uppercase tracking-widest leading-loose font-light">
              Hoàn tất thanh toán đồng nghĩa với việc quý khách chấp thuận <Link href="/conditions" className="text-accent hover:underline underline-offset-4">điều khoản bảo mật</Link> của WatchShop.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
