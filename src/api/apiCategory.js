import api from "./axios";
import { toast } from "react-toastify";

// ---------- Lấy danh sách category ----------
export async function getCategories(limit = 10) {
  try {
    const res = await api.get("/admin/category", { params: { limit } });
    return res.data;
  } catch (error) {
    toast.error("Không thể lấy dữ liệu category");
    throw error;
  }
}

// ---------- Xem chi tiết category ----------
export async function getCategoryById(id) {
  try {
    const res = await api.get(`/admin/category/${id}`);
    return res.data;
  } catch (error) {
    toast.error("Không tìm thấy category");
    throw error;
  }
}

// ---------- Thêm mới category ----------
export async function createCategory(data) {
  try {
    const res = await api.post("/admin/category", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // toast.success("Thêm danh mục thành công");
    return res.data;
  } catch (error) {
    toast.error("Thêm danh mục thất bại");
    throw error;
  }
}

// ---------- Cập nhật category ----------
export async function updateCategory(id, data) {
  try {
    const res = await api.post(`/admin/category/${id}?_method=PUT`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // toast.success("Cập nhật danh mục thành công");
    return res.data;
  } catch (error) {
    toast.error("Cập nhật danh mục thất bại");
    throw error;
  }
}

// ---------- Xóa mềm category ----------
export async function deleteCategory(id) {
  try {
    const res = await api.delete(`/admin/category/${id}`);
    // toast.success("Đã đưa danh mục vào thùng rác");
    return res.data;
  } catch (error) {
    toast.error("Xóa category thất bại");
    throw error;
  }
}

// ---------- Lấy danh sách trong thùng rác ----------
export async function getTrashCategories() {
  try {
    const res = await api.get("/admin/category-trash");
    return res.data;
  } catch (error) {
    toast.error("Không thể tải thùng rác");
    throw error;
  }
}

// ---------- Khôi phục ----------
export async function restoreCategory(id) {
  try {
    const res = await api.put(`/admin/category-restore/${id}`);
    toast.success("Khôi phục category thành công");
    return res.data;
  } catch (error) {
    toast.error("Khôi phục thất bại");
    throw error;
  }
}

// ---------- Xóa vĩnh viễn ----------
export async function forceDeleteCategory(id) {
  try {
    const res = await api.delete(`/admin/category-force/${id}`);
    toast.success("Đã xóa vĩnh viễn category");
    return res.data;
  } catch (error) {
    toast.error("Xóa vĩnh viễn thất bại");
    throw error;
  }
}
