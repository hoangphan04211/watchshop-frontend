"use client";

import "../../globals.css";
import AdminSidebar from "@/_components/admin/AdminSidebar";
import AdminFooter from "@/_components/admin/AdminFooter";
import AdminHeader from "@/_components/admin/AdminHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/_components/ui/ThemeProvider";

// ✅ Component bảo vệ: chỉ cho phép vào admin nếu đã login + đúng role
function RequireAdminLogin({ children }) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const hasWarned = useRef(false); // ✅ cờ ngăn hiển thị toast nhiều lần

  useEffect(() => {
    // Đọc từ localStorage sớm (tránh bị null lần đầu)
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    // Nếu đã hiển thị thông báo rồi thì không chạy lại
    if (hasWarned.current) return;

    if (!storedUser || !storedToken) {
      hasWarned.current = true;
      toast.warn("⚠️ Vui lòng đăng nhập để vào trang quản trị!");
      setTimeout(() => router.replace("/login"), 1000);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.roles !== "admin") {
      hasWarned.current = true;
      toast.error("🚫 Bạn không có quyền truy cập trang này!");
      setTimeout(() => router.replace("/"), 1000);
      return;
    }

    setLoading(false);
  }, [user, token, router]);

  // ✅ Trong khi kiểm tra → hiển thị loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-700">
        <div className="animate-pulse text-lg font-medium">
          Đang xác thực quyền truy cập...
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

// ✅ Layout chính cho admin
export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>
          <AuthProvider>
            {/* ✅ ToastContainer luôn hoạt động để hiển thị cảnh báo */}
            <ToastContainer position="top-right" autoClose={2500} />

            <RequireAdminLogin>
              <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <AdminSidebar />

                {/* Main Content */}
                <div className="flex flex-col flex-1">
                  <AdminHeader />
                  <main className="flex-1 overflow-y-auto p-6">{children}</main>
                  <AdminFooter />
                </div>
              </div>
            </RequireAdminLogin>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
