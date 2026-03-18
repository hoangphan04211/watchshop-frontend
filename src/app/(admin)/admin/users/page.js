"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPenToSquare,
  faEye,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { getAllUsers, deleteUser } from "@/api/apiUser";
import { toast } from "react-toastify";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal xóa
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Tải danh sách user
  async function fetchData() {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Xác nhận xóa
  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Thực hiện xóa
  const handleDelete = async () => {
    try {
      await deleteUser(selectedUser.id);
      toast.success(`Đã xóa người dùng ${selectedUser.name}`);
      fetchData(); // load lại danh sách
    } catch (error) {
      toast.error("Không thể xóa người dùng");
    } finally {
      setShowModal(false);
      setSelectedUser(null);
    }
  };

  if (loading) return <p className="p-6">Đang tải người dùng...</p>;

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
        <Link
          href="/admin/users/create"
          className="px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 font-medium"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Thêm mới
        </Link>
      </div>

      {/* Bảng danh sách */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Số điện thoại</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">#{user.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600">{user.phone}</td>
                  <td className="px-4 py-3">
                    {user.roles === "admin" ? (
                      <span className="px-3 py-1 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full">
                        Quản trị
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                        Khách hàng
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {user.status === 1 ? (
                      <span className="px-3 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-full">
                        Ẩn
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center space-x-3">
                    {/* Xem chi tiết */}
                    <Link href={`/admin/users/${user.id}`}>
                      <button className="text-blue-500 hover:text-blue-700">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </Link>

                    {/* Sửa */}
                    <Link href={`/admin/users/${user.id}/edit`}>
                      <button className="text-yellow-500 hover:text-yellow-700">
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    </Link>

                    {/* Xóa */}
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => confirmDelete(user)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  Không có người dùng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal xác nhận xóa */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Bạn có chắc muốn xóa người dùng{" "}
              <span className="text-red-600">{selectedUser.name}</span>?
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
