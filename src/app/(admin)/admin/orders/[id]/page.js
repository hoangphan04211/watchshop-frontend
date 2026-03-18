"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getOrderById } from "@/api/apiOrder";

export default function OrderDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getOrderById(id);
                if (!data) {
                    toast.error("Không tìm thấy đơn hàng");
                    router.push("/admin/orders");
                } else {
                    setOrder(data);
                }
            } catch {
                toast.error("Không tìm thấy đơn hàng");
                router.push("/admin/orders");
            }
        }
        if (id) fetchData();
    }, [id, router]);

    if (!order)
        return (
            <p className="p-6 text-center text-gray-500">Đang tải đơn hàng...</p>
        );

    // map status
    const statusText = {
        0: { text: "Hủy", color: "bg-red-100 text-red-700" },
        1: { text: "Mới", color: "bg-blue-100 text-blue-700" },
        2: { text: "Đang giao", color: "bg-yellow-100 text-yellow-700" },
        3: { text: "Hoàn tất", color: "bg-green-100 text-green-700" },
    };

    return (
        <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-xl space-y-8">
            {/* Header */}
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Chi tiết đơn hàng #{order.id}
            </h1>

            {/* Thông tin đơn hàng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border text-gray-700">
                <p>
                    <span className="font-semibold text-gray-600">Mã đơn hàng:</span> #{order.id}
                </p>
                <p>
                    <span className="font-semibold text-gray-600">Ngày tạo:</span>{" "}
                    {new Date(order.created_at).toLocaleString("vi-VN")}
                </p>
                <p>
                    <span className="font-semibold text-gray-600">Trạng thái:</span>{" "}
                    <span
                        className={`inline-block px-3 py-1 text-sm rounded-full ${statusText[order.status]?.color || "bg-gray-100 text-gray-600"}`}
                    >
                        {statusText[order.status]?.text || "Không rõ"}
                    </span>
                </p>
                <p>
                    <span className="font-semibold text-gray-600">Người đặt:</span> {order.name}
                </p>
            </div>

            {/* Thông tin khách hàng */}
            <div className="bg-gray-50 p-6 rounded-lg border">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin khách hàng</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                    <p><span className="font-semibold">Họ tên:</span> {order.name}</p>
                    <p><span className="font-semibold">Email:</span> {order.email}</p>
                    <p><span className="font-semibold">Số điện thoại:</span> {order.phone}</p>
                    <p><span className="font-semibold">Địa chỉ:</span> {order.address}</p>
                </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="bg-gray-50 p-6 rounded-lg border">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Sản phẩm trong đơn</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white rounded-lg shadow">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left">#</th>
                                <th className="px-4 py-3 text-left">Sản phẩm</th>
                                <th className="px-4 py-3 text-right">Giá</th>
                                <th className="px-4 py-3 text-right">Số lượng</th>
                                <th className="px-4 py-3 text-right">Giảm giá</th>
                                <th className="px-4 py-3 text-right">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.details && order.details.length > 0 ? (
                                order.details.map((item, idx) => (
                                    <tr key={item.id} className="border-t hover:bg-gray-50">
                                        <td className="text-gray-700 px-4 py-3">{idx + 1}</td>
                                        <td className="text-gray-700 px-4 py-3">{item.product?.name || "Sản phẩm #" + item.product_id}</td>
                                        <td className="text-gray-700 px-4 py-3 text-right">{item.price.toLocaleString()}₫</td>
                                        <td className="text-gray-700 px-4 py-3 text-right">{item.qty}</td>
                                        <td className="text-gray-700 px-4 py-3 text-right">{item.discount.toLocaleString()}₫</td>
                                        <td className="text-gray-700 px-4 py-3 text-right font-semibold">
                                            {item.amount.toLocaleString()}₫
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-gray-500">
                                        Không có sản phẩm
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Ghi chú */}
            <div className="bg-gray-50 p-6 rounded-lg border">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Ghi chú</h2>
                <p className="text-gray-700 whitespace-pre-line">
                    {order.note || "Không có ghi chú"}
                </p>
            </div>

            {/* Nút chỉnh sửa */}
            <div className="flex justify-end">
                <button
                    onClick={() => router.push(`/admin/orders`)}
                    className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition"
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
}
