'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBoxOpen, FaCheckCircle, FaClock, FaTruck, FaTimesCircle } from 'react-icons/fa';
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
      case 'Hoàn thành': return <FaCheckCircle className="text-green-500" />;
      case 'Đang giao hàng': return <FaTruck className="text-blue-500" />;
      case 'Đã hủy': return <FaTimesCircle className="text-red-500" />;
      case 'Đang xử lý': return <FaClock className="text-yellow-500" />;
      default: return <FaClock className="text-gray-400" />;
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Đang tải lịch sử đơn hàng...
      </div>
    );

  return (
    <div className="min-h-screen from-pink-100 via-rose-50 to-white py-12 px-6 md:px-16 lg:px-32">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-semibold text-pink-700 mb-10 text-center tracking-wide"
      >
        Lịch sử đơn hàng
      </motion.h1>

      {/* ✅ Khoảng cách giữa các đơn hàng được tinh chỉnh bằng gap */}
      <div className="flex flex-col gap-10">
        {orders.map((order, i) => (
          <Link key={order.order_id} href={`/orders/${order.order_id}`}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="cursor-pointer relative bg-white/40 backdrop-blur-xl border border-pink-200/50 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-2"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-pink-100/60">
                <div>
                  <p className="text-sm text-gray-500">Mã đơn hàng</p>
                  <p className="font-semibold text-gray-700">#{order.order_id}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status_text)}
                  <span
                    className={`text-sm font-medium ${order.status_text === 'Hoàn thành'
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

              {/* Nội dung đơn hàng */}
              <div className="px-6 py-4">
                {order.details.slice(0, 2).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 py-3 border-b border-pink-100/40 last:border-0"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shadow-sm">
                      <Image
                        src={item.image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">{item.product_name}</p>
                      <p className="text-sm text-gray-500">
                        SL: {item.qty} ×{' '}
                        <span>{Number(item.price).toLocaleString()}₫</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center px-6 py-4 border-t border-pink-100/60">
                <p className="text-sm text-gray-500">Ngày đặt: {order.created_at}</p>
                <p className="text-lg font-semibold text-pink-700">
                  Tổng: {Number(order.total_amount).toLocaleString()}₫
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Nếu không có đơn hàng */}
      {orders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 mt-12"
        >
          <FaBoxOpen className="text-4xl mx-auto mb-3 opacity-60" />
          <p>Bạn chưa có đơn hàng nào.</p>
        </motion.div>
      )}
    </div>
  );
}
