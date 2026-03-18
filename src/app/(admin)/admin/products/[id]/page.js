"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getProductById } from "@/api/apiProduct";
import { IMAGE_URL } from "@/api/config";
import Image from "next/image";

export default function ProductDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getProductById(id);
                if (!data) {
                    toast.error("Không tìm thấy sản phẩm");
                    router.push("/admin/products");
                } else {
                    setProduct(data);
                }
            } catch {
                toast.error("Không tìm thấy sản phẩm");
                router.push("/admin/products");
            }
        }
        if (id) fetchData();
    }, [id, router]);

    if (!product) {
        return <p className="p-6 text-center text-gray-500">Đang tải...</p>;
    }

    return (
        <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-xl space-y-10">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                <button
                    onClick={() => router.push(`/admin/products/${id}/edit`)}
                    className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition"
                >
                    Sửa sản phẩm
                </button>
            </div>

            {/* Grid content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left - Thông tin chi tiết */}
                <div className="space-y-3 text-gray-700">
                    <p><span className="font-semibold">Slug:</span> {product.slug}</p>
                    <p><span className="font-semibold">Danh mục:</span> {product.category_id}</p>
                    <p>
                        <span className="font-semibold">Giá gốc:</span>{" "}
                        <span className="text-pink-600 font-semibold">
                            {product.price?.toLocaleString()} VND
                        </span>
                    </p>
                    <p>
                        <span className="font-semibold">Giá sale:</span>{" "}
                        {product.price_sale ? (
                            <span className="text-green-600 font-semibold">
                                {product.price_sale.toLocaleString()} VND
                            </span>
                        ) : "—"}
                    </p>
                    <p>
                        <span className="font-semibold">Trạng thái:</span>{" "}
                        <span
                            className={`inline-block px-3 py-1 text-sm rounded-full ${product.status === 1
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {product.status === 1 ? "Hiển thị" : "Ẩn"}
                        </span>
                    </p>
                    <p><span className="font-semibold">Người tạo:</span> {product.created_by}</p>
                    <p><span className="font-semibold">Người cập nhật:</span> {product.updated_by || "—"}</p>
                    <p><span className="font-semibold">Ngày tạo:</span> {new Date(product.created_at).toLocaleString()}</p>
                    <p><span className="font-semibold">Ngày cập nhật:</span> {new Date(product.updated_at).toLocaleString()}</p>
                </div>

                {/* Right - Ảnh chính */}
                <div className="flex h-80 justify-center">
                    {product.image ? (
                        <Image
                            src={`${IMAGE_URL}/products/${product.image}`}
                            alt={product.name}
                            width={450}
                            height={450}
                            className="rounded-lg object-cover shadow-md"
                        />
                    ) : (
                        <div className="w-[450px] h-[450px] bg-gray-100 flex items-center justify-center rounded-lg">
                            <span className="text-gray-400">Không có ảnh</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Gallery ảnh phụ */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Ảnh phụ</h2>
                {product.images && product.images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {product.images.map((img) => (
                            <div
                                key={img.id}
                                className="w-full h-40 relative rounded-lg overflow-hidden shadow"
                                title={img.title || ""}
                            >
                                <Image
                                    src={`${IMAGE_URL}/products/${img.image}`}
                                    alt={img.alt || product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Không có ảnh phụ</p>
                )}
            </div>


            {/* Thuộc tính sản phẩm */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Thuộc tính sản phẩm</h2>
                {product.attributes && product.attributes.length > 0 ? (
                    <table className="w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-gray-800 border px-3 py-2 text-left">ID</th>
                                <th className="text-gray-800 border px-3 py-2 text-left">Thuộc tính</th>
                                <th className="text-gray-800 border px-3 py-2 text-left">Giá trị</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product.attributes.map((attr) => (
                                <tr key={attr.id} className="hover:bg-gray-50">
                                    <td className="text-gray-800 border px-3 py-2">{attr.id}</td>
                                    <td className="text-gray-800 border px-3 py-2">
                                        {attr.attribute?.name || attr.attribute_id}
                                    </td>
                                    <td className="text-gray-800 border px-3 py-2">{attr.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500 italic">Không có thuộc tính</p>
                )}
            </div>


            {/* Mô tả */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Mô tả sản phẩm</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description || "Không có mô tả"}
                </p>
            </div>
        </div>
    );
}
