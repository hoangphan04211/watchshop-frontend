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
import { getBanners, deleteBanner } from "@/api/apiBanner";
import { IMAGE_URL } from "@/api/config";
import { toast } from "react-toastify";

export default function BannerList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal xóa
  const [showModal, setShowModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  // load banners
  async function fetchData() {
    try {
      const data = await getBanners();
      setBanners(data);
    } catch (error) {
      toast.error("Lỗi khi tải banner");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // mở modal xác nhận
  const confirmDelete = (banner) => {
    setSelectedBanner(banner);
    setShowModal(true);
  };

  // thực hiện xóa
  const handleDelete = async () => {
    try {
      await deleteBanner(selectedBanner.id);
      toast.success(`Đã xóa banner: ${selectedBanner.name}`);
      fetchData(); // reload lại list
    } catch (error) {
      toast.error("Không thể xóa banner");
    } finally {
      setShowModal(false);
      setSelectedBanner(null);
    }
  };

  if (loading) return <p className="p-6">Đang tải banner...</p>;

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Banner</h1>
        <div className="space-x-3">
          <Link
            href="/admin/banners/trash"
            className="px-4 py-2 bg-gray-100 rounded-lg shadow hover:bg-gray-200 text-gray-700 font-medium"
          >
            <FontAwesomeIcon icon={faTrashCan} className="mr-2" />
            Thùng rác
          </Link>
          <Link
            href="/admin/banners/create"
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
              <th className="px-4 py-3">Ảnh</th>
              <th className="px-4 py-3">Tên banner</th>
              <th className="px-4 py-3">Vị trí</th>
              <th className="px-4 py-3">Thứ tự</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {banners.length > 0 ? (
              banners.map((banner) => (
                <tr key={banner.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{banner.id}</td>
                  <td className="px-4 py-3">
                    {banner.image ? (
                      <Image
                        src={`${IMAGE_URL}/banners/${banner.image}`}
                        alt={banner.name}
                        width={80}
                        height={80}
                        className="w-20 h-15 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-15 bg-gray-100 flex items-center justify-center rounded-md">
                        <span className="text-gray-400 text-xs">No Img</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {banner.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{banner.position}</td>
                  <td className="px-4 py-3 text-gray-600">{banner.sort_order}</td>
                  <td className="px-4 py-3">
                    {banner.status === 1 ? (
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
                    <Link href={`/admin/banners/${banner.id}`}>
                      <button className="text-blue-500 hover:text-blue-700">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </Link>

                    {/* Sửa */}
                    <Link href={`/admin/banners/${banner.id}/edit`}>
                      <button className="text-yellow-500 hover:text-yellow-700">
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    </Link>

                    {/* Xóa */}
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => confirmDelete(banner)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  Không có banner nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal xác nhận xóa */}
      {showModal && selectedBanner && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Bạn có chắc muốn xóa banner{" "}
              <span className="text-red-600">{selectedBanner.name}</span>?
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
