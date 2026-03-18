"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getProductSaleById as getSaleById } from "@/api/apiSale";
import { IMAGE_URL } from "@/api/config";
import Image from "next/image";

export default function SaleDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [sale, setSale] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getSaleById(id);
                if (!data) {
                    toast.error("Không tìm thấy chương trình giảm giá");
                    router.push("/admin/sales");
                } else {
                    setSale(data);
                }
            } catch (error) {
                toast.error("Không thể tải dữ liệu khuyến mãi");
                router.push("/admin/sales");
            }
        }
        if (id) fetchData();
    }, [id, router]);

    if (!sale) {
        return <p className="p-6 text-center text-gray-500">Đang tải dữ liệu...</p>;
    }

    const { sale: info, products } = sale;

    return (
        <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-xl space-y-10">
            {/* 🔹 Header */}
            <div className="flex justify-between items-center border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">
                    {info.name}
                </h1>
                <button
                    onClick={() => router.push(`/admin/sales/${id}/edit`)}
                    className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition"
                >
                    Sửa khuyến mãi
                </button>
            </div>

            {/* 🔹 Thông tin chương trình */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
                <div className="space-y-3">
                    <p>
                        <span className="font-semibold">Tên chương trình:</span>{" "}
                        {info.name}
                    </p>
                    <p>
                        <span className="font-semibold">Giá giảm:</span>{" "}
                        <span className="text-green-600 font-semibold">
                            {info.price_sale?.toLocaleString()} VND
                        </span>
                    </p>
                    <p>
                        <span className="font-semibold">Ngày bắt đầu:</span>{" "}
                        {info.date_begin ? new Date(info.date_begin).toLocaleDateString() : "—"}
                    </p>
                    <p>
                        <span className="font-semibold">Ngày kết thúc:</span>{" "}
                        {info.date_end ? new Date(info.date_end).toLocaleDateString() : "—"}
                    </p>
                </div>

                <div className="space-y-3">
                    <p>
                        <span className="font-semibold">Trạng thái:</span>{" "}
                        <span
                            className={`inline-block px-3 py-1 text-sm rounded-full ${info.status === 1
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {info.status === 1 ? "Đang hoạt động" : "Ngưng áp dụng"}
                        </span>
                    </p>
                    <p>
                        <span className="font-semibold">Số sản phẩm trong chương trình:</span>{" "}
                        {products?.length || 0}
                    </p>
                </div>
            </div>

            {/* 🔹 Danh sách sản phẩm thuộc khuyến mãi */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Sản phẩm áp dụng</h2>
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {products.map((item) => (
                            <div
                                key={item.id}
                                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-gray-50"
                            >
                                <div className="relative w-full h-56">
                                    {item.image ? (
                                        <Image
                                            src={`${IMAGE_URL}/products/${item.image}`}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            Không có ảnh
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Giá gốc:{" "}
                                        <span className="font-semibold text-pink-600">
                                            {item.price?.toLocaleString()} VND
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Giá khuyến mãi:{" "}
                                        <span className="font-semibold text-green-600">
                                            {item.price_sale?.toLocaleString()} VND
                                        </span>
                                    </p>

                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Chưa có sản phẩm nào trong chương trình này</p>
                )}
            </div>
        </div>
    );
}
