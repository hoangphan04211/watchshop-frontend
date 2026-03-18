import api from "./axios";
import { toast } from "react-toastify";

//
//  ADMIN API - Quản lý Setting
//

//  Lấy danh sách cài đặt (chỉ có 1 hoặc vài bản ghi)
export async function getSettings() {
    try {
        const res = await api.get("/admin/settings");
        return res.data;
    } catch (error) {
        throw new Error("Không thể lấy danh sách setting");
    }
}

//  Lấy chi tiết cài đặt theo ID
export async function getSettingById(id) {
    try {
        const res = await api.get(`/admin/settings/${id}`);
        return res.data;
    } catch (error) {
        throw new Error("Không thể lấy chi tiết setting");
    }
}

//  Tạo mới setting
export async function createSetting(data) {
    try {
        const res = await api.post("/admin/settings", data);
        toast.success("Thêm cấu hình thành công");
        return res.data;
    } catch (error) {
        toast.error("Thêm cấu hình thất bại");
        throw error;
    }
}

//  Cập nhật setting
export async function updateSetting(id, data) {
    try {
        const res = await api.post(`/admin/settings/${id}?_method=PUT`, data);
        toast.success("Cập nhật cấu hình thành công");
        return res.data;
    } catch (error) {
        toast.error("Cập nhật cấu hình thất bại");
        throw error;
    }
}

//  Xóa setting
export async function deleteSetting(id) {
    try {
        const res = await api.delete(`/admin/settings/${id}`);
        toast.success("Xóa cấu hình thành công");
        return res.data;
    } catch (error) {
        toast.error("Xóa cấu hình thất bại");
        throw error;
    }
}

//
//  CLIENT API - Hiển thị ngoài trang người dùng (header/footer)
//

//  Lấy thông tin site đang kích hoạt (status = 1)
export async function getClientSetting() {
    try {
        const res = await api.get("/setting");
        return res.data;
    } catch (error) {
        toast.error("Không thể tải thông tin cấu hình website");
        throw error;
    }
}
