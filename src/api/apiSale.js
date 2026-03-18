import api from "./axios";
import { toast } from "react-toastify";

export async function getAllProducts() {
    try {
        const res = await api.get("/admin/products");
        // Trả về trực tiếp mảng sản phẩm
        return res.data.data;
    } catch (error) {
        throw error;
    }
}


// 📄 Lấy danh sách chương trình giảm giá (phân trang + tìm kiếm)
export async function getProductSales(page = 1, keyword = "", limit = 5) {
    try {
        const res = await api.get(`/admin/product-sales`, {
            params: { page, keyword, limit },
        });
        return {
            items: res.data.data,
            pagination: {
                current_page: res.data.current_page,
                last_page: res.data.last_page,
                total: res.data.total,
                per_page: res.data.per_page,
            },
        };
    } catch (error) {
        throw error;
    }
}

// 👁️ Xem chi tiết
export async function getProductSaleById(id) {
    try {
        const res = await api.get(`/admin/product-sales/${id}`);
        return res.data;
    } catch {
        toast.error("Không tìm thấy chương trình giảm giá");
    }
}

// ➕ Thêm mới
export async function createProductSale(data) {
    try {
        const res = await api.post(`/admin/product-sales`, data);
        toast.success("Thêm chương trình giảm giá thành công");
        return res.data;
    } catch (error) {
        toast.error("Thêm thất bại");
        throw error;
    }
}

// ✏️ Cập nhật
export async function updateProductSale(id, data) {
    try {
        const res = await api.put(`/admin/product-sales/${id}`, data);
        toast.success("Cập nhật thành công");
        return res.data;
    } catch {
        toast.error("Cập nhật thất bại");
    }
}

// ❌ Xóa
export async function deleteProductSale(id) {
    try {
        await api.delete(`/admin/product-sales/${id}`);
        toast.success("Đã xóa chương trình giảm giá");
    } catch {
        toast.error("Xóa thất bại");
    }
}
