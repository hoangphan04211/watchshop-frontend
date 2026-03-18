"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import slugify from "slugify";
import { getCategories } from "@/api/apiCategory";
import { getAllAttributes, createAttribute } from "@/api/apiAttribute";
import { createProduct } from "@/api/apiProduct";

export default function CreateProduct() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [form, setForm] = useState({
        name: "",
        slug: "",
        price: "",
        price_sale: "",
        category_id: "",
        image: null,
        images: [],
        status: 1,
        description: "",
        attributes: [], // danh sách attributes được chọn
    });

    // Load categories và attributes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const cats = await getCategories();
                setCategories(cats);

                const attrs = await getAllAttributes();
                setAttributes(attrs);
            } catch (error) {
                toast.error("Không tải được dữ liệu danh mục hoặc attributes");
            }
        };
        fetchData();
    }, []);

    // Thêm attribute mới ngay lập tức
    const handleAddNewAttribute = async (index) => {
        const attr = form.attributes[index];
        if (!attr.name) {
            toast.error("Tên thuộc tính mới không được để trống");
            return;
        }

        try {
            // Gọi API tạo attribute
            const newAttr = await createAttribute({ name: attr.name });

            // Load lại danh sách attributes
            const allAttrs = await getAllAttributes();
            setAttributes(allAttrs);

            // Cập nhật attribute trong form: chọn luôn attribute vừa tạo
            const updatedAttrs = [...form.attributes];
            updatedAttrs[index] = {
                attribute_id: newAttr.id,
                value: attr.value,
            };
            setForm({ ...form, attributes: updatedAttrs });

        } catch (error) {
            console.error(error);
        }
    };

    // Auto slug
    const handleNameChange = (e) => {
        const value = e.target.value;
        setForm({
            ...form,
            name: value,
            slug: slugify(value, { lower: true, strict: true, locale: "vi" }),
        });
    };

    // Change input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Ảnh chính
    const handleFileChange = (e) => {
        setForm({ ...form, image: e.target.files[0] });
    };

    // Ảnh phụ (nhiều)
    const handleMultiFileChange = (e) => {
        setForm({ ...form, images: Array.from(e.target.files) });
    };

    // Thêm attribute
    const handleAddAttribute = () => {
        setForm({
            ...form,
            attributes: [...form.attributes, { attribute_id: "", value: "" }],
        });
    };

    // Xóa attribute
    const handleRemoveAttribute = (index) => {
        const newAttrs = [...form.attributes];
        newAttrs.splice(index, 1);
        setForm({ ...form, attributes: newAttrs });
    };

    // Thay đổi attribute
    const handleAttributeChange = (index, field, value) => {
        const newAttrs = [...form.attributes];
        newAttrs[index][field] = value;
        setForm({ ...form, attributes: newAttrs });
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("slug", form.slug);
            formData.append("price", form.price);
            formData.append("price_sale", form.price_sale || 0);
            formData.append("category_id", parseInt(form.category_id, 10));
            formData.append("status", form.status);
            if (form.image) formData.append("image", form.image);
            formData.append("description", form.description || "");

            // Nhiều ảnh phụ
            if (form.images && form.images.length > 0) {
                form.images.forEach((file, index) => {
                    formData.append("images[]", file);
                });
            }

            // Thêm attributes
            if (form.attributes.length > 0) {
                form.attributes.forEach((attr, index) => {
                    formData.append(`attributes[${index}][attribute_id]`, attr.attribute_id);
                    formData.append(`attributes[${index}][value]`, attr.value);
                });
            }

            await createProduct(formData);
            router.push("/admin/products");
        } catch (error) {
            toast.error("Lỗi khi thêm sản phẩm");
            console.error(error);
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md text-black">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Thêm sản phẩm</h1>
                <Link
                    href="/admin/products"
                    className="px-5 py-3 bg-gray-200 rounded-lg shadow-md text-gray-700 font-medium hover:bg-gray-300 transition"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Quay lại
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Tên */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Tên sản phẩm</label>
                    <input
                        name="name"
                        placeholder="Tên sản phẩm"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleNameChange}
                        required
                    />
                </div>

                {/* Slug */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Slug</label>
                    <input
                        name="slug"
                        placeholder="Slug"
                        className="p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                        value={form.slug}
                        readOnly
                    />
                </div>

                {/* Giá */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Giá</label>
                    <input
                        type="number"
                        name="price"
                        placeholder="Giá"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Giá sale */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Giá khuyến mãi</label>
                    <input
                        type="number"
                        name="price_sale"
                        placeholder="Giá khuyến mãi"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleChange}
                    />
                </div>

                {/* Danh mục */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Danh mục</label>
                    <select
                        name="category_id"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Ảnh chính */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Ảnh chính sản phẩm</label>
                    <input
                        type="file"
                        name="image"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleFileChange}
                    />
                </div>

                {/* Ảnh phụ */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Ảnh phụ (nhiều)</label>
                    <input
                        type="file"
                        name="images"
                        multiple
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleMultiFileChange}
                    />
                </div>

                {/* Attributes */}
                <div className="flex flex-col col-span-2">
                    <label className="text-lg font-medium text-gray-700">Thuộc tính</label>
                    {form.attributes.map((attr, index) => (
                        <div key={index} className="flex gap-2 mb-2 items-center">
                            <select
                                className="p-2 border rounded-lg flex-1"
                                value={attr.attribute_id || ""}
                                onChange={(e) => {
                                    const selected = e.target.value;
                                    if (selected === "new") {
                                        handleAttributeChange(index, "attribute_id", "");
                                        handleAttributeChange(index, "isNew", true);
                                        handleAttributeChange(index, "name", "");
                                    } else {
                                        handleAttributeChange(index, "attribute_id", selected);
                                        handleAttributeChange(index, "isNew", false);
                                        handleAttributeChange(index, "name", "");
                                    }
                                }}
                            >
                                <option value="">-- Chọn attribute --</option>
                                {attributes.map((a) => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                                <option value="new">+ Thêm thuộc tính mới...</option>
                            </select>

                            {attr.isNew && (
                                <>
                                    <input
                                        type="text"
                                        className="border p-2 rounded-lg flex-1"
                                        placeholder="Tên thuộc tính mới"
                                        value={attr.name || ""}
                                        onChange={(e) => handleAttributeChange(index, "name", e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                                        onClick={() => handleAddNewAttribute(index)}
                                    >
                                        Lưu mới
                                    </button>
                                </>
                            )}

                            <input
                                type="text"
                                className="border p-2 rounded-lg flex-1"
                                placeholder="Giá trị"
                                value={attr.value || ""}
                                onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                onClick={() => handleRemoveAttribute(index)}
                                className="px-2 py-1 bg-red-500 text-white rounded-lg"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddAttribute}
                        className="px-3 py-2 bg-green-500 text-white rounded-lg flex items-center gap-1"
                    >
                        <FontAwesomeIcon icon={faPlus} /> Thêm thuộc tính
                    </button>
                </div>

                {/* Mô tả */}
                <div className="flex flex-col col-span-2">
                    <label className="text-lg font-medium text-gray-700">Mô tả</label>
                    <textarea
                        name="description"
                        placeholder="Mô tả sản phẩm"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleChange}
                    />
                </div>

                {/* Trạng thái */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">Trạng thái</label>
                    <select
                        name="status"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleChange}
                        value={form.status}
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
                        Lưu sản phẩm
                    </button>
                </div>
            </form>
        </div>
    );
}
