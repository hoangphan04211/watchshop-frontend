"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { getAllProducts as getProducts } from "@/api/apiSale";
import { createProductSale as createSale } from "@/api/apiSale";

export default function CreateSale() {
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]); // {id, price_sale?}
    const [form, setForm] = useState({
        name: "",
        price_sale: "", // giá chung
        date_begin: "",
        date_end: "",
        status: 1,
    });

    // Lấy danh sách sản phẩm
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const items = await getProducts();
                setProducts(Array.isArray(items) ? items : []);
            } catch (error) {
                console.log("Lỗi khi tải sản phẩm:", error);
            }
        };
        fetchProducts();
    }, []);

    // Thay đổi form chung
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Tìm kiếm sản phẩm
    const handleSearch = (e) => setSearch(e.target.value.toLowerCase());

    // Lọc sản phẩm theo tìm kiếm
    const filteredProducts = products.filter((prod) =>
        prod.name.toLowerCase().includes(search)
    );

    // Chọn / bỏ chọn sản phẩm
    const toggleProduct = (id) => {
        const exists = selectedProducts.find((p) => p.id === id);
        if (exists) {
            setSelectedProducts(selectedProducts.filter((p) => p.id !== id));
        } else {
            setSelectedProducts([...selectedProducts, { id, price_sale: "" }]);
        }
    };

    // Cập nhật giá riêng
    const updateProductPrice = (id, value) => {
        setSelectedProducts(
            selectedProducts.map((p) =>
                p.id === id ? { ...p, price_sale: value === "" ? null : Number(value) } : p
            )
        );
    };


    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) return toast.error("Vui lòng nhập tên chương trình");
        if (!form.date_begin || !form.date_end)
            return toast.error("Vui lòng chọn ngày bắt đầu và kết thúc");
        if (selectedProducts.length === 0)
            return toast.error("Vui lòng chọn ít nhất 1 sản phẩm");

        // --- Kiểm tra ngày ---
        const today = new Date();
        const dateBegin = new Date(form.date_begin);
        const dateEnd = new Date(form.date_end);

        if (dateBegin < new Date(today.toISOString().split("T")[0])) {
            return toast.error("Ngày bắt đầu không được nhỏ hơn ngày hiện tại");
        }

        if (dateEnd <= dateBegin) {
            return toast.error("Ngày kết thúc phải lớn hơn ngày bắt đầu");
        }

        const product_sales = selectedProducts.map((p) => ({
            product_id: p.id,
            price_sale: p.price_sale !== null ? p.price_sale : Number(form.price_sale || 0),
        }));


        const data = {
            name: form.name,
            date_begin: form.date_begin,
            date_end: form.date_end,
            status: Number(form.status),
            product_sales,
        };

        try {
            console.log("SelectedProducts:", selectedProducts);
            console.log("DATA TO SEND:", data);
            await createSale(data);
            toast.success("Thêm chương trình khuyến mãi thành công");
            router.push("/admin/sales");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi thêm chương trình khuyến mãi");
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md text-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold">Thêm chương trình khuyến mãi</h1>
                <Link
                    href="/admin/sales"
                    className="px-5 py-3 bg-gray-200 rounded-lg shadow-md text-gray-700 font-medium hover:bg-gray-300 transition"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Quay lại
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Tên chương trình */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium">Tên chương trình</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="VD: Giảm giá mùa hè"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Giá chung */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium">Giá giảm mặc định (có thể bỏ trống)</label>
                    <input
                        type="number"
                        name="price_sale"
                        placeholder="Giá sale áp dụng chung"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        onChange={handleChange}
                    />
                </div>

                {/* Ngày bắt đầu */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium">Ngày bắt đầu</label>
                    <input
                        type="date"
                        name="date_begin"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Ngày kết thúc */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium">Ngày kết thúc</label>
                    <input
                        type="date"
                        name="date_end"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Trạng thái */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium">Trạng thái</label>
                    <select
                        name="status"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        onChange={handleChange}
                        value={form.status}
                    >
                        <option value={1}>Hiển thị</option>
                        <option value={0}>Ẩn</option>
                    </select>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="flex flex-col col-span-2">
                    <label className="text-lg font-medium">Chọn sản phẩm áp dụng</label>
                    <input
                        type="text"
                        placeholder="Tìm sản phẩm theo tên..."
                        className="p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-pink-500"
                        value={search}
                        onChange={handleSearch}
                    />

                    <div className="max-h-64 overflow-y-auto border rounded-lg p-3 space-y-2">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((prod) => {
                                const selected = selectedProducts.find((p) => p.id === prod.id);
                                return (
                                    <div key={prod.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={!!selected}
                                            onChange={() => toggleProduct(prod.id)}
                                            className="w-5 h-5 accent-pink-600"
                                        />
                                        <span className="flex-1">{prod.name}</span>
                                        {selected && (
                                            <input
                                                type="number"
                                                min={0}
                                                placeholder="Giá riêng"
                                                className="w-32 p-1 border rounded"
                                                value={selected.price_sale === "" ? "" : selected.price_sale}
                                                onChange={(e) => updateProductPrice(prod.id, e.target.value)}
                                            />
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 italic text-center">Không tìm thấy sản phẩm phù hợp</p>
                        )}
                    </div>
                </div>

                {/* Nút lưu */}
                <div className="col-span-2">
                    <button
                        type="submit"
                        className="w-full py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition"
                    >
                        Lưu chương trình
                    </button>
                </div>
            </form>
        </div>
    );
}
