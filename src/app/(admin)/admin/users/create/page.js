"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addUser, checkUserExists } from "@/api/apiUser"; 
import { toast } from "react-toastify";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faCheckCircle,
    faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function UserCreate() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        password_confirmation: "",
        roles: "customer",
        status: 1,
    });

    const [errors, setErrors] = useState({});
    const [checking, setChecking] = useState({
        email: false,
        phone: false,
        username: false,
    });

    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "name":
                if (value.trim().length < 3)
                    error = "Tên phải có ít nhất 3 ký tự";
                break;
            case "email":
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    error = "Email không hợp lệ";
                break;
            case "phone":
                if (!/^[0-9]{9,11}$/.test(value))
                    error = "Số điện thoại phải từ 9–11 số";
                break;
            case "username":
                if (value.trim().length < 3)
                    error = "Tên đăng nhập phải có ít nhất 3 ký tự";
                break;
            case "password":
                if (value.length < 6)
                    error = "Mật khẩu phải có ít nhất 6 ký tự";
                break;
            case "password_confirmation":
                if (value !== form.password)
                    error = "Mật khẩu xác nhận không khớp";
                break;
            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    //  Kiểm tra trùng lặp với debounce 600ms
    useEffect(() => {
        const delay = setTimeout(() => {
            ["email", "phone", "username"].forEach(async (field) => {
                const value = form[field];
                if (value && !errors[field]) {
                    try {
                        setChecking((prev) => ({ ...prev, [field]: true }));

                        const res = await checkUserExists(field, value); 

                        if (res.exists) {
                            setErrors((prev) => ({
                                ...prev,
                                [field]:
                                    field === "email"
                                        ? "Email đã tồn tại"
                                        : field === "phone"
                                            ? "Số điện thoại đã tồn tại"
                                            : "Tên đăng nhập đã tồn tại",
                            }));
                        } else {
                            setErrors((prev) => ({ ...prev, [field]: "" }));
                        }
                    } catch (err) {
                        console.error("Check error:", err);
                    } finally {
                        setChecking((prev) => ({ ...prev, [field]: false }));
                    }
                }
            });
        }, 600);

        return () => clearTimeout(delay);
    }, [form.email, form.phone, form.username]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const hasError = Object.values(errors).some((msg) => msg !== "");
        if (hasError) {
            toast.error("Vui lòng sửa lỗi trước khi lưu");
            return;
        }

        try {
            await addUser(form);
            toast.success("Thêm người dùng thành công");
            router.push("/admin/users");
        } catch {
            toast.error("Không thể thêm người dùng");
        }
    };

    const renderIcon = (name) => {
        if (!form[name]) return null;
        return (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {checking[name] ? (
                    <span className="text-gray-400 text-sm">...</span>
                ) : errors[name] ? (
                    <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="text-red-500"
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500"
                    />
                )}
            </span>
        );
    };

    return (
        <div className="p-6 bg-white shadow rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Thêm người dùng mới
                </h1>
                <Link
                    href="/admin/users"
                    className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />{" "}
                    Quay lại
                </Link>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {[
                    { label: "Tên", name: "name", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                    { label: "Số điện thoại", name: "phone", type: "text" },
                    { label: "Tên đăng nhập", name: "username", type: "text" },
                    { label: "Mật khẩu", name: "password", type: "password" },
                    {
                        label: "Xác nhận mật khẩu",
                        name: "password_confirmation",
                        type: "password",
                    },
                ].map(({ label, name, type }) => (
                    <div key={name} className="relative">
                        <label className="block text-gray-700 mb-1">
                            {label}
                        </label>
                        <div className="relative">
                            <input
                                type={type}
                                name={name}
                                value={form[name]}
                                onChange={handleChange}
                                className={`w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 ${errors[name]
                                        ? "border-red-500 focus:ring-red-400"
                                        : "border-gray-300 focus:ring-pink-500"
                                    }`}
                            />
                            {renderIcon(name)}
                        </div>
                        {errors[name] && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors[name]}
                            </p>
                        )}
                    </div>
                ))}

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
                    Lưu
                </button>
            </form>
        </div>
    );
}
