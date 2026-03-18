// src/api/apiOrder.js
import api from "./axios";
import { toast } from "react-toastify";

// ---------- Lấy danh sách orders ----------
export async function getOrders(limit = 100) {
    try {
        const res = await api.get("/admin/orders", { params: { limit } });
        return res.data;
    } catch (error) {
        toast.error("Không thể lấy danh sách đơn hàng");
        throw error;
    }
}

// ---------- Xem chi tiết order ----------
export async function getOrderById(id) {
    try {
        const res = await api.get(`/admin/orders/${id}`);
        return res.data;
    } catch (error) {
        toast.error("Không tìm thấy đơn hàng");
        throw error;
    }
}

// ---------- Thêm mới order ----------
export async function createOrder(data) {
    try {
        const res = await api.post("/admin/orders", data, {
            headers: { "Content-Type": "application/json" },
        });
        toast.success("Tạo đơn hàng thành công");
        return res.data;
    } catch (error) {
        toast.error("Tạo đơn hàng thất bại");
        throw error;
    }
}

// ---------- Cập nhật order ----------
export async function updateOrder(id, data) {
    try {
        const res = await api.post(`/admin/orders/${id}?_method=PUT`, data, {
            headers: { "Content-Type": "application/json" },
        });
        toast.success("Cập nhật đơn hàng thành công");
        return res.data;
    } catch (error) {
        toast.error("Cập nhật đơn hàng thất bại");
        throw error;
    }
}

// ---------- Xóa mềm order ----------
export async function deleteOrder(id) {
    try {
        const res = await api.delete(`/admin/orders/${id}`);
        toast.success("Đã đưa đơn hàng vào thùng rác");
        return res.data;
    } catch (error) {
        toast.error("Xóa đơn hàng thất bại");
        throw error;
    }
}

// ---------- Lấy danh sách trong thùng rác ----------
export async function getTrashOrders() {
    try {
        const res = await api.get("/admin/orders-trash");
        return res.data;
    } catch (error) {
        toast.error("Không thể tải thùng rác đơn hàng");
        throw error;
    }
}

// ---------- Khôi phục ----------
export async function restoreOrder(id) {
    try {
        const res = await api.put(`/admin/orders-restore/${id}`);
        toast.success("Khôi phục đơn hàng thành công");
        return res.data;
    } catch (error) {
        toast.error("Khôi phục thất bại");
        throw error;
    }
}

// ---------- Xóa vĩnh viễn ----------
export async function forceDeleteOrder(id) {
    try {
        const res = await api.delete(`/admin/orders-force/${id}`);
        toast.success("Đã xóa vĩnh viễn đơn hàng");
        return res.data;
    } catch (error) {
        toast.error("Xóa vĩnh viễn thất bại");
        throw error;
    }
}
