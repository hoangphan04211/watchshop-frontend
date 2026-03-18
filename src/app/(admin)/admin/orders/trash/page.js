"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRotateLeft,
    faTrashCan,
    faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
    getTrashOrders,
    restoreOrder,
    forceDeleteOrder,
} from "@/api/apiOrder";

export default function OrdersTrash() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    async function fetchData() {
        try {
            const res = await getTrashOrders();
            setOrders(res || []);
        } catch (error) {
            // toast đã xử lý trong api
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleRestore = async (id) => {
        try {
            await restoreOrder(id);
            fetchData();
        } catch (error) {
            // toast đã xử lý trong api
        }
    };

    const handleForceDelete = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (selectedOrder) {
            try {
                await forceDeleteOrder(selectedOrder.id);
                fetchData();
            } catch (error) {
                // toast đã xử lý trong api
            } finally {
                setShowModal(false);
                setSelectedOrder(null);
            }
        }
    };

    if (loading) return <p className="p-6">Đang tải thùng rác...</p>;

    return (
        <div className="p-6 bg-white shadow rounded-xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Thùng rác đơn hàng</h1>
                <Link
                    href="/admin/orders"
                    className="px-4 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300 text-gray-700 font-medium"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Quay lại
                </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-md rounded-xl overflow-hidden">
                    <thead className="bg-gray-100 text-gray-700 text-left">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Khách hàng</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">SĐT</th>
                            <th className="px-4 py-3">Địa chỉ</th>
                            <th className="px-4 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((o) => (
                                <tr key={o.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3">{o.id}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">
                                        {o.name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{o.email}</td>
                                    <td className="px-4 py-3 text-gray-600">{o.phone}</td>
                                    <td className="px-4 py-3 text-gray-600">{o.address}</td>
                                    <td className="px-4 py-3 text-center space-x-3">
                                        <button
                                            onClick={() => handleRestore(o.id)}
                                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                                        >
                                            <FontAwesomeIcon icon={faArrowRotateLeft} className="mr-1" />
                                            Khôi phục
                                        </button>
                                        <button
                                            onClick={() => handleForceDelete(o)}
                                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} className="mr-1" />
                                            Xóa vĩnh viễn
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">
                                    Thùng rác trống
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal xác nhận xóa */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">
                            Bạn có chắc muốn xóa vĩnh viễn đơn hàng{" "}
                            <span className="text-red-600">#{selectedOrder.id}</span>?
                        </h2>
                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => setShowModal(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={handleDelete}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
