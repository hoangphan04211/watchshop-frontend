import api from "./axios";
import { toast } from "react-toastify";


// Lấy danh sách tất cả banner
export async function getBanners() {
  try {
    const res = await api.get("/admin/banner");
    return res.data;
  } catch (error) {
    throw new Error("Không thể lấy danh sách banner");
  }
}

// Lấy chi tiết 1 banner theo id
export async function getBannerById(id) {
  try {
    const res = await api.get(`/admin/banner/${id}`);
    return res.data;
  } catch (error) {
    throw new Error("Không thể lấy chi tiết banner");
  }
}

// Thêm banner mới
export async function createBanner(data) {
  try {
    const res = await api.post("/admin/banner", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    throw new Error("Không thể thêm banner");
  }
}

// Cập nhật banner
export async function updateBanner(id, data) {
  try {
    const res = await api.post(`/admin/banner/${id}?_method=PUT`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    throw new Error("Không thể cập nhật banner");
  }
}

// Xóa mềm banner
export async function deleteBanner(id) {
  try {
    const res = await api.delete(`/admin/banner/${id}`);
    return res.data;
  } catch (error) {
    throw new Error("Không thể xóa banner");
  }
}

// Lấy danh sách banner trong thùng rác
export async function getTrashBanners() {
  try {
    const res = await api.get("/admin/banner-trash");
    return res.data;
  } catch (error) {
    toast.error(" Không thể lấy thùng rác banner");
    throw error;
  }
}

// Khôi phục banner từ thùng rác
export async function restoreBanner(id) {
  try {
    const res = await api.put(`/admin/banner-restore/${id}`);
    toast.success("Khôi phục banner thành công");
    return res.data;
  } catch (error) {
    toast.error("Khôi phục banner thất bại");
    throw error;
  }
}

// Xóa vĩnh viễn banner
export async function forceDeleteBanner(id) {
  try {
    const res = await api.delete(`/admin/banner-force/${id}`);
    toast.success("Xóa vĩnh viễn banner thành công");
    return res.data;
  } catch (error) {
    toast.error("Xóa vĩnh viễn banner thất bại");
    throw error;
  }
}

// Lấy banner slider (public, hiển thị ngoài trang chủ)
export async function getBannerSlider() {
  try {
    const res = await api.get("/banner-slider");
    return res.data;
  } catch (error) {
    throw new Error("Không thể lấy dữ liệu banner slider");
  }
}
