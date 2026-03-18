"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { createSetting } from "@/api/apiSetting";

export default function CreateSetting() {
    const router = useRouter();
    const [form, setForm] = useState({
        site_name: "",
        email: "",
        phone: "",
        hotline: "",
        address: "",
        status: 1,
    });

    // Xử lý input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Gửi dữ liệu
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createSetting(form);
            toast.success("Thêm cài đặt thành công");
            router.push("/admin/settings");
        } catch (error) {
            console.error(error);
            toast.error("Không thể thêm cài đặt");
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md text-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">
                    Thêm Cài Đặt Website
                </h1>
                <Link
                    href="/admin/settings"
                    className="px-5 py-3 bg-gray-200 rounded-lg shadow text-gray-700 font-medium hover:bg-gray-300 transition"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Quay lại
                </Link>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
                {/* Site name */}
                <div className="flex flex-col">
                    <label className="font-medium mb-2">Tên website</label>
                    <input
                        type="text"
                        name="site_name"
                        value={form.site_name}
                        onChange={handleChange}
                        placeholder="Nhập tên website"
                        required
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label className="font-medium mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Nhập email"
                        required
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                    <label className="font-medium mb-2">Số điện thoại</label>
                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Hotline */}
                <div className="flex flex-col">
                    <label className="font-medium mb-2">Hotline</label>
                    <input
                        type="text"
                        name="hotline"
                        value={form.hotline}
                        onChange={handleChange}
                        placeholder="Nhập hotline"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Địa chỉ */}
                <div className="flex flex-col col-span-2">
                    <label className="font-medium mb-2">Địa chỉ</label>
                    <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ..."
                        rows={3}
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                </div>

                {/* Trạng thái */}
                <div className="flex flex-col">
                    <label className="font-medium mb-2">Trạng thái</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value={1}>Hiển thị</option>
                        <option value={0}>Ẩn</option>
                    </select>
                </div>

                {/* Nút lưu */}
                <div className="col-span-2">
                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                    >
                        Lưu Cài Đặt
                    </button>
                </div>
            </form>
        </div>
    );
}
