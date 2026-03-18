
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById, updateProduct } from "@/api/apiProduct";
import { getCategories } from "@/api/apiCategory";
import { getAllAttributes } from "@/api/apiAttribute";
import { IMAGE_URL } from "@/api/config";
import { toast } from "react-toastify";
import Image from "next/image";

// Chuyển tiếng Việt → slug
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

export default function EditProduct() {
    const { id } = useParams();
    const router = useRouter();

    const [form, setForm] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [allAttributes, setAllAttributes] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [subImages, setSubImages] = useState([]);
    const [newSubImages, setNewSubImages] = useState([]);
    const [removedSubImages, setRemovedSubImages] = useState([]);

    // Load product
    useEffect(() => {
        async function fetchData() {
            try {
                const product = await getProductById(id);
                if (!product) {
                    toast.error("Không tìm thấy sản phẩm");
                    router.push("/admin/products");
                    return;
                }
                setForm(product);
                setAttributes(product.attributes || []);
                setSubImages(product.images || []);
            } catch {
                toast.error("Không tải được sản phẩm");
                router.push("/admin/products");
            }
        }
        if (id) fetchData();
    }, [id, router]);

    // Load categories
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

    // Load all attributes
    useEffect(() => {
        async function fetchAttrs() {
            try {
                const attrs = await getAllAttributes();
                setAllAttributes(attrs);
            } catch {
                toast.error("Không tải được thuộc tính");
            }
        }
        fetchAttrs();
    }, []);

    if (!form) return <p className="p-6">Đang tải dữ liệu...</p>;

    // Thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        let updated = { ...form, [name]: value };
        if (name === "name") updated.slug = toSlug(value);
        setForm(updated);
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewImage(e.target.files[0]);
        }
    };

    const handleNewSubImagesChange = (e) => {
        if (e.target.files) {
            setNewSubImages([...newSubImages, ...Array.from(e.target.files)]);
        }
    };

    const handleRemoveSubImage = (id) => {
        setSubImages(subImages.filter((img) => img.id !== id));
        setRemovedSubImages([...removedSubImages, id]);
    };

    // Attributes
    const addAttribute = () =>
        setAttributes([...attributes, { id: null, attribute_id: "", value: "" }]);

    const handleAttributeChange = (index, field, value) => {
        const updated = [...attributes];
        updated[index][field] = value;
        setAttributes(updated);
    };

    const removeAttribute = (index) => {
        const updated = [...attributes];
        updated.splice(index, 1);
        setAttributes(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("slug", form.slug);
        formData.append("price", form.price || 0);
        formData.append("price_sale", form.price_sale || 0);
        formData.append("category_id", form.category_id);
        formData.append("description", form.description ?? "");
        formData.append("status", form.status === "1" || form.status === 1 ? 1 : 0);

        if (newImage) formData.append("image", newImage);

        // Append attributes (thêm cả id)
        attributes.forEach((attr, i) => {
            if (attr.id) formData.append(`attributes[${i}][id]`, attr.id);

            // Nếu là thuộc tính mới do người dùng thêm
            if (attr.isNew && attr.name) {
                formData.append(`attributes[${i}][name]`, attr.name);
            } else {
                formData.append(`attributes[${i}][attribute_id]`, attr.attribute_id);
            }

            formData.append(`attributes[${i}][value]`, attr.value);
        });


        // Append new sub-images
        newSubImages.forEach((file) => formData.append("images[]", file));

        // Append removed sub-image IDs
        removedSubImages.forEach((id) =>
            formData.append("removed_images[]", id)
        );

        try {
            await updateProduct(id, formData);
            toast.success("Cập nhật sản phẩm thành công");
            router.push("/admin/products");
        } catch (error) {
            console.error(error);
            toast.error("Cập nhật sản phẩm thất bại!");
        }
    };

    return (
        <div className="p-6 bg-white shadow rounded-xl text-black">
            <h1 className="text-2xl font-bold mb-6">Chỉnh sửa sản phẩm</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Thông tin cơ bản */}
                <input
                    name="name"
                    value={form.name || ""}
                    placeholder="Tên sản phẩm"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                    required
                />
                <input
                    name="slug"
                    value={form.slug || ""}
                    placeholder="Slug"
                    className="w-full p-2 border rounded"
                    readOnly
                />
                <input
                    type="number"
                    name="price"
                    value={form.price || ""}
                    placeholder="Giá"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price_sale"
                    value={form.price_sale || ""}
                    placeholder="Giá khuyến mãi"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                />
                <select
                    name="category_id"
                    value={form.category_id || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* Ảnh chính */}
                {form.image && (
                    <Image
                        src={`${IMAGE_URL}/products/${form.image}`}
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

                {/* Ảnh phụ */}
                <div>
                    <h2 className="font-semibold mb-2">Ảnh phụ hiện có</h2>
                    <div className="flex gap-2 overflow-x-auto mb-2">
                        {subImages.map((img, idx) => (
                            <div key={img.id} className="relative">
                                <Image
                                    src={`${IMAGE_URL}/products/${img.image}`}
                                    alt={`Sub ${idx + 1}`}
                                    width={100}
                                    height={100}
                                    className="h-40 rounded border"
                                />
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded"
                                    onClick={() => handleRemoveSubImage(img.id)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                    <input
                        type="file"
                        multiple
                        onChange={handleNewSubImagesChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Mô tả */}
                <textarea
                    name="description"
                    value={form.description || ""}
                    placeholder="Mô tả sản phẩm"
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

                {/* Thuộc tính */}
                <div>
                    <h2 className="font-semibold mb-2">Thuộc tính sản phẩm</h2>
                    {attributes.map((attr, i) => (
                        <div key={i} className="flex gap-2 items-center mb-2">
                            <select
                                className="border p-2 rounded flex-1"
                                value={attr.attribute_id || ""}
                                onChange={(e) => {
                                    const selected = e.target.value;
                                    if (selected === "new") {
                                        handleAttributeChange(i, "attribute_id", "");
                                        handleAttributeChange(i, "isNew", true);
                                        handleAttributeChange(i, "name", "");
                                    } else {
                                        handleAttributeChange(i, "attribute_id", selected);
                                        handleAttributeChange(i, "isNew", false);
                                        handleAttributeChange(i, "name", "");
                                    }
                                }}
                                required={!attr.isNew} 
                            >

                                <option value="">-- Chọn thuộc tính --</option>
                                {allAttributes.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.name}
                                    </option>
                                ))}
                                <option value="new">+ Thêm thuộc tính mới...</option>
                            </select>
                            {attr.isNew && (
                                <input
                                    type="text"
                                    className="border p-2 rounded flex-1"
                                    placeholder="Tên thuộc tính mới"
                                    value={attr.name || ""}
                                    onChange={(e) => handleAttributeChange(i, "name", e.target.value)}
                                    required
                                />
                            )}


                            <input
                                type="text"
                                className="border p-2 rounded flex-1"
                                placeholder="Giá trị"
                                value={attr.value || ""}
                                onChange={(e) =>
                                    handleAttributeChange(i, "value", e.target.value)
                                }
                                required
                            />
                            <button
                                type="button"
                                className="px-2 bg-red-500 text-white rounded"
                                onClick={() => removeAttribute(i)}
                            >
                                Xóa
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="px-4 py-2 bg-green-600 text-white rounded"
                        onClick={addAttribute}
                    >
                        Thêm thuộc tính
                    </button>
                </div>

                <div className="flex space-x-3">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                    >
                        Lưu thay đổi
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/admin/products")}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}

