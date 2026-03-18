import api from "./axios";
import { toast } from "react-toastify";

//
//  ADMIN API - Quản lý Menu
//

// Lấy danh sách menu
export async function getMenus() {
    try {
        const res = await api.get("/admin/menus");
        return res.data;
    } catch (error) {
        throw new Error("Không thể lấy danh sách menu");
    }
}

// Lấy chi tiết menu theo ID
export async function getMenuById(id) {
    try {
        const res = await api.get(`/admin/menus/${id}`);
        return res.data;
    } catch (error) {
        throw new Error("Không thể lấy chi tiết menu");
    }
}

// Tạo mới menu
export async function createMenu(data) {
    try {
        const res = await api.post("/admin/menus", data);
        toast.success("Thêm menu thành công");
        return res.data;
    } catch (error) {
        toast.error("Thêm menu thất bại");
        throw error;
    }
}

// Cập nhật menu
export async function updateMenu(id, data) {
    try {
        const res = await api.post(`/admin/menus/${id}?_method=PUT`, data);
        toast.success("Cập nhật menu thành công");
        return res.data;
    } catch (error) {
        toast.error("Cập nhật menu thất bại");
        throw error;
    }
}

// Xóa menu
export async function deleteMenu(id) {
    try {
        const res = await api.delete(`/admin/menus/${id}`);
        toast.success("Xóa menu thành công");
        return res.data;
    } catch (error) {
        toast.error("Xóa menu thất bại");
        throw error;
    }
}

//
//  CLIENT API - Hiển thị ngoài trang người dùng (header/footer)
//

// Lấy menu hiển thị ra trang người dùng (ví dụ header, footer)
export async function getClientMenu() {
    try {
        const res = await api.get("/menus");
        return res.data;
    } catch (error) {
        toast.error("Không thể tải menu hiển thị");
        throw error;
    }
}
