"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMenuById, updateMenu } from "@/api/apiMenu";

export default function MenuEdit() {
    const { id } = useParams();
    const router = useRouter();
    const [menu, setMenu] = useState(null);

    useEffect(() => {
        async function fetchMenu() {
            const data = await getMenuById(id);
            setMenu(data);
        }
        fetchMenu();
    }, [id]);

    const handleChange = (e) => {
        setMenu({ ...menu, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateMenu(id, menu);
        router.push("/admin/menus");
    };

    if (!menu) return <p className="p-6">Đang tải...</p>;

    return (
        <div className="p-6 bg-white rounded-xl shadow max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Cập nhật Menu</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="name"
                    value={menu.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
                <input
                    name="link"
                    value={menu.link}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
                <select
                    name="type"
                    value={menu.type}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                >
                    <option value="custom">Tùy chỉnh</option>
                    <option value="category">Danh mục</option>
                    <option value="page">Trang</option>
                    <option value="topic">Chủ đề</option>
                </select>
                <input
                    type="number"
                    name="sort_order"
                    value={menu.sort_order}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
                <select
                    name="status"
                    value={menu.status}
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
