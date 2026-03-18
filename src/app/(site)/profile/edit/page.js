'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "@/api/apiUser";
import toast from "react-hot-toast";

export default function ProfileEditPage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password_old: "",
        password_new: "",
        password_confirmation: "",
        avatar: null,
    });

    // Lấy dữ liệu profile khi load trang
    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await getProfile();
                setProfile(res.data);
                setForm(prev => ({
                    ...prev,
                    name: res.data.name,
                    email: res.data.email,
                    phone: res.data.phone,
                }));
            } catch (error) {
                console.error("Lỗi lấy profile:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) setForm({ ...form, [name]: files[0] });
        else setForm({ ...form, [name]: value });
    };

    const handleUpdate = async () => {
        try {
            const data = {
                name: form.name,
                email: form.email,
                phone: form.phone,
                password_old: form.password_old,
                password_new: form.password_new,
                password_confirmation: form.password_confirmation,
                avatar: form.avatar,
            };
            const res = await updateProfile(data);
            toast.success(res.message || "Cập nhật thành công!");
            const updated = await getProfile();
            setProfile(updated.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    if (loading) return <div className="text-white p-8">Đang tải dữ liệu...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center p-8 relative">
            <div className="absolute inset-0 bg-[url('/bg-profile.jpg')] bg-cover bg-center opacity-20 blur-sm"></div>

            <div className="relative z-10 w-full max-w-4xl rounded-3xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl p-8 mt-12">
                <h1 className="text-3xl font-semibold mb-6 text-center">Cập nhật thông tin cá nhân</h1>

                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                    <div className="relative w-40 h-40">
                        <Image
                            src={form.avatar ? URL.createObjectURL(form.avatar) : profile.avatar ? `/images/users/${profile.avatar}` : "/avatar-demo.jpg"}
                            alt="Avatar"
                            fill
                            className="rounded-full object-cover border-4 border-white/30 shadow-lg"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/10">
                        <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
                        <ul className="space-y-3 text-gray-300">
                            <li>
                                <span className="font-medium text-white">Họ tên:</span>
                                <input type="text" name="name" value={form.name} onChange={handleChange} className="ml-2 rounded px-2 py-1 text-black text-sm w-full" />
                            </li>
                            <li>
                                <span className="font-medium text-white">Email:</span>
                                <input type="email" name="email" value={form.email} onChange={handleChange} className="ml-2 rounded px-2 py-1 text-black text-sm w-full" />
                            </li>
                            <li>
                                <span className="font-medium text-white">SĐT:</span>
                                <input type="text" name="phone" value={form.phone} onChange={handleChange} className="ml-2 rounded px-2 py-1 text-black text-sm w-full" />
                            </li>
                            <li>
                                <span className="font-medium text-white">Avatar:</span>
                                <input type="file" name="avatar" onChange={handleChange} className="ml-2 text-sm" />
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/10">
                        <h2 className="text-xl font-semibold mb-4">Đổi mật khẩu</h2>
                        <ul className="space-y-3 text-gray-300">
                            <li>
                                <span className="font-medium text-white">Mật khẩu cũ:</span>
                                <input type="password" name="password_old" value={form.password_old} onChange={handleChange} className="ml-2 rounded px-2 py-1 text-black text-sm w-full" />
                            </li>
                            <li>
                                <span className="font-medium text-white">Mật khẩu mới:</span>
                                <input type="password" name="password_new" value={form.password_new} onChange={handleChange} className="ml-2 rounded px-2 py-1 text-black text-sm w-full" />
                            </li>
                            <li>
                                <span className="font-medium text-white">Xác nhận mật khẩu:</span>
                                <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} className="ml-2 rounded px-2 py-1 text-black text-sm w-full" />
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                    <button
                        onClick={handleUpdate}
                        className="px-6 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-lg transition-all duration-300 border border-white/30 shadow-lg"
                    >
                        Lưu thông tin
                    </button>
                </div>
            </div>
        </div>
    );
}
