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
    getProductStoresTrash as getTrashStores,
    restoreProductStore as restoreStore,
    forceDeleteProductStore as forceDeleteStore,
} from "@/api/apiProductStore";
import { toast } from "react-toastify";

export default function StoresTrash() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);

    // --- Lấy danh sách tồn kho trong thùng rác ---
    async function fetchData() {
        setLoading(true);
        try {
            const res = await getTrashStores();
            setStores(res.items || []); // Lấy đúng mảng items từ API
        } catch (error) {
            toast.error("Không thể tải thùng rác tồn kho");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // --- Khôi phục ---
    const handleRestore = async (id) => {
        try {
            await restoreStore(id);
            toast.success("Đã khôi phục bản ghi tồn kho!");
            fetchData();
        } catch {
            toast.error("Không thể khôi phục tồn kho");
        }
    };

    // --- Mở modal xác nhận xóa ---
    const handleForceDelete = (store) => {
        setSelectedStore(store);
        setShowModal(true);
    };

    // --- Xóa vĩnh viễn ---
    const handleDelete = async () => {
        if (selectedStore) {
            try {
                await forceDeleteStore(selectedStore.id);
                toast.success("Đã xóa vĩnh viễn bản ghi tồn kho!");
                fetchData();
            } catch {
                toast.error("Không thể xóa vĩnh viễn tồn kho");
            } finally {
                setShowModal(false);
                setSelectedStore(null);
            }
        }
    };

    if (loading) return <p className="p-6">Đang tải thùng rác tồn kho...</p>;

    return (
        <div className="p-6 bg-white shadow rounded-xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Thùng rác tồn kho</h1>
                <Link
                    href="/admin/store"
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
                            <th className="px-4 py-3">Tên sản phẩm</th>
                            <th className="px-4 py-3">Số lượng</th>
                            <th className="px-4 py-3">Giá gốc</th>
                            <th className="px-4 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.length > 0 ? (
                            stores.map((st) => (
                                <tr key={st.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3">{st.id}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">
                                        {st.product?.name || "Không có dữ liệu"}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{st.qty}</td>
                                    <td className="px-4 py-3 text-pink-600 font-semibold">
                                        {Number(st.price_root)?.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-center space-x-3">
                                        <button
                                            onClick={() => handleRestore(st.id)}
                                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                                        >
                                            <FontAwesomeIcon icon={faArrowRotateLeft} className="mr-1" />
                                            Khôi phục
                                        </button>
                                        <button
                                            onClick={() => handleForceDelete(st)}
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
            {showModal && selectedStore && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">
                            Bạn có chắc muốn xóa vĩnh viễn tồn kho ID{" "}
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
