import api from "./axios";
import { toast } from "react-toastify";

// ================== ADMIN ==================

// Lấy danh sách tất cả topic
export async function getTopics() {
    try {
        const res = await api.get("/admin/topics");
        return res.data;
    } catch (error) {
        throw new Error("Không thể lấy danh sách topic");
    }
}

// Lấy chi tiết 1 topic theo id
export async function getTopicById(id) {
    try {
        const res = await api.get(`/admin/topics/${id}`);
        return res.data;
    } catch (error) {
        throw new Error("Không thể lấy chi tiết topic");
    }
}

// Thêm topic mới
export async function createTopic(data) {
    try {
        const res = await api.post("/admin/topics", data);
        return res.data;
    } catch (error) {
        throw new Error("Không thể thêm topic");
    }
}

// Cập nhật topic
export async function updateTopic(id, data) {
    try {
        // dùng _method=PUT để tránh lỗi khi upload form-data
        const res = await api.post(`/admin/topics/${id}?_method=PUT`, data);
        return res.data;
    } catch (error) {
        throw new Error("Không thể cập nhật topic");
    }
}

// Xóa mềm topic
export async function deleteTopic(id) {
    try {
        const res = await api.delete(`/admin/topics/${id}`);
        return res.data;
    } catch (error) {
        throw new Error("Không thể xóa topic");
    }
}

// Lấy danh sách topic trong thùng rác
export async function getTrashTopics() {
    try {
        const res = await api.get("/admin/topics-trash");
        return res.data;
    } catch (error) {
        toast.error("Không thể lấy thùng rác topic");
        throw error;
    }
}

// Khôi phục topic từ thùng rác
export async function restoreTopic(id) {
    try {
        const res = await api.put(`/admin/topics-restore/${id}`);
        toast.success("Khôi phục topic thành công");
        return res.data;
    } catch (error) {
        toast.error("Khôi phục topic thất bại");
        throw error;
    }
}

// Xóa vĩnh viễn topic
export async function forceDeleteTopic(id) {
    try {
        const res = await api.delete(`/admin/topics-force/${id}`);
        toast.success("Xóa vĩnh viễn topic thành công");
        return res.data;
    } catch (error) {
        toast.error("Xóa vĩnh viễn topic thất bại");
        throw error;
    }
}

// ================== PUBLIC ==================

// Lấy danh sách topic (public, ví dụ hiển thị ngoài trang chủ)
export async function getPublicTopics(limit = 10) {
    try {
        const res = await api.get(`/topics?limit=${limit}`);
        return res.data;
    } catch (error) {
        throw new Error("Không thể lấy dữ liệu topics");
    }
}
