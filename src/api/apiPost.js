import api from "./axios";
import { API_URL } from "./config";
import { toast } from "react-toastify";

//  Lấy danh sách bài viết (admin)
export async function getPosts() {
    try {
        const res = await api.get("/admin/post");
        return res.data;
    } catch (error) {
        throw new Error("Không thể lấy danh sách bài viết");
    }
}

//  Lấy chi tiết 1 bài viết theo id
export async function getPostById(id) {
    try {
        const res = await api.get(`/admin/post/${id}`);
        return res.data;
    } catch (error) {
        throw new Error("Không thể lấy chi tiết bài viết");
    }
}

//  Thêm bài viết mới
export async function createPost(data) {
    try {
        const res = await api.post("/admin/post", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Thêm bài viết thành công");
        return res.data;
    } catch (error) {
        toast.error("Thêm bài viết thất bại");
        throw error;
    }
}

//  Cập nhật bài viết
export async function updatePost(id, data) {
    try {
        const res = await api.post(`/admin/post/${id}?_method=PUT`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Cập nhật bài viết thành công");
        return res.data;
    } catch (error) {
        toast.error("Cập nhật bài viết thất bại");
        throw error;
    }
}

//  Xóa mềm bài viết
export async function deletePost(id) {
    try {
        const res = await api.delete(`/admin/post/${id}`);
        toast.success("Xóa bài viết thành công");
        return res.data;
    } catch (error) {
        toast.error("Xóa bài viết thất bại");
        throw error;
    }
}

//  Lấy danh sách bài viết trong thùng rác
export async function getTrashPosts() {
    try {
        const res = await api.get("/admin/post-trash");
        return res.data;
    } catch (error) {
        throw new Error("Không thể lấy thùng rác bài viết");
    }
}

//  Khôi phục bài viết
export async function restorePost(id) {
    try {
        const res = await api.put(`/admin/post-restore/${id}`);
        toast.success("Khôi phục bài viết thành công");
        return res.data;
    } catch (error) {
        toast.error("Khôi phục bài viết thất bại");
        throw error;
    }
}

//  Xóa vĩnh viễn bài viết
export async function forceDeletePost(id) {
    try {
        const res = await api.delete(`/admin/post-force/${id}`);
        toast.success("Xóa vĩnh viễn bài viết thành công");
        return res.data;
    } catch (error) {
        toast.error("Xóa vĩnh viễn bài viết thất bại");
        throw error;
    }
}

//  Lấy bài viết mới (public - hiển thị ngoài site)
export async function getNewPosts(limit = 5) {
    try {
        const res = await api.get(`/post-new`, { params: { limit } });
        return res.data;
    } catch (error) {
        toast.error("Không thể lấy dữ liệu bài viết mới");
        throw error;
    }
}

//  Lấy tất cả bài viết (public - người dùng)
export async function getAllClientPosts(params = {}) {
    try {
        // Có thể truyền tham số lọc, phân trang nếu backend hỗ trợ
        const res = await api.get("/post", { params });
        return res.data;
    } catch (error) {
        toast.error("Không thể tải danh sách bài viết");
        throw error;
    }
}

//  Lấy chi tiết 1 bài viết (public - theo slug)
export async function getClientPostBySlug(slug) {
    try {
        const res = await api.get(`/posts/${slug}`);
        return res.data;
    } catch (error) {
        toast.error("Không thể tải chi tiết bài viết");
        throw error;
    }
}



