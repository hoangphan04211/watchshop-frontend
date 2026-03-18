"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMenuById } from "@/api/apiMenu";

export default function MenuShow() {
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

    if (!menu) return <p className="p-6">Đang tải...</p>;

    return (
        <div className="p-6 bg-white rounded-xl shadow max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Chi tiết Menu</h1>
            <div className="space-y-2 text-gray-700">
                <p><strong>ID:</strong> {menu.id}</p>
                <p><strong>Tên:</strong> {menu.name}</p>
                <p><strong>Link:</strong> {menu.link}</p>
                <p><strong>Loại:</strong> {menu.type}</p>
                <p><strong>Thứ tự:</strong> {menu.sort_order}</p>
                <p><strong>Trạng thái:</strong> {menu.status === 1 ? "Hiển thị" : "Ẩn"}</p>
            </div>
            <button
                onClick={() => router.push("/admin/menus")}
                className="mt-6 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
            >
                Quay lại
            </button>
        </div>
    );
}
