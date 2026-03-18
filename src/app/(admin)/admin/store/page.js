"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPenToSquare,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import {
  getProductStores as getStores,
  deleteProductStore as deleteStore,
} from "@/api/apiProductStore";
import { toast } from "react-toastify";

export default function ListStores() {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [limit] = useState(5); // số bản ghi / trang
  const [searchTerm, setSearchTerm] = useState(""); // ô tìm kiếm

  // --- Lấy danh sách tồn kho ---
  async function fetchData(page = 1) {
    setLoading(true);
    try {
      const { items, pagination } = await getStores(page, limit);
      setStores(items || []);
      setFilteredStores(items || []);
      setPagination(pagination || { current_page: 1, last_page: 1 });
    } catch (error) {
      toast.error("Không thể tải danh sách tồn kho");
    } finally {
      setLoading(false);
    }
  }

  // --- Load lần đầu ---
  useEffect(() => {
    fetchData();
  }, []);

  // --- Tìm kiếm (lọc frontend, không gọi lại API) ---
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStores(stores);
    } else {
      const keyword = searchTerm.toLowerCase();
      const filtered = stores.filter((st) =>
        st.product?.name?.toLowerCase().includes(keyword)
      );
      setFilteredStores(filtered);
    }
  }, [searchTerm, stores]);

  // --- Mở modal xác nhận ---
  const confirmDelete = (store) => {
    setSelectedStore(store);
    setShowModal(true);
  };

  // --- Xóa tồn kho ---
  const handleDelete = async () => {
    try {
      await deleteStore(selectedStore.id);
      toast.success(`Đã xóa bản ghi tồn kho ID: ${selectedStore.id}`);
      fetchData(pagination?.current_page || 1);
    } catch {
      toast.error("Không thể xóa bản ghi tồn kho");
    } finally {
      setShowModal(false);
      setSelectedStore(null);
    }
  };

  // --- Loading ---
  if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý tồn kho sản phẩm
        </h1>

        {/* Ô tìm kiếm */}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-gray-800 border border-gray-300 rounded-lg px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          {/* Nút Thùng rác */}
          <Link
            href="/admin/store/trash"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 font-medium flex items-center"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Thùng rác
          </Link>

          {/* Nút Thêm mới */}
          <Link
            href="/admin/store/create"
            className="px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 font-medium flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Thêm mới
          </Link>
        </div>
      </div>




      {/* Bảng danh sách */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tên sản phẩm</th>
              <th className="px-4 py-3">Số lượng</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.length > 0 ? (
              filteredStores.map((st) => (
                <tr key={st.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{st.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {st.product?.name || "Không có dữ liệu"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{st.qty}</td>
                  <td className="px-4 py-3">
                    {st.status === 1 ? (
                      <span className="text-green-600 font-semibold">
                        Hiển thị
                      </span>
                    ) : (
                      <span className="text-gray-400">Ẩn</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center space-x-3">
                    <Link href={`/admin/stores/${st.id}`}>
                      <button className="text-blue-500 hover:text-blue-700">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </Link>
                    <Link href={`/admin/stores/${st.id}/edit`}>
                      <button className="text-yellow-500 hover:text-yellow-700">
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    </Link>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => confirmDelete(st)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Không có bản ghi tồn kho nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          {Array.from({ length: pagination.last_page }).map((_, i) => (
            <button
              key={i}
              onClick={() => fetchData(i + 1)}
              className={`px-3 py-1 rounded ${pagination.current_page === i + 1
                ? "bg-pink-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showModal && selectedStore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Bạn có chắc muốn xóa tồn kho ID{" "}
              <span className="text-red-600">{selectedStore.id}</span>?
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
