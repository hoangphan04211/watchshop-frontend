"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getClientPostBySlug } from "@/api/apiPost";
import { IMAGE_URL } from "@/api/config";

export default function PostDetail() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        if (slug) {
            getClientPostBySlug(slug)
                .then((data) => setPost(data))
                .catch((err) => console.error(err));
        }

        // Cập nhật giờ Việt Nam hiện tại
        const timer = setInterval(() => {
            const vnTime = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
            setCurrentTime(vnTime);
        }, 1000);

        return () => clearInterval(timer);
    }, [slug]);

    if (!post) return <div className="text-center py-20 text-gray-500">Đang tải bài viết...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Tiêu đề */}
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">{post.title}</h1>

            {/* Metadata */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-4">
                    <span className="bg-white/70 backdrop-blur-md px-3 py-1 rounded-lg shadow text-sm text-gray-700">
                        Ngày tạo: {new Date(post.created_at).toLocaleString("vi-VN")}
                    </span>
                    {post.author && (
                        <span className="bg-white/70 backdrop-blur-md px-3 py-1 rounded-lg shadow text-sm text-gray-700">
                            Tác giả: {post.author}
                        </span>
                    )}
                </div>
                <div className="text-gray-500 text-sm">{currentTime}</div>
            </div>

            {/* Ảnh nổi bật */}
            {post.image && (
                <div className="relative w-full h-96 md:h-[500px] mb-8 rounded-xl overflow-hidden shadow-lg">
                    <Image
                        src={`${IMAGE_URL}/posts/${post.image}`}
                        alt={post.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            {/* Nội dung */}
            <div className="prose prose-lg max-w-full mx-auto text-gray-700 leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
        </div>
    );
}
