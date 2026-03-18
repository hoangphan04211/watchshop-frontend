"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import slugify from "slugify";
import { createTopic } from "@/api/apiTopic";

export default function CreateTopic() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        slug: "",
        status: 1,
        description: "",
    });

    // Auto slug khi nhập tên
    const handleNameChange = (e) => {
        const value = e.target.value;
        setForm({
            ...form,
            name: value,
            slug: slugify(value, { lower: true, strict: true, locale: "vi" }),
        });
    };

    // Xử lý input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: form.name,
                slug: form.slug,
                status: form.status,
                description: form.description || "",
            };

            await createTopic(payload);
            toast.success("Thêm topic thành công");
            router.push("/admin/topics");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi thêm topic");
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md text-black">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Thêm topic</h1>
                <Link
                    href="/admin/topics"
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
                {/* Tên topic */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Tên topic</label>
                    <input
                        name="name"
                        placeholder="Tên topic"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleNameChange}
                        required
                    />
                </div>

                {/* Slug */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Slug</label>
                    <input
                        name="slug"
                        placeholder="Slug"
                        className="p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                        value={form.slug}
                        readOnly
                    />
                </div>

                {/* Mô tả */}
                <div className="flex flex-col col-span-2">
                    <label className="text-lg font-medium text-gray-700">Mô tả</label>
                    <textarea
                        name="description"
                        placeholder="Mô tả topic"
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
                        Lưu topic
                    </button>
                </div>
            </form>
        </div>
    );
}
