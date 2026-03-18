"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getProductSaleById as getSaleById, updateProductSale as updateSale } from "@/api/apiSale";
import { getAllProducts } from "@/api/apiSale";
import { IMAGE_URL } from "@/api/config";
import Image from "next/image";

export default function SaleEdit() {
    const { id } = useParams();
    const router = useRouter();
    const [sale, setSale] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const [saleData, productList] = await Promise.all([
                    getSaleById(id),
                    getAllProducts(),
                ]);
                setSale(saleData.sale);
                setProducts(productList || []);
                setSelectedProducts(saleData.products.map(p => p.id));
            } catch {
                toast.error("Không thể tải dữ liệu khuyến mãi");
                router.push("/admin/sales");
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchData();
    }, [id, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSale(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (productId) => {
        setSelectedProducts(prev =>
            prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        );
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedProducts.length === 0) {
            toast.error("Vui lòng chọn ít nhất 1 sản phẩm");
            return;
        }
        setSaving(true);
        try {
            const payload = {
                ...sale,
                product_ids: selectedProducts,
            };
            await updateSale(id, payload);
            toast.success("Cập nhật chương trình giảm giá thành công!");
            router.push(`/admin/sales/${id}`);
        } catch {
            toast.error("Cập nhật thất bại!");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-96 text-gray-500 text-lg">Đang tải dữ liệu...</div>;
    if (!sale) return <p className="text-center text-gray-500 p-6">Không tìm thấy dữ liệu...</p>;

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-lg space-y-10">
            <div className="flex justify-between items-center border-b pb-4">
                <h1 className="text-3xl font-bold text-black">Cập nhật chương trình giảm giá</h1>
                <button onClick={() => router.push(`/admin/sales/${id}`)} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"> Quay lại</button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Form trái */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-lg font-semibold mb-1 text-black">Tên chương trình</label>
                        <input type="text" name="name" value={sale.name || ""} onChange={handleChange} className="text-black w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500" />
                    </div>

                    <div>
                        <label className="block text-lg font-semibold mb-1 text-black">Tìm & chọn sản phẩm</label>
                        <input type="text" placeholder="Tìm sản phẩm..." value={search} onChange={handleSearchChange} className="w-full p-2 mb-2 border rounded-lg focus:ring-2 focus:ring-pink-500" />

                        <div className="max-h-64 overflow-y-auto border rounded-lg p-2 space-y-2">
                            {filteredProducts.map(p => (
                                <label key={p.id} className="flex items-center gap-2 p-1 rounded hover:bg-gray-50 cursor-pointer text-black">
                                    <input type="checkbox" checked={selectedProducts.includes(p.id)} onChange={() => handleCheckboxChange(p.id)} className="w-5 h-5" />
                                    <span>{p.name}</span>
                                </label>
                            ))}
                            {filteredProducts.length === 0 && <p className="text-gray-400 text-sm text-center">Không tìm thấy sản phẩm</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-lg font-semibold mb-1 text-black">Giá giảm (VNĐ)</label>
                        <input type="number" name="price_sale" value={sale.price_sale || ""} onChange={handleChange} className="text-black w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500" />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-lg font-semibold mb-1 text-black">Ngày bắt đầu</label>
                            <input type="date" name="date_begin" value={sale.date_begin?.slice(0, 10) || ""} onChange={handleChange} className="text-black w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-lg font-semibold mb-1 text-black">Ngày kết thúc</label>
                            <input type="date" name="date_end" value={sale.date_end?.slice(0, 10) || ""} onChange={handleChange} className="text-black w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-lg font-semibold mb-1 text-black">Trạng thái</label>
                        <select name="status" value={sale.status || 1} onChange={handleChange} className="text-black w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500">
                            <option value={1}>Hiển thị</option>
                            <option value={0}>Ẩn</option>
                        </select>
                    </div>
                </div>

                {/* Form phải - danh sách sản phẩm */}
                <div className="max-h-[400px] overflow-y-auto border rounded-xl p-4 space-y-4 bg-gray-50">
                    {selectedProducts.length > 0 ? (
                        selectedProducts.map(pid => {
                            const p = products.find(item => item.id === pid);
                            return p ? (
                                <div key={pid} className="flex items-center gap-4 text-black border-b pb-2">
                                    {p.image ? (
                                        <Image src={`${IMAGE_URL}/products/${p.image}`} alt={p.name} width={40} height={40} className="w-25 h-15 rounded-lg object-cover" />
                                    ) : (
                                        <div className="w-[80px] h-[80px] bg-gray-200 flex items-center justify-center rounded-lg">
                                            <span className="text-gray-500 text-xs">Không có ảnh</span>
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{p.name}</span>
                                        <span className="text-sm">{p.price.toLocaleString("vi-VN")} ₫</span>
                                    </div>
                                </div>
                            ) : null;
                        })
                    ) : (
                        <p className="text-gray-500 text-center">Chưa chọn sản phẩm</p>
                    )}
                </div>
            </form>

            <div className="flex justify-end pt-4 border-t">
                <button type="submit" onClick={handleSubmit} disabled={saving} className={`px-8 py-3 rounded-lg text-white font-semibold transition ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"}`}>
                    {saving ? "Đang lưu..." : " Lưu thay đổi"}
                </button>
            </div>
        </div>
    );
}
