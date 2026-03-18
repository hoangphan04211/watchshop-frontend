"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEye, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { getContacts, deleteContact } from "@/api/apiContact";
import { toast } from "react-toastify";

export default function ContactList() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    async function fetchData() {
        try {
            const data = await getContacts();
            // Nếu API trả về dạng pagination
            setContacts(data.data || data);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách liên hệ");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const confirmDelete = (contact) => {
        setSelectedContact(contact);
        setShowModal(true);
    };

    const handleDelete = async () => {
        try {
            await deleteContact(selectedContact.id);
            toast.success(`Đã xóa liên hệ #${selectedContact.id}`);
            fetchData();
        } catch (error) {
            toast.error("Không thể xóa liên hệ");
        } finally {
            setShowModal(false);
            setSelectedContact(null);
        }
    };

    if (loading) return <p className="p-6">Đang tải liên hệ...</p>;

    return (
        <div className="p-6 bg-white shadow rounded-xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý liên hệ</h1>
                <div className="space-x-3">
                    <Link
                        href="/admin/contacts/create"
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
                            <th className="px-4 py-3">Tên</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Số điện thoại</th>
                            <th className="px-4 py-3">Trạng thái</th>
                            <th className="px-4 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.length > 0 ? (
                            contacts.map((contact) => (
                                <tr key={contact.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-800">#{contact.id}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{contact.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{contact.email}</td>
                                    <td className="px-4 py-3 text-gray-600">{contact.phone}</td>
                                    <td className="px-4 py-3">
                                        {contact.status === 0 ? (
                                            <span className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">
                                                Đã hủy
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full">
                                                Mới
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center space-x-3">
                                        {/* Xem chi tiết */}
                                        <Link href={`/admin/contacts/${contact.id}`}>
                                            <button className="text-blue-500 hover:text-blue-700">
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                        </Link>

                                        {/* Sửa */}
                                        <Link href={`/admin/contacts/${contact.id}/edit`}>
                                            <button className="text-yellow-500 hover:text-yellow-700">
                                                <FontAwesomeIcon icon={faPenToSquare} />
                                            </button>
                                        </Link>

                                        {/* Xóa */}
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => confirmDelete(contact)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">
                                    Không có liên hệ nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal xác nhận xóa */}
            {showModal && selectedContact && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">
                            Bạn có chắc muốn xóa liên hệ{" "}
                            <span className="text-red-600">#{selectedContact.id}</span>?
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
