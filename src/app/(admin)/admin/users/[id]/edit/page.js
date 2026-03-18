"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getUserById, updateUser } from "@/api/apiUser";
import { toast } from "react-toastify";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function UserEdit() {
    const router = useRouter();
    const { id } = useParams();
    const [form, setForm] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getUserById(id);
                setForm(data);
            } catch (error) {
                toast.error("Không thể tải thông tin người dùng");
            }
        }
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(id, form);
            toast.success("Cập nhật người dùng thành công");
            router.push("/admin/users");
        } catch (error) {
            toast.error("Không thể cập nhật người dùng");
        }
    };

    if (!form) return <p className="p-6">Đang tải dữ liệu...</p>;

    return (
        <div className="p-6 bg-white shadow rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa người dùng</h1>
                <Link
                    href="/admin/users"
                    className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Quay lại
                </Link>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-gray-700">Tên</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 mt-1"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 mt-1"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Số điện thoại</label>
                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 mt-1"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Tên đăng nhập</label>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 mt-1"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Vai trò</label>
                    <select
                        name="roles"
                        value={form.roles}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 mt-1"
                    >
                        <option value="customer">Khách hàng</option>
                        <option value="admin">Quản trị</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700">Trạng thái</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 mt-1"
                    >
                        <option value="1">Hoạt động</option>
                        <option value="0">Ẩn</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="px-6 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700"
                >
                    Cập nhật
                </button>
            </form>
        </div>
    );
}
