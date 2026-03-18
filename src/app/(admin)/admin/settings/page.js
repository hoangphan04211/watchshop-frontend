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
} from "@fortawesome/free-solid-svg-icons";
import { getSettings, deleteSetting } from "@/api/apiSetting";
import { toast } from "react-toastify";

export default function SettingList() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);

  // 🟢 Load danh sách setting
  async function fetchData() {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách cài đặt");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // 🗑️ Mở modal xác nhận
  const confirmDelete = (setting) => {
    setSelectedSetting(setting);
    setShowModal(true);
  };

  // 🗑️ Thực hiện xóa
  const handleDelete = async () => {
    try {
      await deleteSetting(selectedSetting.id);
      toast.success(`Đã xóa cấu hình: ${selectedSetting.site_name}`);
      fetchData();
    } catch (error) {
      toast.error("Không thể xóa cấu hình");
    } finally {
      setShowModal(false);
      setSelectedSetting(null);
    }
  };

  if (loading) return <p className="p-6">Đang tải cài đặt...</p>;

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cấu hình Website</h1>
        <div className="space-x-3">
          <Link
            href="/admin/settings/create"
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
              <th className="px-4 py-3">Tên Website</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Hotline</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {settings.length > 0 ? (
              settings.map((setting) => (
                <tr key={setting.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{setting.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {setting.site_name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{setting.email}</td>
                  <td className="px-4 py-3 text-gray-600">{setting.hotline}</td>
                  <td className="px-4 py-3">
                    {setting.status === 1 ? (
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
                    {/* Xem */}
                    <Link href={`/admin/settings/${setting.id}`}>
                      <button className="text-blue-500 hover:text-blue-700">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </Link>

                    {/* Sửa */}
                    <Link href={`/admin/settings/${setting.id}/edit`}>
                      <button className="text-yellow-500 hover:text-yellow-700">
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    </Link>

                    {/* Xóa */}
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => confirmDelete(setting)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Không có cấu hình nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal xác nhận xóa */}
      {showModal && selectedSetting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Bạn có chắc muốn xóa cấu hình{" "}
              <span className="text-red-600">{selectedSetting.site_name}</span>?
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
