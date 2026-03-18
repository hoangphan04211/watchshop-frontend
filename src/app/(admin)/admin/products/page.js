"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
import { getProducts, deleteProduct } from "@/api/apiProduct";
import { getCategories } from "@/api/apiCategory";
import { IMAGE_URL } from "@/api/config";
import { toast } from "react-toastify";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]); // lưu danh mục
  const [keyword, setKeyword] = useState(""); // từ khóa tìm kiếm
  const [categoryId, setCategoryId] = useState(""); // lọc theo danh mục

  // modal xác nhận xóa
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // lấy dữ liệu sản phẩm
  async function fetchData(page = 1, search = keyword, cat = categoryId) {
    try {
      const { items, pagination } = await getProducts(page, search, cat);
      setProducts(items);
      setPagination(pagination);
    } catch (error) {
      toast.error("Lỗi khi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  }

  // lấy danh mục khi load trang
  useEffect(() => {
    getCategories().then((res) => setCategories(res));
  }, []);

  // gọi API khi keyword hoặc categoryId thay đổi
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData(1, keyword, categoryId);
    }, 500); // debounce 0.5s

    return () => clearTimeout(delayDebounce);
  }, [keyword, categoryId]);

  useEffect(() => {
    fetchData();
  }, []);

  // mở modal xác nhận
  const confirmDelete = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // xóa sản phẩm
  const handleDelete = async () => {
    try {
      await deleteProduct(selectedProduct.id);
      toast.success(`Đã xóa sản phẩm: ${selectedProduct.name}`);
      fetchData(pagination.current_page, keyword, categoryId);
    } catch (error) {
      toast.error("Không thể xóa sản phẩm");
    } finally {
      setShowModal(false);
      setSelectedProduct(null);
    }
  };

  if (loading) return <p className="p-6">Đang tải sản phẩm...</p>;

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
        <div className="space-x-3">
          <Link
            href="/admin/products/trash"
            className="px-4 py-2 bg-gray-100 rounded-lg shadow hover:bg-gray-200 text-gray-700 font-medium"
          >
            <FontAwesomeIcon icon={faTrashCan} className="mr-2" />
            Thùng rác
          </Link>
          <Link
            href="/admin/products/create"
            className="px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 font-medium"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Thêm mới
          </Link>
        </div>
      </div>

      {/* Thanh tìm kiếm + lọc */}
      <div className="flex items-center space-x-4 mb-6">
        {/* Tìm kiếm theo tên */}
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="text-gray-700 px-4 py-2 border rounded-lg w-1/3"
        />

        {/* Lọc theo danh mục */}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="text-gray-700 px-4 py-2 border rounded-lg"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Ảnh</th>
              <th className="px-4 py-3">Tên sản phẩm</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Giá</th>
              <th className="px-4 py-3">Giá Sale</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{p.id}</td>
                  <td className="px-4 py-3">
                    <Image
                      src={`${IMAGE_URL}/products/${p.image}`}
                      alt={p.name}
                      width={60}
                      height={60}
                      className="w-20 h-15 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.slug}</td>
                  <td className="px-4 py-3 text-pink-600 font-semibold">
                    {p.price?.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-green-600 font-semibold">
                    {p.price_sale?.toLocaleString() || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {p.status === 1 ? (
                      <FontAwesomeIcon
                        icon={faToggleOn}
                        className="text-green-500 text-xl"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faToggleOff}
                        className="text-gray-400 text-xl"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center space-x-3">
                    {/* Xem chi tiết */}
                    <Link href={`/admin/products/${p.id}`}>
                      <button className="text-blue-500 hover:text-blue-700">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </Link>

                    {/* Sửa */}
                    <Link href={`/admin/products/${p.id}/edit`}>
                      <button className="text-yellow-500 hover:text-yellow-700">
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    </Link>
                    {/* Xóa mềm */}
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => confirmDelete(p)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-6 text-gray-500">
                  Không có sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination?.last_page > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          {Array.from({ length: pagination.last_page }).map((_, i) => (
            <button
              key={i}
              onClick={() => fetchData(i + 1, keyword, categoryId)}
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
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Bạn có chắc muốn xóa sản phẩm{" "}
              <span className="text-red-600">{selectedProduct.name}</span>?
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
