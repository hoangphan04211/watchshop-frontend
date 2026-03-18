// src/api/apiProductStore.js
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

//  Lấy danh sách tồn kho (phân trang)
export async function getProductStores(page = 1, limit = 5) {
    try {
        const res = await api.get(`/admin/product-stores`, {
            params: { page, limit },
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

//  Xem chi tiết tồn kho theo ID
export async function getProductStoreById(id) {
    try {
        const res = await api.get(`/admin/product-stores/${id}`);
        return res.data;
    } catch {
        toast.error("Không tìm thấy thông tin tồn kho");
    }
}

//  Thêm mới tồn kho
export async function createProductStore(data) {
    try {
        const res = await api.post(`/admin/product-stores`, data);
        toast.success("Thêm tồn kho thành công");
        return res.data;
    } catch (error) {
        toast.error("Thêm tồn kho thất bại");
        throw error;
    }
}

//  Cập nhật tồn kho
export async function updateProductStore(id, data) {
    try {
        const res = await api.put(`/admin/product-stores/${id}`, data);
        toast.success("Cập nhật tồn kho thành công");
        return res.data;
    } catch {
        toast.error("Cập nhật tồn kho thất bại");
    }
}

//  Xóa (mềm)
export async function deleteProductStore(id) {
    try {
        await api.delete(`/admin/product-stores/${id}`);
    } catch {
        toast.error("Xóa tồn kho thất bại");
    }
}

//  Lấy danh sách trong thùng rác (Product Stores)
export async function getProductStoresTrash() {
    try {
        const res = await api.get(`/admin/product-stores-trash`);
        return {
            items: res.data || [],
        };
    } catch (error) {
        throw error;
    }
}


//  Khôi phục tồn kho
export async function restoreProductStore(id) {
    try {
        await api.put(`/admin/product-stores-restore/${id}`);
        toast.success("Khôi phục tồn kho thành công");
    } catch {
        toast.error("Khôi phục tồn kho thất bại");
    }
}

// Xóa vĩnh viễn tồn kho
export async function forceDeleteProductStore(id) {
    try {
        await api.delete(`/admin/product-stores-force/${id}`);
        toast.success("Đã xóa vĩnh viễn tồn kho");
    } catch {
        toast.error("Xóa vĩnh viễn thất bại");
    }
}
