"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { createPost } from "@/api/apiPost";

export default function CreatePost() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        slug: "",
        topic_id: "",
        image: null,
        content: "",
        description: "",
        post_type: "post",
        status: 1,
    });

    // Xử lý input text, select
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Nếu trường là "title", tự động cập nhật slug
        if (name === "title") {
            setForm((prevForm) => ({
                ...prevForm,
                title: value,
                slug: generateSlug(value), // Tự động tạo slug từ tiêu đề
            }));
        } else {
            setForm((prevForm) => ({
                ...prevForm,
                [name]: value,
            }));
        }
    };

    // Hàm để tạo slug từ tiêu đề
    const generateSlug = (title) => {
        // Chuyển thành chữ thường và thay thế khoảng trắng thành dấu "-"
        return title
            .toLowerCase()
            .replace(/[àáạảãàâấầẫậăắằẳẵặ]/g, 'a')
            .replace(/[èéẹẻẽêếềễệ]/g, 'e')
            .replace(/[ìíịỉĩ]/g, 'i')
            .replace(/[òóọỏõôốồỗộơớờởỡợ]/g, 'o')
            .replace(/[ùúụủũưứừữự]/g, 'u')
            .replace(/[ỳýỵỷỹ]/g, 'y')
            .replace(/[^a-z0-9]/g, '-') // Thay thế tất cả ký tự không phải chữ cái và số bằng dấu "-".
            .replace(/-+/g, '-') // Thay thế nhiều dấu "-" liên tiếp bằng 1 dấu "-".
            .replace(/^-|-$/g, ''); // Loại bỏ dấu "-" ở đầu và cuối chuỗi.
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
            formData.append("title", form.title);
            formData.append("slug", form.slug);
            formData.append("topic_id", form.topic_id || "");
            formData.append("content", form.content || "");
            formData.append("description", form.description || "");
            formData.append("post_type", form.post_type);
            formData.append("status", form.status);
            form.image && formData.append("image", form.image);

            await createPost(formData);
            toast.success("Thêm bài viết thành công");
            router.push("/admin/posts");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi thêm bài viết");
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md text-black">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Thêm Bài Viết</h1>
                <Link
                    href="/admin/posts"
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
                {/* Tiêu đề */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Tiêu đề</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Nhập tiêu đề bài viết"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                {/* Slug */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Slug</label>
                    <input
                        name="slug"
                        value={form.slug}
                        onChange={handleChange}
                        placeholder="slug-bai-viet"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                {/* Topic ID */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Topic ID</label>
                    <input
                        name="topic_id"
                        value={form.topic_id}
                        onChange={handleChange}
                        type="number"
                        placeholder="Nhập ID chủ đề"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Hình ảnh */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">
                        Hình ảnh bài viết
                    </label>
                    <input
                        type="file"
                        name="image"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleFileChange}
                    />
                </div>

                {/* Nội dung */}
                <div className="flex flex-col col-span-2">
                    <label className="text-lg font-medium text-gray-700">Nội dung</label>
                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        placeholder="Nhập nội dung bài viết..."
                        rows={6}
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Mô tả */}
                <div className="flex flex-col col-span-2">
                    <label className="text-lg font-medium text-gray-700">Mô tả</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Mô tả ngắn"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Loại bài viết */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Loại</label>
                    <select
                        name="post_type"
                        value={form.post_type}
                        onChange={handleChange}
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="post">Post</option>
                        <option value="page">Page</option>
                    </select>
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
                        Lưu Bài Viết
                    </button>
                </div>
            </form>
        </div>
    );
}
