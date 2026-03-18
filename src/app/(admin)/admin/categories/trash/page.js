"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRotateLeft,
    faTrashCan,
    faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { IMAGE_URL } from "@/api/config";
import {
    getTrashCategories,
    restoreCategory,
    forceDeleteCategory,
} from "@/api/apiCategory";

export default function CategoriesTrash() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    async function fetchData() {
        try {
            const res = await getTrashCategories();
            setCategories(res || []);
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
            await restoreCategory(id);
            fetchData();
        } catch (error) {
            // toast đã xử lý trong api
        }
    };

    const handleForceDelete = (category) => {
        setSelectedCategory(category);
        setShowModal(true); // Hiển thị modal xác nhận
    };

    const handleDelete = async () => {
        if (selectedCategory) {
            try {
                await forceDeleteCategory(selectedCategory.id);
                fetchData();
            } catch (error) {
                // toast đã xử lý trong api
            } finally {
                setShowModal(false);
                setSelectedCategory(null);
            }
        }
    };

    if (loading) return <p className="p-6">Đang tải thùng rác...</p>;

    return (
        <div className="p-6 bg-white shadow rounded-xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Thùng rác danh mục</h1>
                <Link
                    href="/admin/categories"
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
                            <th className="px-4 py-3">Ảnh</th>
                            <th className="px-4 py-3">Tên danh mục</th>
                            <th className="px-4 py-3">Slug</th>
                            <th className="px-4 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            categories.map((c) => (
                                <tr key={c.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3">{c.id}</td>
                                    <td className="px-4 py-3">
                                        {c.image ? (
                                            <Image
                                                src={`${IMAGE_URL}/categories/${c.image}`}
                                                alt={c.name}
                                                width={60}
                                                height={60}
                                                className="w-20 h-15 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-20 h-15 flex items-center justify-center bg-gray-100 rounded">
                                                <span className="text-gray-400 text-sm">No Img</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-800">
                                        {c.name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{c.slug}</td>
                                    <td className="px-4 py-3 text-center space-x-3">
                                        <button
                                            onClick={() => handleRestore(c.id)}
                                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                                        >
                                            <FontAwesomeIcon icon={faArrowRotateLeft} className="mr-1" />
                                            Khôi phục
                                        </button>
                                        <button
                                            onClick={() => handleForceDelete(c)}
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
                                <td colSpan="5" className="text-center py-6 text-gray-500">
                                    Thùng rác trống
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal xác nhận xóa */}
            {showModal && selectedCategory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">
                            Bạn có chắc muốn xóa vĩnh viễn danh mục{" "}
                            <span className="text-red-600">{selectedCategory.name}</span>?
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
