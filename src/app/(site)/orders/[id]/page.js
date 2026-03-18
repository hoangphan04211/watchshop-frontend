'use client';
import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useOrderDetailApi } from '@/api/apiCheckout';
import { FaArrowLeft, FaCheckCircle, FaClock, FaTruck, FaTimesCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function OrderDetail({ params }) {
    // ✅ Giải quyết cảnh báo: params giờ là Promise
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
                Đang tải chi tiết đơn hàng...
            </div>
        );

    if (!order)
        return (
            <div className="text-center text-gray-500 mt-12">
                Không tìm thấy đơn hàng.
            </div>
        );

    return (
        <div className="min-h-screen from-pink-50 to-white py-12 px-6 md:px-20 lg:px-32">
            <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-pink-100/50">

                {/* 🔙 Nút quay lại */}
                <div className="flex items-center gap-2 mb-6">
                    <Link
                        href="/products"
                        className="text-pink-600 hover:text-pink-700 flex items-center gap-2"
                    >
                        <FaArrowLeft /> <span>Quay lại</span>
                    </Link>
                </div>

                {/* 🧾 Thông tin đơn hàng */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h2 className="text-2xl font-semibold text-pink-700 mb-2">
                        Đơn hàng #{order.order_id}
                    </h2>

                    <div className="flex items-center gap-2 mb-4">
                        {getStatusIcon(order.status_text)}
                        <span className="text-pink-600 font-medium">{order.status_text}</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                        <p><strong>Người nhận:</strong> {order.name}</p>
                        <p><strong>Số điện thoại:</strong> {order.phone}</p>
                        <p><strong>Email:</strong> {order.email}</p>
                        <p><strong>Địa chỉ:</strong> {order.address}</p>
                        {order.note && (
                            <p className="md:col-span-2"><strong>Ghi chú:</strong> {order.note}</p>
                        )}
                    </div>
                </motion.div>

                <hr className="my-6 border-pink-100" />

                {/* 📦 Danh sách sản phẩm */}
                <div>
                    <h3 className="text-xl font-semibold text-pink-700 mb-4">Sản phẩm</h3>
                    <div className="space-y-4">
                        {order.details.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-4 bg-white/50 p-4 rounded-xl shadow-sm border border-pink-100/60"
                            >
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.product_name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-700">
                                        {item.product_name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {item.attributes && Object.keys(item.attributes).length > 0 && (
                                            <>
                                                {Object.entries(item.attributes).map(([key, value], i) => (
                                                    <span key={i} className="mr-2">
                                                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                                                        {i < Object.entries(item.attributes).length - 1 ? ' | ' : ''}
                                                    </span>
                                                ))}
                                                <br />
                                            </>
                                        )}
                                        SL: {item.qty} × {Number(item.price).toLocaleString()}₫
                                    </p>

                                </div>
                                <p className="font-semibold text-pink-600">
                                    {Number(item.amount).toLocaleString()}₫
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 💰 Tổng kết */}
                <div className="mt-8 flex justify-end">
                    <div className="text-right">
                        <p className="text-gray-600">Ngày đặt: {order.created_at}</p>
                        <p className="text-xl font-semibold text-pink-700 mt-1">
                            Tổng thanh toán: {Number(order.total_amount).toLocaleString()}₫
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
