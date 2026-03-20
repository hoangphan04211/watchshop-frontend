'use client';

import { useEffect, useState } from "react";
import { useCartApi } from "@/api/apiCart";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { IMAGE_URL } from "@/api/config";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTrashCan, faArrowRight, faShoppingBag } from "@fortawesome/free-solid-svg-icons";

export default function CartPage() {
    const { getCart, updateCart, removeCartItem, clearCart } = useCartApi();
    const [cartDetails, setCartDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatCurrency = (num) =>
        num.toLocaleString("vi-VN") + "₫";

    const fetchCart = async () => {
        try {
            const res = await getCart();
            setCartDetails(res.data.cart?.details || []);
        } catch (err) {
            console.error(err);
            toast.error("Không thể tải giỏ hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const changeQty = async (id, delta) => {
        const item = cartDetails.find(i => i.id === id);
        if (!item) return;

        const newQty = item.qty + delta;
        if (newQty < 1) return;

        setCartDetails(prev =>
            prev.map(i => i.id === id ? { ...i, qty: newQty, updating: true } : i)
        );

        try {
            await updateCart(id, newQty);
        } catch {
            toast.error("Cập nhật thất bại");
            setCartDetails(prev =>
                prev.map(i => i.id === id ? { ...i, qty: item.qty } : i)
            );
        } finally {
            setCartDetails(prev =>
                prev.map(i => i.id === id ? { ...i, updating: false } : i)
            );
        }
    };

    const handleRemove = async (id) => {
        setCartDetails(prev => prev.filter(item => item.id !== id));
        try {
            await removeCartItem(id);
            toast.success("Đã gỡ khỏi giỏ hàng");
        } catch {
            toast.error("Xóa thất bại");
            fetchCart();
        }
    };

    if (loading) return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-6">
        <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400">Đang chuẩn bị giỏ hàng...</p>
      </div>
    );

    if (cartDetails.length === 0) return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center text-center space-y-10">
        <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-900/10 flex items-center justify-center text-accent/30">
           <FontAwesomeIcon icon={faShoppingBag} className="text-3xl" />
        </div>
        <div className="space-y-4">
          <h2 className="font-serif text-3xl md:text-5xl text-foreground tracking-wide">Giỏ hàng của bạn đang trống</h2>
          <p className="text-muted-foreground font-light max-w-sm mx-auto">Hãy bắt đầu hành trình tìm kiếm những tuyệt tác thời gian dành riêng cho bạn.</p>
        </div>
        <Link 
          href="/products" 
          className="inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] font-medium text-foreground hover:text-accent transition-colors"
        >
          <span>Khám phá ngay</span>
          <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
        </Link>
      </div>
    );

    const total = cartDetails.reduce(
        (sum, item) => sum + (item.price_sale || item.price) * item.qty,
        0
    );

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
                <div className="text-center md:text-left space-y-3">
                    <span className="text-accent text-xs font-medium uppercase tracking-[0.4em]">Bộ sưu tập lựa chọn</span>
                    <h1 className="font-serif text-4xl md:text-6xl text-foreground tracking-wide capitalize">
                        Giỏ hàng <span className="text-accent font-serif italic text-2xl md:text-4xl">({cartDetails.length})</span>
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-10">
                    {cartDetails.map((item) => (
                        <div
                            key={item.id}
                            className="group grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-10 border-b border-border/50"
                        >
                            <div className="md:col-span-3">
                                <Link href={`/products/${item.product.slug}`} className="block relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-900/5 group">
                                    <Image
                                        src={item.product.image ? `${IMAGE_URL}/products/${item.product.image}` : "/images/placeholder.jpg"}
                                        alt={item.product.name}
                                        fill
                                        className="object-contain p-4 grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                    />
                                </Link>
                            </div>
                            
                            <div className="md:col-span-6 space-y-4">
                                <Link href={`/products/${item.product.slug}`} className="block group/title">
                                    <h2 className="font-serif text-xl md:text-2xl text-foreground group-hover/title:text-accent transition-colors leading-tight">
                                        {item.product.name}
                                    </h2>
                                </Link>

                                {item.attributes && Object.keys(item.attributes).length > 0 && (
                                    <div className="flex flex-wrap gap-4">
                                        {Object.entries(item.attributes).map(([key, value]) => (
                                            <span key={key} className="text-[9px] uppercase tracking-widest text-muted-foreground">
                                                {key}: <span className="text-foreground">{value}</span>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="text-sm text-foreground/70 font-light">
                                    Đơn giá: {formatCurrency(item.price_sale || item.price)}
                                </div>
                            </div>

                            <div className="md:col-span-3 flex flex-col items-end gap-6">
                                <div className="flex items-center border border-border/50">
                                    <button
                                        onClick={() => changeQty(item.id, -1)}
                                        className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-accent transition-colors disabled:opacity-30"
                                        disabled={item.updating || item.qty <= 1}
                                    >
                                        <FontAwesomeIcon icon={faMinus} className="text-[9px]" />
                                    </button>
                                    <span className="w-8 text-center text-xs font-medium">{item.qty}</span>
                                    <button
                                        onClick={() => changeQty(item.id, 1)}
                                        className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-accent transition-colors disabled:opacity-30"
                                        disabled={item.updating}
                                    >
                                        <FontAwesomeIcon icon={faPlus} className="text-[9px]" />
                                    </button>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="font-serif text-xl text-accent">
                                        {formatCurrency((item.price_sale || item.price) * item.qty)}
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground hover:text-red-500 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} className="mr-2" />
                                        Gỡ bỏ
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <div className="pt-4">
                         <Link 
                            href="/products" 
                            className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-medium text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <FontAwesomeIcon icon={faArrowRight} className="text-[9px] rotate-180" />
                            <span>Tiếp tục tìm kiếm tuyệt tác</span>
                          </Link>
                    </div>
                </div>

                {/* Summary */}
                <div className="lg:col-span-4 h-fit sticky top-28">
                    <div className="p-8 md:p-10 border border-border bg-slate-50/50 dark:bg-slate-900/10 space-y-8">
                        <h3 className="font-serif text-xl text-foreground border-b border-border pb-6">Đơn hàng của quý khách</h3>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground">
                                <span>Tạm tính</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                            <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground">
                                <span>Vận chuyển</span>
                                <span className="text-accent italic">Đặc quyền miễn phí</span>
                            </div>
                            <div className="pt-4 border-t border-border flex justify-between items-baseline">
                                <span className="font-medium text-sm">TỔNG CỘNG</span>
                                <span className="font-serif text-3xl text-foreground">{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            className="block w-full text-center bg-foreground text-background py-5 text-[10px] uppercase tracking-[0.4em] font-medium transition-all hover:bg-accent hover:text-white"
                        >
                            Tiến hành thanh toán
                        </Link>
                        
                        <div className="pt-4 space-y-4">
                           <div className="flex gap-4 items-start group">
                              <div className="w-1 h-1 bg-accent/40 group-hover:bg-accent mt-1.5 transition-colors"></div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-light">Thanh toán an toàn, bảo mật tuyệt đối</p>
                           </div>
                           <div className="flex gap-4 items-start group">
                              <div className="w-1 h-1 bg-accent/40 group-hover:bg-accent mt-1.5 transition-colors"></div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-light">Vận chuyển hỏa tốc toàn quốc</p>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
