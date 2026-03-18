"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { IMAGE_URL } from "@/api/config";
import { getPostById, updatePost } from "@/api/apiPost";

export default function EditPost() {
    const { id } = useParams();
    const router = useRouter();
    const [form, setForm] = useState(null);
    const [newImage, setNewImage] = useState(null);

    // Lấy dữ liệu bài viết
    useEffect(() => {
        async function fetchData() {
            try {
                const post = await getPostById(id);
                if (!post) {
                    toast.error("Không tìm thấy bài viết");
                    router.push("/admin/posts");
                } else {
                    setForm(post);
                }
            } catch {
                toast.error("Không tìm thấy bài viết");
                router.push("/admin/posts");
            }
        }
        if (id) fetchData();
    }, [id, router]);

    if (!form) return <p className="p-6">Đang tải dữ liệu...</p>;

    // Chuyển tiếng Việt -> slug
    const generateSlug = (str) =>
        str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "title") {
            setForm({
                ...form,
                title: value,
                slug: generateSlug(value),
            });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("slug", form.slug);
        formData.append("topic_id", form.topic_id ?? "");
        formData.append("content", form.content ?? "");
        formData.append("description", form.description ?? "");
        formData.append("post_type", form.post_type ?? "post");
        formData.append(
            "status",
            form.status === "1" || form.status === 1 ? 1 : 0
        );
        if (newImage) formData.append("image", newImage);

        try {
            await updatePost(id, formData);
            toast.success("Cập nhật bài viết thành công");
            router.push("/admin/posts");
        } catch (error) {
            console.error("Lỗi khi cập nhật post:", error);
            toast.error("Cập nhật bài viết thất bại!");
        }
    };

    return (
        <div className="p-6 bg-white shadow rounded-xl text-black">
            <h1 className="text-2xl font-bold mb-6">Chỉnh sửa Bài Viết</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tiêu đề */}
                <input
                    name="title"
                    value={form.title || ""}
                    placeholder="Tiêu đề"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                    required
                />

                {/* Slug - chỉ đọc */}
                <input
                    name="slug"
                    value={form.slug || ""}
                    placeholder="Slug"
                    className="w-full p-2 border rounded bg-gray-100 text-gray-600"
                    readOnly
                />

                {/* Topic ID */}
                <input
                    type="number"
                    name="topic_id"
                    value={form.topic_id || ""}
                    placeholder="Topic ID"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                />

                {/* Ảnh */}
                <div>
                    {form.image && (
                        <Image
                            src={`${IMAGE_URL}/posts/${form.image}`}
                            alt={form.title}
                            width={200}
                            height={100}
                            className="rounded mb-2 object-contain"
                        />
                    )}
                    <input
                        type="file"
                        name="image"
                        className="w-full p-2 border rounded"
                        onChange={handleImageChange}
                    />
                </div>

                {/* Nội dung */}
                <textarea
                    name="content"
                    value={form.content || ""}
                    placeholder="Nội dung bài viết"
                    className="w-full p-2 border rounded"
                    rows={6}
                    onChange={handleChange}
                />

                {/* Mô tả */}
                <textarea
                    name="description"
                    value={form.description || ""}
                    placeholder="Mô tả ngắn"
                    className="w-full p-2 border rounded"
                    rows={3}
                    onChange={handleChange}
                />

                {/* Loại */}
                <select
                    name="post_type"
                    value={form.post_type || "post"}
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                >
                    <option value="post">Post</option>
                    <option value="page">Page</option>
                </select>

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
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Lưu thay đổi
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/admin/posts")}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}
