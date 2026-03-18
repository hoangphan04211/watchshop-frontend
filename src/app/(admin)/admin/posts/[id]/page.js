"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getPostById } from "@/api/apiPost";
import { IMAGE_URL } from "@/api/config";
import Image from "next/image";

export default function PostDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [post, setPost] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getPostById(id);
                if (!data) {
                    toast.error("Không tìm thấy bài viết");
                    router.push("/admin/posts");
                } else {
                    setPost(data);
                }
            } catch {
                toast.error("Không tìm thấy bài viết");
                router.push("/admin/posts");
            }
        }
        if (id) fetchData();
    }, [id, router]);

    if (!post) return <p className="p-6 text-center text-gray-500">Đang tải...</p>;

    return (
        <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Thông tin bài viết */}
                <div className="space-y-5">
                    <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>

                    <div className="space-y-2 text-base text-gray-700">
                        <p>
                            <span className="font-semibold text-gray-600">Slug:</span>{" "}
                            {post.slug}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-600">Loại:</span>{" "}
                            {post.post_type || "—"}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-600">Tác giả:</span>{" "}
                            {post.created_by || "—"}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-600">Trạng thái:</span>{" "}
                            <span
                                className={`inline-block px-3 py-1 text-sm rounded-full ${post.status === 1
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {post.status === 1 ? "Hiển thị" : "Ẩn"}
                            </span>
                        </p>
                        <p>
                            <span className="font-semibold text-gray-600">Ngày tạo:</span>{" "}
                            {new Date(post.created_at).toLocaleDateString("vi-VN")}
                        </p>
                    </div>

                    {/* Nút chỉnh sửa */}
                    <button
                        onClick={() => router.push(`/admin/posts/${id}/edit`)}
                        className="mt-4 px-6 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition"
                    >
                        Sửa bài viết
                    </button>
                </div>

                {/* Ảnh bài viết */}
                <div className="flex justify-center">
                    {post.image ? (
                        <Image
                            src={`${IMAGE_URL}/posts/${post.image}`}
                            alt={post.title}
                            width={400}
                            height={400}
                            className="rounded-lg object-cover shadow-md"
                        />
                    ) : (
                        <div className="w-[400px] h-[400px] bg-gray-100 flex items-center justify-center rounded-lg">
                            <span className="text-gray-400">Không có ảnh</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Nội dung bài viết */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Nội dung bài viết
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {post.content || "Không có nội dung"}
                </p>
            </div>
        </div>
    );
}
