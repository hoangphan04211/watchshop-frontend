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
    faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import {
    getTopics,
    deleteTopic,
} from "@/api/apiTopic";
import { toast } from "react-toastify";

export default function TopicList() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    // modal xóa
    const [showModal, setShowModal] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);

    // load topics
    async function fetchData() {
        try {
            const data = await getTopics();
            setTopics(data);
        } catch (error) {
            toast.error("Lỗi khi tải topics");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // mở modal xác nhận
    const confirmDelete = (topic) => {
        setSelectedTopic(topic);
        setShowModal(true);
    };

    // thực hiện xóa
    const handleDelete = async () => {
        try {
            await deleteTopic(selectedTopic.id);
            toast.success(`Đã xóa topic: ${selectedTopic.name}`);
            fetchData(); // reload lại list
        } catch (error) {
            toast.error("Không thể xóa topic");
        } finally {
            setShowModal(false);
            setSelectedTopic(null);
        }
    };

    if (loading) return <p className="p-6">Đang tải topics...</p>;

    return (
        <div className="p-6 bg-white shadow rounded-xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Topics</h1>
                <div className="space-x-3">
                    <Link
                        href="/admin/topics/trash"
                        className="px-4 py-2 bg-gray-100 rounded-lg shadow hover:bg-gray-200 text-gray-700 font-medium"
                    >
                        <FontAwesomeIcon icon={faTrashCan} className="mr-2" />
                        Thùng rác
                    </Link>
                    <Link
                        href="/admin/topics/create"
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
                            <th className="px-4 py-3">Tên topic</th>
                            <th className="px-4 py-3">Slug</th>
                            <th className="px-4 py-3">Trạng thái</th>
                            <th className="px-4 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topics.length > 0 ? (
                            topics.map((topic) => (
                                <tr key={topic.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-800">{topic.id}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">
                                        {topic.name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{topic.slug}</td>
                                    <td className="px-4 py-3">
                                        {topic.status === 1 ? (
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
                                        <Link href={`/admin/topics/${topic.id}`}>
                                            <button className="text-blue-500 hover:text-blue-700">
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                        </Link>

                                        {/* Sửa */}
                                        <Link href={`/admin/topics/${topic.id}/edit`}>
                                            <button className="text-yellow-500 hover:text-yellow-700">
                                                <FontAwesomeIcon icon={faPenToSquare} />
                                            </button>
                                        </Link>

                                        {/* Xóa */}
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => confirmDelete(topic)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500">
                                    Không có topic nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal xác nhận xóa */}
            {showModal && selectedTopic && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">
                            Bạn có chắc muốn xóa topic{" "}
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
