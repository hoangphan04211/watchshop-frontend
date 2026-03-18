"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getContactById } from "@/api/apiContact";
import { toast } from "react-toastify";

export default function ContactShow() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContact() {
            try {
                const data = await getContactById(id);
                setContact(data);
            } catch (error) {
                toast.error("Không tải được thông tin liên hệ");
            } finally {
                setLoading(false);
            }
        }
        fetchContact();
    }, [id]);

    if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;
    if (!contact) return <p className="p-6 text-red-500">Liên hệ không tồn tại</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl mt-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Thông tin liên hệ #{contact.id}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h2 className="font-semibold text-gray-700 mb-2">Họ tên</h2>
                    <p className="text-gray-800">{contact.name}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h2 className="font-semibold text-gray-700 mb-2">Email</h2>
                    <p className="text-gray-800">{contact.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h2 className="font-semibold text-gray-700 mb-2">Số điện thoại</h2>
                    <p className="text-gray-800">{contact.phone}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h2 className="font-semibold text-gray-700 mb-2">Trạng thái</h2>
                    {contact.status === 1 ? (
                        <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                            Mới
                        </span>
                    ) : (
                        <span className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">
                            Đã hủy
                        </span>
                    )}
                </div>
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h2 className="font-semibold text-gray-700 mb-2">Nội dung liên hệ</h2>
                    <p className="text-gray-800 whitespace-pre-line">{contact.content}</p>
                </div>
            </div>

            <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">
                    <p>Ngày tạo: {new Date(contact.created_at).toLocaleString()}</p>
                    <p>Cập nhật: {new Date(contact.updated_at).toLocaleString()}</p>
                </div>
                <button
                    onClick={() => router.push("/admin/contacts")}
                    className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
}
