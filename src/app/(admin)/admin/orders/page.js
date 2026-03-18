"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPenToSquare,
  faEye,
  faToggleOn,
  faToggleOff,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import {
  getOrders,
  deleteOrder,
} from "@/api/apiOrder";
import { toast } from "react-toastify";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal xóa
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // load orders
  async function fetchData() {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      toast.error("Lỗi khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // mở modal xác nhận
  const confirmDelete = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // thực hiện xóa
  const handleDelete = async () => {
    try {
      await deleteOrder(selectedOrder.id);
      toast.success(`Đã xóa đơn hàng #${selectedOrder.id}`);
      fetchData(); // reload lại list
    } catch (error) {
      toast.error("Không thể xóa đơn hàng");
    } finally {
      setShowModal(false);
      setSelectedOrder(null);
    }
  };

  if (loading) return <p className="p-6">Đang tải đơn hàng...</p>;

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
        <div className="space-x-3">
          <Link
            href="/admin/orders/trash"
            className="px-4 py-2 bg-gray-100 rounded-lg shadow hover:bg-gray-200 text-gray-700 font-medium"
          >
            <FontAwesomeIcon icon={faTrashCan} className="mr-2" />
            Thùng rác
          </Link>
          <Link
            href="/admin/orders/create"
            className="px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 font-medium"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Thêm mới
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tên KH</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">#{order.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {order.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.email}</td>
                  <td className="px-4 py-3">
                    {order.status === 0 && (
                      <span className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">
                        Hủy
                      </span>
                    )}
                    {order.status === 1 && (
                      <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                        Mới
                      </span>
                    )}
                    {order.status === 2 && (
                      <span className="px-3 py-1 text-xs font-semibold text-yellow-600 bg-yellow-100 rounded-full">
                        Đang giao
                      </span>
                    )}
                    {order.status === 3 && (
                      <span className="px-3 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full">
                        Hoàn tất
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center space-x-3">
                    {/* Xem chi tiết */}
                    <Link href={`/admin/orders/${order.id}`}>
                      <button className="text-blue-500 hover:text-blue-700">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </Link>

                    {/* Sửa */}
                    <Link href={`/admin/orders/${order.id}/edit`}>
                      <button className="text-yellow-500 hover:text-yellow-700">
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    </Link>

                    {/* Xóa */}
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => confirmDelete(order)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  Không có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal xác nhận xóa */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Bạn có chắc muốn xóa đơn hàng{" "}
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
