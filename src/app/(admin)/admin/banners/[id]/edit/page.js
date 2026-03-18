"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { getBannerById, updateBanner } from "@/api/apiBanner";
import { IMAGE_URL } from "@/api/config";

export default function EditBanner() {
    const { id } = useParams();
    const router = useRouter();
    const [form, setForm] = useState(null);
    const [newImage, setNewImage] = useState(null);

    // Lấy dữ liệu banner
    useEffect(() => {
        async function fetchData() {
            try {
                const banner = await getBannerById(id);
                if (!banner) {
                    toast.error("Không tìm thấy banner");
                    router.push("/admin/banners");
                } else {
                    setForm(banner);
                }
            } catch {
                toast.error("Không tìm thấy banner");
                router.push("/admin/banners");
            }
        }
        if (id) fetchData();
    }, [id, router]);

    if (!form) return <p className="p-6">Đang tải dữ liệu...</p>;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
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
        formData.append("link", form.link ?? "");
        formData.append("position", form.position);
        formData.append("sort_order", form.sort_order ?? 0);
        formData.append(
            "status",
            form.status === "1" || form.status === 1 ? 1 : 0
        );
        formData.append("description", form.description ?? "");
        if (newImage) formData.append("image", newImage);

        try {
            await updateBanner(id, formData);
            toast.success("Cập nhật banner thành công");
            router.push("/admin/banners");
        } catch (error) {
            console.error("Lỗi khi cập nhật banner:", error);
            toast.error("Cập nhật banner thất bại!");
        }
    };

    return (
        <div className="p-6 bg-white shadow rounded-xl text-black">
            <h1 className="text-2xl font-bold mb-6">Chỉnh sửa Banner</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tên banner */}
                <input
                    name="name"
                    value={form.name || ""}
                    placeholder="Tên banner"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                    required
                />

                {/* Link */}
                <input
                    name="link"
                    value={form.link || ""}
                    placeholder="Liên kết"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                />

                {/* Vị trí hiển thị */}
                <select
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="slideshow">Slideshow</option>
                    <option value="ads">ADS</option>
                </select>

                {/* Sắp xếp */}
                <input
                    type="number"
                    name="sort_order"
                    value={form.sort_order || 0}
                    placeholder="Thứ tự sắp xếp"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                />

                {/* Ảnh */}
                <div>
                    {form.image && (
                        <Image
                            src={`${IMAGE_URL}/banners/${form.image}`}
                            alt={form.name}
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
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Lưu thay đổi
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/admin/banners")}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}
