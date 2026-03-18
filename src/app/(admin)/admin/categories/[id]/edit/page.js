"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { getCategoryById, updateCategory, getCategories } from "@/api/apiCategory";
import { IMAGE_URL } from "@/api/config";

// Hàm tạo slug tiếng Việt
function toSlug(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export default function EditCategory() {
    const { id } = useParams();
    const router = useRouter();
    const [form, setForm] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [categories, setCategories] = useState([]);

    // lấy category theo id
    useEffect(() => {
        async function fetchData() {
            try {
                const cat = await getCategoryById(id);
                if (!cat) {
                    toast.error("Không tìm thấy danh mục");
                    router.push("/admin/categories");
                } else {
                    setForm(cat);
                }
            } catch {
                toast.error("Không tìm thấy danh mục");
                router.push("/admin/categories");
            }
        }
        if (id) fetchData();
    }, [id, router]);

    // lấy danh sách category (cho chọn parent_id)
    useEffect(() => {
        async function fetchCats() {
            try {
                const cats = await getCategories();
                setCategories(cats);
            } catch {
                toast.error("Không tải được danh mục");
            }
        }
        fetchCats();
    }, []);

    if (!form) return <p className="p-6">Đang tải dữ liệu...</p>;

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updated = { ...form, [name]: value };
        if (name === "name") {
            updated.slug = toSlug(value);
        }
        setForm(updated);
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("slug", form.slug);
        formData.append("parent_id", form.parent_id || 0);
        formData.append("description", form.description ?? "");
        formData.append("status", form.status === "1" || form.status === 1 ? 1 : 0);
        if (newImage) formData.append("image", newImage);

        try {
            await updateCategory(id, formData);
            toast.success("Cập nhật danh mục thành công");
            router.push("/admin/categories");
        } catch (error) {
            console.error("Lỗi khi cập nhật danh mục:", error);
            toast.error("Cập nhật danh mục thất bại!");
        }
    };

    return (
        <div className="p-6 bg-white shadow rounded-xl text-black">
            <h1 className="text-2xl font-bold mb-6">Chỉnh sửa danh mục</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tên danh mục */}
                <input
                    name="name"
                    value={form.name || ""}
                    placeholder="Tên danh mục"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                    required
                />

                {/* Slug */}
                <input
                    name="slug"
                    value={form.slug || ""}
                    placeholder="Slug"
                    className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                    readOnly
                />

                {/* Danh mục cha */}
                <select
                    name="parent_id"
                    value={form.parent_id || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="">-- Không có --</option>
                    {categories
                        .filter((c) => c.id !== form.id) // tránh chọn chính nó
                        .map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                </select>

                {/* Ảnh */}
                <div>
                    {form.image && (
                        <Image
                            src={`${IMAGE_URL}/categories/${form.image}`}
                            alt={form.name}
                            width={120}
                            height={120}
                            className="rounded mb-2"
                        />
                    )}
                    <input
                        type="file"
                        name="image"
                        className="w-full p-2 border rounded"
                        onChange={handleImageChange}
                    />
                </div>

                {/* Mô tả */}
                <textarea
                    name="description"
                    value={form.description || ""}
                    placeholder="Mô tả"
                    className="w-full p-2 border rounded"
                    rows={4}
                    onChange={handleChange}
                />

                {/* Trạng thái */}
                <select
                    name="status"
                    value={form.status}
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                >
                    <option value={1}>Hiển thị</option>
                    <option value={0}>Ẩn</option>
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
                        onClick={() => router.push("/admin/categories")}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}
