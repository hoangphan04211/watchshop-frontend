"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getContactById, updateContact } from "@/api/apiContact";
import { toast } from "react-toastify";

export default function ContactEdit() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        content: "",
        status: 1,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchContact() {
            try {
                const data = await getContactById(id);
                setForm({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    content: data.content || "",
                    status: data.status || 1,
                });
            } catch (error) {
                toast.error("Không tải được thông tin liên hệ");
            } finally {
                setLoading(false);
            }
        }
        fetchContact();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateContact(id, form);
            toast.success("Cập nhật liên hệ thành công");
            router.push("/admin/contact");
        } catch (error) {
            toast.error("Cập nhật thất bại");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl mt-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Cập nhật liên hệ #{id}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Họ và tên</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Số điện thoại</label>
                    <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Nội dung</label>
                    <textarea
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        rows={5}
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Trạng thái</label>
                    <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: parseInt(e.target.value) })}
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                        <option value={1}>Mới</option>
                        <option value={0}>Đã hủy</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={() => router.push("/admin/contacts")}
                        className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className={`px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 ${saving ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </div>
            </form>
        </div>
    );
}
