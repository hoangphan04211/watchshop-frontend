"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { createOrder } from "@/api/apiOrder";

export default function CreateOrder() {
    const router = useRouter();
    const [form, setForm] = useState({
        user_id: 1,
        name: "",
        email: "",
        phone: "",
        address: "",
        note: "",
        status: 1, // mặc định: Mới
    });

    // Xử lý input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createOrder(form);
            toast.success("Thêm đơn hàng thành công");
            router.push("/admin/orders");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi thêm đơn hàng");
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md text-black">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Thêm đơn hàng</h1>
                <Link
                    href="/admin/orders"
                    className="px-5 py-3 bg-gray-200 rounded-lg shadow-md text-gray-700 font-medium hover:bg-gray-300 transition"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Quay lại
                </Link>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
                {/* Tên khách hàng */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Tên khách hàng</label>
                    <input
                        name="name"
                        placeholder="Tên khách hàng"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Điện thoại */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Số điện thoại</label>
                    <input
                        name="phone"
                        placeholder="Số điện thoại"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Địa chỉ */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Địa chỉ</label>
                    <input
                        name="address"
                        placeholder="Địa chỉ"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Ghi chú */}
                <div className="flex flex-col col-span-2">
                    <label className="text-lg font-medium text-gray-700">Ghi chú</label>
                    <textarea
                        name="note"
                        placeholder="Ghi chú đơn hàng"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleChange}
                    />
                </div>

                {/* Trạng thái */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Trạng thái</label>
                    <select
                        name="status"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleChange}
                        value={form.status}
                    >
                        <option value={1}>Mới</option>
                        <option value={2}>Đang giao</option>
                        <option value={3}>Hoàn tất</option>
                        <option value={0}>Hủy</option>
                    </select>
                </div>

                {/* Nút lưu */}
                <div className="col-span-2">
                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                    >
                        Lưu đơn hàng
                    </button>
                </div>
            </form>
        </div>
    );
}
