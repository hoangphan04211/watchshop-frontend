"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import slugify from "slugify";
import { getCategories, createCategory } from "@/api/apiCategory";

export default function CreateCategory() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name: "",
        slug: "",
        parent_id: "",
        image: null,
        status: 1,
        description: "",
    });

    // Lấy danh sách category để chọn danh mục cha
    useEffect(() => {
        const fetchData = async () => {
            try {
                const cats = await getCategories();
                setCategories(cats);
            } catch (error) {
                toast.error("Không tải được danh mục");
            }
        };
        fetchData();
    }, []);

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
            formData.append("slug", form.slug);
            form.parent_id && formData.append("parent_id", parseInt(form.parent_id, 10));
            formData.append("status", form.status);
            form.image && formData.append("image", form.image);
            formData.append("description", form.description || "");

            await createCategory(formData);
            toast.success("Thêm danh mục thành công");
            router.push("/admin/categories");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi thêm danh mục");
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md text-black">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Thêm danh mục</h1>
                <Link
                    href="/admin/categories"
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
                {/* Tên danh mục */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Tên danh mục</label>
                    <input
                        name="name"
                        placeholder="Tên danh mục"
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

                {/* Danh mục cha */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Danh mục cha</label>
                    <select
                        name="parent_id"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleChange}
                    >
                        <option value="">-- Không có --</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Hình ảnh */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Hình ảnh danh mục</label>
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
                        placeholder="Mô tả danh mục"
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
                        Lưu danh mục
                    </button>
                </div>
            </form>
        </div>
    );
}
