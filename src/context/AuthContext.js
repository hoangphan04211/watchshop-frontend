// src/context/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    //🔹 Khởi tạo: đọc localStorage khi load trang
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    // 🔹 Đăng nhập (lưu và cập nhật context)
    const login = (userData, tokenValue) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", tokenValue);
        setUser(userData);
        setToken(tokenValue);
        // toast.success("🎉 Đăng nhập thành công!");
    };

    // 🔹 Đăng xuất
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
        toast.info("👋 Đã đăng xuất!");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// ✅ Hook tiện dụng
export function useAuth() {
    return useContext(AuthContext);
}
