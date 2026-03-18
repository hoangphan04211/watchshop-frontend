"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getCategoryById } from "@/api/apiCategory";
import { IMAGE_URL } from "@/api/config";
import Image from "next/image";

export default function CategoryDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [category, setCategory] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const cat = await getCategoryById(id);
                if (!cat) {
                    toast.error("Không tìm thấy danh mục");
                    router.push("/admin/categories");
                } else {
                    setCategory(cat);
                }
            } catch {
                toast.error("Không tìm thấy danh mục");
                router.push("/admin/categories");
            }
        }
        if (id) fetchData();
    }, [id, router]);

    if (!category) return <p className="p-6 text-center text-gray-500">Đang tải...</p>;

    return (
        <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Thông tin danh mục */}
                <div className="space-y-5">
                    <h1 className="text-3xl font-bold text-gray-800">{category.name}</h1>

                    <div className="space-y-2 text-base text-gray-700">
                        <p>
                            <span className="font-semibold text-gray-600">Slug:</span> {category.slug}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-600">Parent ID:</span>{" "}
                            {category.parent_id ?? "—"}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-600">Trạng thái:</span>{" "}
                            <span
                                className={`inline-block px-3 py-1 text-sm rounded-full ${category.status === 1
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {category.status === 1 ? "Hiển thị" : "Ẩn"}
                            </span>
                        </p>
                    </div>

                    {/* Nút chỉnh sửa */}
                    <button
                        onClick={() => router.push(`/admin/categories/${id}/edit`)}
                        className="mt-4 px-6 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition"
                    >
                        Sửa danh mục
                    </button>
                </div>

                {/* Ảnh danh mục */}
                <div className="flex justify-center">
                    {category.image ? (
                        <Image
                            src={`${IMAGE_URL}/categories/${category.image}`}
                            alt={category.name}
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

            {/* Mô tả danh mục */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Mô tả danh mục</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {category.description || "Không có mô tả"}
                </p>
            </div>
        </div>
    );
}
