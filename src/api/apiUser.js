import api from "./axios"; // Dùng axios instance đã tạo sẵn
import { IMAGE_URL } from "./config";

//  Tự động thêm token nếu có
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// =====================
//  ADMIN USER CRUD
// =====================

//  Lấy danh sách user
export async function getAllUsers() {
    try {
        const res = await api.get("/admin/users");
        return res.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách user:", error);
        throw error;
    }
}

//  Lấy chi tiết user theo ID
export async function getUserById(id) {
    try {
        const res = await api.get(`/admin/users/${id}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi lấy user:", error);
        throw error;
    }
}

//  Kiểm tra trùng field (email, phone, username)
export async function checkUserExists(field, value) {
    try {
        const res = await api.get(`/admin/users/check?field=${field}&value=${value}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi kiểm tra user:", error);
        throw error;
    }
}

//  Thêm user mới
export async function addUser(data) {
    try {
        const res = await api.post("/admin/users", data);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi thêm user:", error);
        throw error;
    }
}

//  Cập nhật user
export async function updateUser(id, data) {
    try {
        const res = await api.put(`/admin/users/${id}`, data);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật user:", error);
        throw error;
    }
}

//  Xóa user
export async function deleteUser(id) {
    try {
        const res = await api.delete(`/admin/users/${id}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi xóa user:", error);
        throw error;
    }
}

// =====================
// 🔹 AUTH (LOGIN / LOGOUT)
// =====================

//  Đăng nhập
export async function loginUser(data) {
    try {
        const res = await api.post("/login", data);

        // Lưu token & thông tin user
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        return res.data;
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        throw error;
    }
}


//  Đăng xuất
export async function logoutUser() {
    try {
        const res = await api.post("/logout");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return res.data;
    } catch (error) {
        console.error("Lỗi đăng xuất:", error);
        throw error;
    }
}


// =====================
//  PROFILE NGƯỜI DÙNG
// =====================

// Lấy thông tin profile người dùng hiện tại
export async function getProfile() {
    try {
        const res = await api.get("/user/profile");
        return res.data;
    } catch (error) {
        console.error("Lỗi khi lấy profile:", error);
        throw error;
    }
}

// Cập nhật profile người dùng (có thể kèm avatar và đổi mật khẩu)
export async function updateProfile(data) {
    try {
        // Nếu gửi file avatar, cần dùng FormData
        const formData = new FormData();
        for (const key in data) {
            if (data[key] !== undefined && data[key] !== null) {
                formData.append(key, data[key]);
            }
        }

        const res = await api.post("/user/profile/update", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật profile:", error);
        throw error;
    }
}

