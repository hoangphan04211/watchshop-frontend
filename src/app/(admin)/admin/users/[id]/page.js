"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserById } from "@/api/apiUser";
import { toast } from "react-toastify";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function UserDetail() {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getUserById(id);
                setUser(data);
            } catch (error) {
                toast.error("Không thể tải thông tin người dùng");
            }
        }
        fetchData();
    }, [id]);

    if (!user) return <p className="p-6">Đang tải dữ liệu...</p>;

    return (
        <div className="p-6 bg-white shadow rounded-xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Chi tiết người dùng</h1>
                <Link
                    href="/admin/users"
                    className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Quay lại
                </Link>
            </div>

            <div className="space-y-4">
                <p>
                    <span className="font-semibold text-gray-700">ID:</span> #{user.id}
                </p>
                <p>
                    <span className="font-semibold text-gray-700">Tên:</span> {user.name}
                </p>
                <p>
                    <span className="font-semibold text-gray-700">Email:</span> {user.email}
                </p>
                <p>
                    <span className="font-semibold text-gray-700">Số điện thoại:</span> {user.phone}
                </p>
                <p>
                    <span className="font-semibold text-gray-700">Tên đăng nhập:</span> {user.username}
                </p>
                <p>
                    <span className="font-semibold text-gray-700">Vai trò:</span>{" "}
                    {user.roles === "admin" ? "Quản trị" : "Khách hàng"}
                </p>
                <p>
                    <span className="font-semibold text-gray-700">Trạng thái:</span>{" "}
                    {user.status === 1 ? "Hoạt động" : "Ẩn"}
                </p>
            </div>
        </div>
    );
}
