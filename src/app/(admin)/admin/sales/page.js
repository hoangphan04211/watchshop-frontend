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
import { getProductSales as getSales, deleteProductSale as deleteSale } from "@/api/apiSale";
import { toast } from "react-toastify";

export default function ListSales() {
  const [sales, setSales] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  // --- Lấy danh sách chương trình sale ---
  async function fetchData(page = 1, search = keyword) {
    try {
      const { items, pagination } = await getSales(page, search);
      setSales(items || []);
      setPagination(pagination || { current_page: 1, last_page: 1 });
    } catch (error) {
      toast.error("Lỗi khi tải chương trình khuyến mãi");
    } finally {
      setLoading(false);
    }
  }

  // Gọi API khi nhập tìm kiếm (debounce)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData(1, keyword);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [keyword]);

  // Lần đầu load
  useEffect(() => {
    fetchData();
  }, []);

  // Mở modal xác nhận
  const confirmDelete = (sale) => {
    setSelectedSale(sale);
    setShowModal(true);
  };

  // Xóa chương trình sale
  const handleDelete = async () => {
    try {
      await deleteSale(selectedSale.id);
      toast.success(`Đã xóa chương trình: ${selectedSale.name}`);
      fetchData(pagination?.current_page || 1, keyword);
    } catch (error) {
      toast.error("Không thể xóa chương trình");
    } finally {
      setShowModal(false);
      setSelectedSale(null);
    }
  };

  if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý chương trình khuyến mãi
        </h1>
        <Link
          href="/admin/sales/create"
          className="px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 font-medium"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Thêm mới
        </Link>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="flex items-center space-x-4 mb-6">
        <input
          type="text"
          placeholder="Tìm theo tên chương trình..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="text-gray-700 px-4 py-2 border rounded-lg w-1/3"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tên chương trình</th>
              <th className="px-4 py-3">Ngày bắt đầu</th>
              <th className="px-4 py-3">Ngày kết thúc</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{s.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {s.date_begin
                      ? new Date(s.date_begin).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {s.date_end
                      ? new Date(s.date_end).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {s.status === 1 ? (
                      <span className="text-green-600 font-semibold">
                        Hiển thị
                      </span>
                    ) : (
                      <span className="text-gray-400">Ẩn</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center space-x-3">
                    <Link href={`/admin/sales/${s.id}`}>
                      <button className="text-blue-500 hover:text-blue-700">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </Link>
                    <Link href={`/admin/sales/${s.id}/edit`}>
                      <button className="text-yellow-500 hover:text-yellow-700">
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    </Link>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => confirmDelete(s)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  Không có chương trình nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination an toàn */}
      {pagination && pagination.last_page > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          {Array.from({ length: pagination.last_page }).map((_, i) => (
            <button
              key={i}
              onClick={() => fetchData(i + 1, keyword)}
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
      {showModal && selectedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Bạn có chắc muốn xóa{" "}
              <span className="text-red-600">{selectedSale.name}</span>?
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
