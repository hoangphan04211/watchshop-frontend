"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faRotateLeft,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { getTrashTopics, restoreTopic, forceDeleteTopic } from "@/api/apiTopic";
import { toast } from "react-toastify";

export default function TopicTrash() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal confirm
    const [showModal, setShowModal] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);

    // Load trash topics
    async function fetchData() {
        try {
            const data = await getTrashTopics();
            setTopics(data);
        } catch (error) {
            toast.error("Không tải được danh sách thùng rác");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // Xác nhận xóa vĩnh viễn
    const confirmDelete = (topic) => {
        setSelectedTopic(topic);
        setShowModal(true);
    };

    // Xóa vĩnh viễn
    const handleForceDelete = async () => {
        try {
            await forceDeleteTopic(selectedTopic.id);
            toast.success(`Đã xóa vĩnh viễn: ${selectedTopic.name}`);
            fetchData();
        } catch (error) {
            toast.error("Không thể xóa vĩnh viễn");
        } finally {
            setShowModal(false);
            setSelectedTopic(null);
        }
    };

    // Khôi phục
    const handleRestore = async (id) => {
        try {
            await restoreTopic(id);
            toast.success("Khôi phục thành công");
            fetchData();
        } catch (error) {
            toast.error("Không thể khôi phục");
        }
    };

    if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;

    return (
        <div className="p-6 bg-white shadow rounded-xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Thùng rác Topics</h1>
                <Link
                    href="/admin/topics"
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
                            <th className="px-4 py-3">Tên Topic</th>
                            <th className="px-4 py-3">Slug</th>
                            <th className="px-4 py-3">Trạng thái</th>
                            <th className="px-4 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topics.length > 0 ? (
                            topics.map((topic) => (
                                <tr key={topic.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3">{topic.id}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">
                                        {topic.name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{topic.slug}</td>
                                    <td className="px-4 py-3">
                                        {topic.status === 1 ? (
                                            <span className="text-green-600 font-semibold">
                                                Hiển thị
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">Ẩn</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center space-x-3">
                                        <button
                                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                                            onClick={() => handleRestore(topic.id)}
                                        >
                                            <FontAwesomeIcon icon={faRotateLeft} /> Khôi phục
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                            onClick={() => confirmDelete(topic)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} /> Xóa vĩnh viễn
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center py-6 text-gray-500 italic"
                                >
                                    Không có topic nào trong thùng rác
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal confirm */}
            {showModal && selectedTopic && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">
                            Bạn có chắc muốn <span className="text-red-600">xóa vĩnh viễn</span>{" "}
                            topic{" "}
                            <span className="text-red-600">{selectedTopic.name}</span>?
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
                                onClick={handleForceDelete}
                            >
                                Xóa vĩnh viễn
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
