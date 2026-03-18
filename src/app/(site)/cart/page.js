'use client';

import { useEffect, useState } from "react";
import { useCartApi } from "@/api/apiCart";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { IMAGE_URL } from "@/api/config";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
    const { getCart, updateCart, removeCartItem, clearCart } = useCartApi();
    const [cartDetails, setCartDetails] = useState([]);
    const [loading, setLoading] = useState(true);


    const formatCurrency = (num) =>
        num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    // Load giỏ hàng
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

    // Tăng giảm số lượng, load ngầm
    const changeQty = async (id, delta) => {
        setCartDetails(prev =>
            prev.map(item => {
                if (item.id === id) {
                    const newQty = item.qty + delta;
                    if (newQty < 1) return item;
                    return { ...item, qty: newQty, updating: true };
                }
                return item;
            })
        );

        const item = cartDetails.find(i => i.id === id);
        if (!item) return;

        try {
            await updateCart(id, item.qty + delta);
        } catch {
            toast.error("Cập nhật thất bại");
            // Rollback nếu thất bại
            setCartDetails(prev =>
                prev.map(i => (i.id === id ? { ...i, qty: item.qty } : i))
            );
        } finally {
            setCartDetails(prev =>
                prev.map(i => (i.id === id ? { ...i, updating: false } : i))
            );
        }
    };

    const handleRemove = async (id) => {
        setCartDetails(prev => prev.filter(item => item.id !== id));
        try {
            await removeCartItem(id);
            toast.success("Xóa sản phẩm thành công");
        } catch {
            toast.error("Xóa thất bại");
            fetchCart(); // rollback
        }
    };

    const handleClear = async () => {
        setCartDetails([]);
        try {
            await clearCart();
            toast.success("Đã xóa toàn bộ giỏ hàng");
        } catch {
            toast.error("Xóa giỏ hàng thất bại");
            fetchCart(); // rollback
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    if (loading) return <div className="p-4">Đang tải giỏ hàng...</div>;
    if (cartDetails.length === 0) return <div className="p-4">Giỏ hàng trống</div>;

    const total = cartDetails.reduce(
        (sum, item) => sum + (item.price_sale || item.price) * item.qty,
        0
    );

    return (
        <div className="container mx-auto px-4 max-w-5xl mt-10 mb-20">
            <div className="flex justify-between items-end mb-8 border-b border-[var(--border)] pb-4">
                <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-wider uppercase">
                    Giỏ hàng của bạn
                </h1>
                <button
                    onClick={handleClear}
                    className="text-xs font-bold text-red-500 hover:text-red-700 tracking-widest uppercase"
                >
                    Xóa toàn bộ
                </button>
            </div>

            <div className="space-y-6">
                {cartDetails.map((item) => (
                    <div
                        key={item.id}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between border border-[var(--border)] bg-white/90 dark:bg-zinc-950/40 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start md:items-center gap-6 w-full md:w-auto">
                            <div className="w-24 h-24 relative rounded-2xl overflow-hidden shrink-0 bg-zinc-50 dark:bg-zinc-900/40 border border-[var(--border)]">
                                <Image
                                    src={item.product.image ? `${IMAGE_URL}/products/${item.product.image}` : "/images/default.jpg"}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-sm line-clamp-2 leading-relaxed">
                                    {item.product.name}
                                </h2>

                                {item.attributes && Object.keys(item.attributes).length > 0 && (
                                    <div className="mt-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest flex flex-wrap gap-2">
                                        {Object.entries(item.attributes).map(([key, value]) => (
                                            <span key={key} className="bg-zinc-100 dark:bg-zinc-900/50 px-3 py-1 rounded-full border border-[var(--border)]">
                                                {key}: {value}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-3 font-medium text-sm text-zinc-600 dark:text-zinc-300">
                                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{formatCurrency(item.price_sale || item.price)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between w-full md:w-auto mt-6 md:mt-0 gap-8">
                            <div className="flex items-center bg-zinc-50 dark:bg-zinc-900/40 rounded-full border border-[var(--border)] p-1">
                                <button
                                    onClick={() => changeQty(item.id, -1)}
                                    className="w-8 h-8 flex items-center justify-center text-zinc-500 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-zinc-900/60 rounded-full transition-colors"
                                    disabled={item.updating}
                                >-</button>
                                <span className="w-10 text-center font-bold text-sm">{item.qty}</span>
                                <button
                                    onClick={() => changeQty(item.id, 1)}
                                    className="w-8 h-8 flex items-center justify-center text-zinc-500 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-zinc-900/60 rounded-full transition-colors"
                                    disabled={item.updating}
                                >+</button>
                            </div>
                            
                            <div className="text-right">
                                <div className="font-black text-lg text-zinc-900 dark:text-zinc-100">
                                    {formatCurrency((item.price_sale || item.price) * item.qty)}
                                </div>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="text-xs font-bold text-red-500 hover:text-red-700 tracking-widest uppercase mt-2"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 border-t border-[var(--border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/90 dark:bg-zinc-950/40 p-8 rounded-3xl shadow-sm border border-[var(--border)]">
                <div>
                    <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Tổng Thanh Toán:</span>
                    <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
                        {formatCurrency(total)}
                    </div>
                </div>

                {/* ✅ Nút Thanh toán */}
                <Link
                    href="/checkout"
                    className="bg-zinc-900 hover:bg-black dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-lg shadow-black/20 dark:shadow-none text-center w-full md:w-auto"
                >
                    Tiến hành thanh toán
                </Link>
            </div>
        </div>
    );
}
