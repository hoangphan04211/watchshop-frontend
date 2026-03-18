'use client';

import { useEffect, useState } from "react";
import { getAllProducts, createProductStore, getProductStores } from "@/api/apiProductStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CreateOrUpdateStore() {
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [form, setForm] = useState({
        product_id: "",
        qty: 1,
        price_root: 0,
        status: 1,
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // --- Lấy danh sách sản phẩm + tồn kho hiện tại ---
    useEffect(() => {
        getAllProducts()
            .then((res) => setProducts(res))
            .catch(() => toast.error("Không thể tải danh sách sản phẩm"));

        getProductStores(1, 1000) // lấy toàn bộ để check tồn kho
            .then(({ items }) => setStores(items))
            .catch(() => toast.error("Không thể tải danh sách tồn kho"));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.product_id) return toast.error("Vui lòng chọn sản phẩm");
        setLoading(true);

        try {
            // Kiểm tra tồn kho hiện tại
            const existing = stores.find(s => s.product_id == form.product_id);
            if (existing) {
                // Cập nhật tồn kho
                await createProductStore({
                    ...form,
                    qty: existing.qty + form.qty, // cộng dồn số lượng
                });
                toast.success("Tồn kho đã được cập nhật");
            } else {
                // Tạo mới
                await createProductStore(form);
                toast.success("Tồn kho mới đã được tạo");
            }

            router.push("/admin/stores");
        } catch {
            toast.error("Thao tác thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white shadow rounded-xl w-full max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6">Thêm / Cập nhật tồn kho</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* Sản phẩm */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium mb-1">Sản phẩm</label>
                    <select
                        value={form.product_id}
                        onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                        <option value="">-- Chọn sản phẩm --</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                {/* Số lượng */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium mb-1">Số lượng</label>
                    <input
                        type="number"
                        min="1"
                        value={form.qty}
                        onChange={(e) => setForm({ ...form, qty: parseInt(e.target.value) })}
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                </div>

                {/* Giá gốc */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium mb-1">Giá gốc</label>
                    <input
                        type="number"
                        min="0"
                        value={form.price_root}
                        onChange={(e) => setForm({ ...form, price_root: parseFloat(e.target.value) })}
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                </div>

                {/* Trạng thái */}
                <div className="flex flex-col">
                    <label className="text-lg font-medium mb-1">Trạng thái</label>
                    <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: parseInt(e.target.value) })}
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                        <option value={1}>Hiển thị</option>
                        <option value={0}>Ẩn</option>
                    </select>
                </div>

                {/* Nút lưu */}
                <div className="col-span-2">
                    <button
                        type="submit"
                        className="w-full py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition"
                    >
                        Lưu tồn kho
                    </button>
                </div>
            </form>
        </div>

    );
}
