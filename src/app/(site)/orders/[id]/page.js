'use client';
import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { useOrderDetailApi } from '@/api/apiCheckout';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowLeft, 
  faCheckCircle, 
  faClock, 
  faTruck, 
  faTimesCircle,
  faShieldHalved,
  faReceipt
} from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';

export default function OrderDetail({ params }) {
    const { id } = use(params);

    const { getOrderDetail } = useOrderDetailApi();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getOrderDetail(id);
                setOrder(res.data.data);
            } catch (err) {
                console.error('❌ Lỗi khi lấy chi tiết đơn hàng:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const getStatusIcon = (statusText) => {
        switch (statusText) {
            case 'Hoàn thành': return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
            case 'Đang giao hàng': return <FontAwesomeIcon icon={faTruck} className="text-blue-500" />;
            case 'Đã hủy': return <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />;
            case 'Đang xử lý': return <FontAwesomeIcon icon={faClock} className="text-yellow-500" />;
            default: return <FontAwesomeIcon icon={faClock} className="text-slate-400" />;
        }
    };

    const formatCurrency = (num) =>
        num.toLocaleString("vi-VN") + "₫";

    if (loading)
        return (
            <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-6">
                <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-medium">Đang truy xuất thông tin đơn hàng...</p>
            </div>
        );

    if (!order)
        return (
            <div className="container mx-auto px-4 py-32 text-center space-y-8">
                <h2 className="font-serif text-3xl text-foreground tracking-wide">Không tìm thấy đơn hàng</h2>
                <Link href="/orders" className="text-[10px] uppercase tracking-[0.4em] text-accent hover:underline">Quay lại danh sách</Link>
            </div>
        );

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
            {/* Header / Back Button */}
            <div className="mb-12">
                <Link
                    href="/orders"
                    className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground hover:text-accent transition-colors"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="text-[8px]" />
                    <span>Quay lại lịch sử mua hàng</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-8 border-b border-border/50 pb-12">
                     <div className="text-center md:text-left space-y-3">
                        <span className="text-accent text-xs font-medium uppercase tracking-[0.4em]">Chi tiết tuyệt tác</span>
                        <h1 className="font-serif text-4xl md:text-6xl text-foreground tracking-tight uppercase">Đơn hàng #{order.order_id}</h1>
                     </div>
                     <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 px-6 py-4 border border-border/30">
                        {getStatusIcon(order.status_text)}
                        <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-foreground">{order.status_text}</span>
                     </div>
                </div>

                {/* Shipping Info */}
                <div className="lg:col-span-4 space-y-12 h-fit md:sticky md:top-32">
                    <div className="space-y-10">
                        <h3 className="text-[11px] uppercase tracking-[0.4em] font-medium text-foreground border-b border-border/50 pb-6">Địa chỉ nhận hàng</h3>
                        
                        <div className="space-y-8">
                             <div className="space-y-2">
                                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium">Người nhận</p>
                                <p className="font-serif text-xl text-foreground">{order.name}</p>
                             </div>
                             <div className="space-y-2">
                                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium">Liên hệ</p>
                                <p className="text-xs text-foreground tracking-widest font-light">{order.phone} / {order.email}</p>
                             </div>
                             <div className="space-y-2">
                                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium">Địa chỉ</p>
                                <p className="text-xs text-foreground tracking-widest font-light leading-relaxed">{order.address}</p>
                             </div>
                             {order.note && (
                                <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-900 border border-border/50 border-l-accent border-l-2">
                                    <p className="text-[9px] uppercase tracking-widest text-accent font-medium">Ghi chú</p>
                                    <p className="text-xs text-foreground italic font-light leading-relaxed">{order.note}</p>
                                </div>
                             )}
                        </div>
                    </div>

                    <div className="pt-8 space-y-6">
                        <div className="flex items-start gap-4 group">
                             <FontAwesomeIcon icon={faShieldHalved} className="text-accent/40 text-sm mt-0.5 group-hover:text-accent transition-colors" />
                             <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-light">Giao dịch được bảo mật bởi chuẩn quốc tế</p>
                        </div>
                        <div className="flex items-start gap-4 group">
                             <FontAwesomeIcon icon={faReceipt} className="text-accent/40 text-sm mt-0.5 group-hover:text-accent transition-colors" />
                             <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-light">Hóa đơn điện tử đã được gửi tới email</p>
                        </div>
                    </div>
                </div>

                {/* Product List */}
                <div className="lg:col-span-8 space-y-12">
                    <h3 className="text-[11px] uppercase tracking-[0.4em] font-medium text-foreground border-b border-border/50 pb-6">Danh sách sản phẩm</h3>
                    
                    <div className="space-y-10">
                        {order.details.map((item, idx) => (
                            <div
                                key={idx}
                                className="group grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-10 border-b border-border/30 last:border-0"
                            >
                                <div className="md:col-span-3">
                                    <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-900/5 transition-all duration-700">
                                        <Image
                                            src={item.image}
                                            alt={item.product_name}
                                            fill
                                            className="object-contain p-4 grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-6 space-y-4 text-left">
                                    <h4 className="font-serif text-xl md:text-2xl text-foreground leading-tight">{item.product_name}</h4>
                                    {item.attributes && Object.keys(item.attributes).length > 0 && (
                                        <div className="flex flex-wrap gap-4">
                                            {Object.entries(item.attributes).map(([key, value]) => (
                                                <span key={key} className="text-[9px] uppercase tracking-widest text-muted-foreground border border-border/30 px-3 py-1">
                                                    {key}: <span className="text-foreground">{value}</span>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                        Đơn giá: {formatCurrency(Number(item.price))}
                                    </p>
                                </div>
                                <div className="md:col-span-3 text-right space-y-2">
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Thành tiền (x{item.qty})</p>
                                    <p className="font-serif text-2xl text-accent">
                                        {formatCurrency(Number(item.amount))}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="mt-12 p-8 md:p-12 bg-slate-50/50 dark:bg-slate-900/10 border border-border/50">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-muted-foreground">
                                <span>Ngày đặt hàng</span>
                                <span className="text-foreground">{order.created_at}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-muted-foreground">
                                <span>Vận chuyển đặc quyền</span>
                                <span className="text-accent italic">Miễn phí</span>
                            </div>
                            <div className="pt-8 border-t border-border flex justify-between items-baseline">
                                <span className="text-sm font-medium uppercase tracking-[0.3em] text-foreground">Tổng cộng thanh toán</span>
                                <span className="font-serif text-4xl text-foreground tracking-tight">{formatCurrency(Number(order.total_amount))}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

