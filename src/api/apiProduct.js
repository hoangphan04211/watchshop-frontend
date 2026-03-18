// src/api/product.js
import api from "./axios";
import { toast } from "react-toastify";

/* =========================================================
   🛍️ PRODUCT API - Dùng cho trang Sản phẩm & Chi tiết sản phẩm
   ========================================================= */

// 🆕 Lấy sản phẩm mới
export async function getNewProducts(limit = 10) {
  try {
    const res = await api.get(`/products/new/${limit}`);
    return res.data;
  } catch (error) {
    toast.error("Không thể lấy sản phẩm mới");
    throw error;
  }
}

// 💸 Lấy sản phẩm khuyến mãi
export async function getSaleProducts(limit = 10) {
  try {
    const res = await api.get(`/products/sale/${limit}`);
    return res.data;
  } catch (error) {
    toast.error("Không thể lấy sản phẩm khuyến mãi");
    throw error;
  }
}

// 📦 Lấy toàn bộ sản phẩm
export async function getAllProducts(limit = 100) {
  try {
    const res = await api.get(`/products/all/${limit}`);
    return res.data;
  } catch (error) {
    toast.error("Không thể tải danh sách sản phẩm");
    throw error;
  }
}

// 🗂️ Lấy sản phẩm theo danh mục (slug)
export async function getProductsByCategory(slug, limit = 10) {
  try {
    const res = await api.get(`/products/category/${slug}?limit=${limit}`);
    return res.data;
  } catch (error) {
    toast.error("Không thể lấy sản phẩm theo danh mục");
    throw error;
  }
}
//api/product.js
// 🏷️ Lấy danh mục sản phẩm
export async function getProductCategories() {
  try {
    const res = await api.get(`/categories`);
    return res.data;
  } catch (error) {
    toast.error("Không thể lấy danh mục sản phẩm");
    throw error;
  }
}

// 🔍 Lấy chi tiết sản phẩm theo slug
export async function getProductBySlug(slug) {
  try {
    const res = await api.get(`/products/${slug}`);
    return res.data;
  } catch (error) {
    toast.error("Không thể lấy chi tiết sản phẩm");
    throw error;
  }
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////




// Lấy danh sách sản phẩm (admin)
// apiProduct.js
export async function getProducts(page = 1, keyword = "", category_id = "") {
  try {
    const res = await api.get(
      `/admin/products?page=${page}&keyword=${keyword}&category_id=${category_id}`
    );
    return {
      items: res.data.data,
      pagination: {
        current_page: res.data.current_page,
        last_page: res.data.last_page,
        total: res.data.total,
      },
    };
  } catch (error) {
    toast.error("Không thể lấy danh sách sản phẩm");
    throw error;
  }
}



// Xóa tạm (bỏ vào thùng rác)
export async function deleteProduct(id) {
  try {
    const res = await api.delete(`/admin/products/${id}`);
    // toast.success("Đã xóa sản phẩm vào thùng rác");
    return res;
  } catch (error) {
    toast.error("Xóa sản phẩm thất bại");
    throw error;
  }
}

// Xem chi tiết sản phẩm
export async function getProductById(id) {
  try {
    const res = await api.get(`/admin/products/${id}`);
    return res.data;   // chỉ trả về object sản phẩm
  } catch (error) {
    toast.error("Không tìm thấy sản phẩm");
    throw error;
  }
}



export async function createProduct(data) {
  try {
    const res = await api.post("/admin/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Thêm sản phẩm thành công");
    return res.data;
  } catch (error) {
    console.error(error);
    toast.error("Thêm sản phẩm thất bại");
    throw error;
  }
}

export async function updateProduct(id, data) {
  try {
    // Laravel PUT nhận FormData vẫn ok, hoặc POST kèm _method=PUT
    const res = await api.post(`/admin/products/${id}?_method=PUT`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // toast.success("Cập nhật sản phẩm thành công");
    return res.data;
  } catch (error) {
    toast.error("Cập nhật sản phẩm thất bại");
    throw error;
  }
}



// Lấy thùng rác
export async function getTrashProducts() {
  try {
    return await api.get("/admin/products-trash");
  } catch (error) {
    toast.error("Không thể tải thùng rác");
    throw error;
  }
}

// Khôi phục sản phẩm
export async function restoreProduct(id) {
  try {
    const res = await api.put(`/admin/products-restore/${id}`);
    toast.success("Khôi phục sản phẩm thành công");
    return res;
  } catch (error) {
    toast.error("Khôi phục thất bại");
    throw error;
  }
}

// Xóa vĩnh viễn
export async function forceDeleteProduct(id) {
  try {
    const res = await api.delete(`/admin/products-force/${id}`);
    toast.success("Đã xóa sản phẩm vĩnh viễn");
    return res;
  } catch (error) {
    toast.error("Xóa vĩnh viễn thất bại");
    throw error;
  }
}


