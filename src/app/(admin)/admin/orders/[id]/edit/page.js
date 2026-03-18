"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getOrderById, updateOrder } from "@/api/apiOrder";

export default function EditOrder() {
    const { id } = useParams();
    const router = useRouter();
    const [form, setForm] = useState(null);

    // Lấy order theo id
    useEffect(() => {
        async function fetchData() {
            try {
                const order = await getOrderById(id);
                if (!order) {
                    toast.error("Không tìm thấy đơn hàng");
                    router.push("/admin/orders");
                } else {
                    setForm(order);
                }
            } catch {
                toast.error("Không tìm thấy đơn hàng");
                router.push("/admin/orders");
            }
        }
        if (id) fetchData();
    }, [id, router]);

    if (!form) return <p className="p-6">Đang tải dữ liệu...</p>;

    // Cập nhật state khi nhập liệu
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateOrder(id, form);
            toast.success("Cập nhật đơn hàng thành công");
            router.push("/admin/orders");
        } catch (error) {
            console.error("Lỗi khi cập nhật đơn hàng:", error);
            toast.error("Cập nhật đơn hàng thất bại!");
        }
    };

    return (
        <div className="p-6 bg-white shadow rounded-xl text-black">
            <h1 className="text-2xl font-bold mb-6">Chỉnh sửa đơn hàng</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tên */}
                <input
                    name="name"
                    value={form.name || ""}
                    placeholder="Tên khách hàng"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                    required
                />

                {/* Email */}
                <input
                    type="email"
                    name="email"
                    value={form.email || ""}
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                    required
                />

                {/* Điện thoại */}
                <input
                    name="phone"
                    value={form.phone || ""}
                    placeholder="Số điện thoại"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                    required
                />

                {/* Địa chỉ */}
                <input
                    name="address"
                    value={form.address || ""}
                    placeholder="Địa chỉ"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                    required
                />

                {/* Ghi chú */}
                <textarea
                    name="note"
                    value={form.note || ""}
                    placeholder="Ghi chú"
                    className="w-full p-2 border rounded"
                    rows={3}
                    onChange={handleChange}
                />

                {/* Trạng thái */}
                <select
                    name="status"
                    value={form.status}
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                >
                    <option value={1}>Mới</option>
                    <option value={2}>Đang giao</option>
                    <option value={3}>Hoàn tất</option>
                    <option value={0}>Hủy</option>
                </select>

                {/* Nút hành động */}
                <div className="flex space-x-3">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                    >
                        Lưu thay đổi
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/admin/orders")}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}
