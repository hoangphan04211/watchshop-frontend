"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { createBanner } from "@/api/apiBanner";

export default function CreateBanner() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        position: "slideshow", 
        image: null,
        status: 1,
        description: "",
    });

    // Xử lý input text, select
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Xử lý upload file
    const handleFileChange = (e) => {
        setForm({ ...form, image: e.target.files[0] });
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("position", form.position);
            formData.append("status", form.status);
            form.image && formData.append("image", form.image);
            formData.append("description", form.description || "");

            await createBanner(formData);
            toast.success("Thêm banner thành công");
            router.push("/admin/banners");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi thêm banner");
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md text-black">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Thêm Banner</h1>
                <Link
                    href="/admin/banners"
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
                {/* Tên banner */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Tên banner</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Tên banner"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                {/* Vị trí hiển thị */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Vị trí</label>
                    <select
                        name="position"
                        value={form.position}
                        onChange={handleChange}
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="slideshow">Slideshow</option>
                        <option value="ads">ADS</option>
                    </select>
                </div>

                {/* Hình ảnh */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">
                        Hình ảnh banner
                    </label>
                    <input
                        type="file"
                        name="image"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleFileChange}
                    />
                </div>

                {/* Mô tả */}
                <div className="flex flex-col col-span-2">
                    <label className="text-lg font-medium text-gray-700">Mô tả</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Mô tả banner"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Trạng thái */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Trạng thái</label>
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
                        Lưu Banner
                    </button>
                </div>
            </form>
        </div>
    );
}
