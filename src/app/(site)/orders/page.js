'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBoxOpen, 
  faCheckCircle, 
  faClock, 
  faTruck, 
  faTimesCircle,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { useOrderHistoryApi } from '@/api/apiCheckout';

export default function Orders() {
  const { getOrderHistory } = useOrderHistoryApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrderHistory();
        setOrders(res.data.data || []);
      } catch (err) {
        console.error('❌ Lỗi khi lấy lịch sử đơn hàng:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (statusText) => {
    switch (statusText) {
      case 'Hoàn thành': return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
      case 'Đang giao hàng': return <FontAwesomeIcon icon={faTruck} className="text-blue-500" />;
      case 'Đã hủy': return <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />;
      case 'Đang xử lý': return <FontAwesomeIcon icon={faClock} className="text-yellow-500" />;
      default: return <FontAwesomeIcon icon={faClock} className="text-slate-400" />;
    }
  };

  if (loading)
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-6">
        <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-medium">Đang chuẩn bị lịch sử đơn hàng...</p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
      <div className="text-center mb-20 space-y-4">
        <span className="text-accent text-[10px] md:text-xs font-medium uppercase tracking-[0.4em]">
          Dấu ấn mua sắm
        </span>
        <h1 className="font-serif text-4xl md:text-6xl text-foreground tracking-tight uppercase">
          Lịch sử đơn hàng
        </h1>
        <div className="w-20 h-[1px] bg-accent/30 mx-auto mt-6"></div>
      </div>

      <div className="space-y-12">
        {orders.map((order) => (
          <Link key={order.order_id} href={`/orders/${order.order_id}`} className="block group">
            <div className="relative border border-border/50 bg-white/50 dark:bg-slate-900/10 hover:border-accent/30 transition-all duration-500 p-1 md:p-2">
              <div className="absolute top-0 left-0 w-1 h-0 bg-accent group-hover:h-full transition-all duration-700"></div>
              
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-6 border-b border-border/30">
                <div className="space-y-1">
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium">Mã đơn hàng</p>
                  <p className="font-serif text-lg text-foreground group-hover:text-accent transition-colors">#{order.order_id}</p>
                </div>
                <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 px-4 py-2 border border-border/30">
                  {getStatusIcon(order.status_text)}
                  <span
                    className={`text-[10px] font-medium uppercase tracking-widest ${order.status_text === 'Hoàn thành'
                        ? 'text-green-600'
                        : order.status_text === 'Đang giao hàng'
                          ? 'text-blue-600'
                          : order.status_text === 'Đã hủy'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                      }`}
                  >
                    {order.status_text}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {order.details.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6">
                    <div className="relative w-20 h-20 overflow-hidden border border-border/30 bg-white dark:bg-slate-900">
                      <Image
                        src={item.image}
                        alt={item.product_name}
                        fill
                        className="object-contain p-2 grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-[11px] font-medium uppercase tracking-tight line-clamp-1 text-foreground">{item.product_name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        Số lượng: {item.qty} × <span className="text-accent">{Number(item.price).toLocaleString()}₫</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center px-6 py-6 border-t border-border/30 bg-slate-50/50 dark:bg-slate-900/5">
                <div className="space-y-1 text-left">
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium">Ngày đặt</p>
                    <p className="text-xs text-foreground tracking-widest font-light">{order.created_at}</p>
                </div>
                <div className="text-right flex items-baseline gap-6">
                    <div className="space-y-1">
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium">Tổng giá trị</p>
                        <p className="font-serif text-2xl text-accent">
                        {Number(order.total_amount).toLocaleString()}₫
                        </p>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* No Orders State */}
      {orders.length === 0 && (
        <div className="text-center py-32 space-y-8 border border-dashed border-border/50">
          <div className="w-20 h-20 rounded-full border border-border/50 bg-slate-50 dark:bg-slate-900/10 flex items-center justify-center text-accent/30 mx-auto">
             <FontAwesomeIcon icon={faBoxOpen} className="text-3xl" />
          </div>
          <div className="space-y-4">
            <h2 className="font-serif text-3xl text-foreground tracking-wide">Bạn chưa có đơn hàng nào</h2>
            <p className="text-muted-foreground font-light text-sm max-w-sm mx-auto uppercase tracking-widest">Hãy bắt đầu hành trình tìm kiếm những tuyệt tác tại Hoang Watch.</p>
          </div>
          <Link href="/products" className="inline-block px-10 py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.4em] font-medium hover:bg-accent hover:text-white transition-all duration-300">
             Khám phá sản phẩm
          </Link>
        </div>
      )}
    </div>
  );
}

