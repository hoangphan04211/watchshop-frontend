// src/api/apiContact.js
import api from "./axios";
import { toast } from "react-toastify";

// ---------- Lấy danh sách contact ----------
export async function getContacts(limit = 100) {
    try {
        const res = await api.get("/admin/contact", { params: { limit } });
        return res.data;
    } catch (error) {
        toast.error("Không thể lấy danh sách liên hệ");
        throw error;
    }
}

// ---------- Xem chi tiết contact ----------
export async function getContactById(id) {
    try {
        const res = await api.get(`/admin/contact/${id}`);
        return res.data;
    } catch (error) {
        toast.error("Không tìm thấy liên hệ");
        throw error;
    }
}

// ---------- Thêm mới contact ----------
export async function createContact(data) {
    try {
        const res = await api.post("/admin/contact", data, {
            headers: { "Content-Type": "application/json" },
        });
        toast.success("Tạo liên hệ thành công");
        return res.data;
    } catch (error) {
        toast.error("Tạo liên hệ thất bại");
        throw error;
    }
}

// ---------- Cập nhật contact ----------
export async function updateContact(id, data) {
    try {
        const res = await api.post(`/admin/contact/${id}?_method=PUT`, data, {
            headers: { "Content-Type": "application/json" },
        });
        toast.success("Cập nhật liên hệ thành công");
        return res.data;
    } catch (error) {
        toast.error("Cập nhật liên hệ thất bại");
        throw error;
    }
}

// ---------- Xóa contact ----------
export async function deleteContact(id) {
    try {
        const res = await api.delete(`/admin/contact/${id}`);
        toast.success("Đã xóa liên hệ");
        return res.data;
    } catch (error) {
        toast.error("Xóa liên hệ thất bại");
        throw error;
    }
}
