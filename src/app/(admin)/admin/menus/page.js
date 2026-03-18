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
import { getMenus, deleteMenu } from "@/api/apiMenu";
import { toast } from "react-toastify";

export default function MenuList() {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);

    async function fetchData() {
        try {
            const data = await getMenus();
            setMenus(data);
        } catch {
            toast.error("Lỗi khi tải danh sách menu");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const confirmDelete = (menu) => {
        setSelectedMenu(menu);
        setShowModal(true);
    };

    const handleDelete = async () => {
        try {
            await deleteMenu(selectedMenu.id);
            toast.success(`Đã xóa menu: ${selectedMenu.name}`);
            fetchData();
        } catch {
            toast.error("Không thể xóa menu");
        } finally {
            setShowModal(false);
            setSelectedMenu(null);
        }
    };

    if (loading) return <p className="p-6">Đang tải menu...</p>;

    return (
        <div className="p-6 bg-white rounded-xl shadow">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Menu</h1>
                <Link
                    href="/admin/menus/create"
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Thêm mới
                </Link>
            </div>

            <table className="w-full border-collapse bg-white shadow rounded-xl overflow-hidden">
                <thead className="bg-gray-100 text-gray-700 text-left">
                    <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Tên menu</th>
                        <th className="px-4 py-3">Link</th>
                        <th className="px-4 py-3">Loại</th>
                        <th className="px-4 py-3 text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {menus.length > 0 ? (
                        menus.map((menu) => (
                            <tr key={menu.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3">{menu.id}</td>
                                <td className="px-4 py-3 font-medium">{menu.name}</td>
                                <td className="px-4 py-3 text-gray-600">{menu.link}</td>
                                <td className="px-4 py-3 text-gray-600">{menu.type}</td>
                                <td className="px-4 py-3 text-center space-x-3">
                                    <Link href={`/admin/menus/${menu.id}`}>
                                        <button className="text-blue-500 hover:text-blue-700">
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                    </Link>
                                    <Link href={`/admin/menus/${menu.id}/edit`}>
                                        <button className="text-yellow-500 hover:text-yellow-700">
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                    </Link>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => confirmDelete(menu)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-6 text-gray-500">
                                Không có menu nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal xác nhận xóa */}
            {showModal && selectedMenu && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                        <h2 className="text-lg font-bold mb-4">
                            Bạn có chắc muốn xóa menu{" "}
                            <span className="text-red-600">{selectedMenu.name}</span>?
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
