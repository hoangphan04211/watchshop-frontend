"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

export default function AdminHeader() {
  const { user, logout } = useAuth(); // dùng context để lấy user và logout
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // ✅ Đảm bảo UI không render trước khi user được load
  useEffect(() => {
    setLoading(false);
  }, [user]);

  const handleLogout = () => {
    logout(); 
    setTimeout(() => router.push("/login"), 800);
  };

  if (loading) return null;

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-pink-600">Admin Dashboard</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">
          Xin chào, {user?.name || user?.username || "Admin"}
        </span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
