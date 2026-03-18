// src/api/apiAttribute.js
import api from "./axios";
import { toast } from "react-toastify";

// Tạo attribute mới
export async function createAttribute(data) {
    try {
        const res = await api.post("/admin/attributes", data);
        toast.success("Tạo attribute thành công");
        return res.data;
    } catch (error) {
        toast.error("Tạo attribute thất bại");
        throw error;
    }
}

// Lấy tất cả attribute
export async function getAllAttributes() {
    try {
        const res = await api.get("/admin/attributes");
        return res.data;
    } catch (error) {
        toast.error("Không thể tải danh sách thuộc tính");
        throw error;
    }
}
