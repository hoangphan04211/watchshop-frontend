"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMenu } from "@/api/apiMenu";

export default function MenuCreate() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        link: "",
        type: "custom",
        parent_id: 0,
        sort_order: 0,
        status: 1,
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createMenu(form);
        router.push("/admin/menus");
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Thêm Menu mới</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="name"
                    placeholder="Tên menu"
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    name="link"
                    placeholder="Link"
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                <select
                    name="type"
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                >
                    <option value="custom">Tùy chỉnh</option>
                    <option value="category">Danh mục</option>
                    <option value="page">Trang</option>
                    <option value="topic">Chủ đề</option>
                </select>

                <input
                    name="sort_order"
                    type="number"
                    placeholder="Thứ tự"
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />

                <select
                    name="status"
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                >
                    <option value={1}>Hiển thị</option>
                    <option value={0}>Ẩn</option>
                </select>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => router.push("/admin/menus")}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                    >
                        Lưu
                    </button>
                </div>
            </form>
        </div>
    );
}
