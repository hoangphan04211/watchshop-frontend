'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { getProfile, logoutUser } from "@/api/apiUser";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch (error) {
        console.error("Lỗi lấy profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <div className="text-white p-8">Đang tải dữ liệu...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl rounded-[2rem] bg-white border border-zinc-100 shadow-xl shadow-zinc-200/50 p-8 md:p-12 mb-20 mt-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-zinc-100 pb-10">
          <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
            <Image
              src={profile.avatar || "/avatar-demo.jpg"}
              alt="Avatar"
              fill
              className="rounded-full object-cover border-4 border-white shadow-lg shadow-zinc-200/50"
            />
          </div>
          <div className="text-center md:text-left flex-1 flex flex-col justify-center h-full pt-2">
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-wider uppercase">{profile.name}</h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-3 bg-zinc-100 w-fit mx-auto md:mx-0 px-3 py-1.5 rounded-full">
              {profile.roles}
            </p>
          </div>
        </div>

        {/* THÔNG TIN CÁ NHÂN + ĐƠN HÀNG GẦN NHẤT */}
        <div className="mt-10 grid md:grid-cols-2 gap-8">
          <div className="rounded-3xl bg-zinc-50 border border-zinc-100 p-8">
            <h2 className="text-lg font-black text-zinc-900 uppercase tracking-widest mb-6 border-b border-zinc-200 pb-4">Hồ Sơ Của Bạn</h2>
            <ul className="space-y-4 text-zinc-600 text-sm font-medium">
              <li className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Họ tên</span>
                  <span className="text-zinc-900 text-base">{profile.name}</span>
              </li>
              <li className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Email</span>
                  <span className="text-zinc-900 text-base">{profile.email}</span>
              </li>
              <li className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Số điện thoại</span>
                  <span className="text-zinc-900 text-base">{profile.phone}</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-zinc-50 border border-zinc-100 p-8">
            <h2 className="text-lg font-black text-zinc-900 uppercase tracking-widest mb-6 border-b border-zinc-200 pb-4">Lịch Sử Mua Hàng</h2>
            {profile.recent_orders?.length > 0 ? (
              <ul className="space-y-4">
                {profile.recent_orders.map(order => (
                  <li key={order.order_id} className="bg-white border border-zinc-100 p-4 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-zinc-900 text-sm">Đơn #{order.order_id}</span>
                        <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded-full font-bold uppercase tracking-widest">{order.status_text}</span>
                    </div>
                    <div className="text-red-500 font-black">
                        {order.total_amount.toLocaleString('vi-VN')} đ
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 font-medium text-sm">Chưa có đơn hàng nào.</p>
            )}
          </div>
        </div>

        {/* NÚT HÀNH ĐỘNG */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => window.location.href = "/profile/edit"}
            className="px-8 py-3.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold uppercase tracking-widest text-xs transition-all duration-300 shadow-lg shadow-black/20"
          >
             Cập nhật thông tin
          </button>
          <button
            onClick={logoutUser}
            className="px-8 py-3.5 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 text-red-500 font-bold uppercase tracking-widest text-xs transition-all duration-300"
          >
             Đăng xuất
          </button>
        </div>

      </div>
    </div>
  );
}
