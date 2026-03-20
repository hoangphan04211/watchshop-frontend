'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { getProfile, logoutUser } from "@/api/apiUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem, faHistory, faSignOutAlt, faUserEdit } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

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

  if (loading) return (
    <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-6">
      <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
      <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-medium">Đang chuẩn bị hồ sơ...</p>
    </div>
  );

  if (!profile) return null;

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
       {/* Profile Header */}
       <div className="flex flex-col md:flex-row items-center md:items-end gap-10 md:gap-16 pb-16 border-b border-border/50">
          <div className="relative group">
             <div className="absolute -inset-4 border border-accent/10 scale-95 group-hover:scale-100 transition-transform duration-700" />
             <div className="relative w-40 h-40 md:w-56 md:h-56 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <Image
                  src={profile.avatar || "/images/placeholder.jpg"}
                  alt={profile.name}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
             </div>
             <div className="absolute -bottom-4 -right-4 bg-accent text-white w-12 h-12 flex items-center justify-center shadow-xl">
                 <FontAwesomeIcon icon={faGem} className="text-xs" />
             </div>
          </div>

          <div className="text-center md:text-left flex-1 space-y-6">
             <div className="space-y-2">
                <span className="text-accent text-[10px] uppercase tracking-[0.5em] font-medium">Chào mừng trở lại</span>
                <h1 className="font-serif text-4xl md:text-6xl text-foreground tracking-tight capitalize">{profile.name}</h1>
             </div>
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <span className="text-[9px] uppercase tracking-[0.2em] font-medium px-4 py-2 border border-border/50 text-muted-foreground">
                   {profile.roles === 'customer' ? 'Thành viên ưu tú' : profile.roles}
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-medium px-4 py-2 bg-accent/5 text-accent border border-accent/10">
                   Hạng Platinum
                </span>
             </div>
          </div>
       </div>

       {/* Profile Content */}
       <div className="grid lg:grid-cols-12 gap-16 md:gap-24 pt-16">
          <div className="lg:col-span-5 space-y-12">
             <div className="space-y-8">
                <h3 className="text-[11px] uppercase tracking-[0.4em] font-medium text-foreground border-b border-border/50 pb-6">Thông tin cá nhân</h3>
                <div className="space-y-8">
                   <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Họ và tên</p>
                      <p className="font-serif text-xl text-foreground">{profile.name}</p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Địa chỉ thư điện tử</p>
                      <p className="text-sm text-foreground tracking-wide">{profile.email}</p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Số điện thoại</p>
                      <p className="text-sm text-foreground tracking-wide">{profile.phone || 'Chưa cập nhật'}</p>
                   </div>
                </div>
             </div>

             <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <Link
                  href="/profile/edit"
                  className="flex-1 py-4 text-[10px] uppercase tracking-[0.3em] font-medium bg-foreground text-background hover:bg-accent hover:text-white transition-all duration-300 text-center flex items-center justify-center gap-3"
                >
                   <FontAwesomeIcon icon={faUserEdit} className="text-[9px]" />
                   Sửa hồ sơ
                </Link>
                <button
                  onClick={logoutUser}
                  className="flex-1 py-4 text-[10px] uppercase tracking-[0.3em] font-medium border border-border/50 text-foreground hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 flex items-center justify-center gap-3"
                >
                   <FontAwesomeIcon icon={faSignOutAlt} className="text-[9px]" />
                   Đăng xuất
                </button>
             </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
             <div className="flex justify-between items-baseline border-b border-border/50 pb-6">
                <h3 className="text-[11px] uppercase tracking-[0.4em] font-medium text-foreground">Lịch sử giao dịch</h3>
                <FontAwesomeIcon icon={faHistory} className="text-accent/40 text-xs" />
             </div>

             {profile.recent_orders?.length > 0 ? (
                <div className="space-y-8">
                   {profile.recent_orders.map((order) => (
                      <div key={order.order_id} className="group flex justify-between items-center p-6 border border-border/50 hover:border-accent/30 transition-all duration-500">
                         <div className="space-y-2">
                            <span className="text-[10px] font-medium uppercase tracking-widest text-accent">Đơn hàng #{order.order_id}</span>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{new Date().toLocaleDateString("vi-VN")}</p>
                         </div>
                         <div className="text-right space-y-2">
                            <p className="font-serif text-lg text-foreground">
                               {order.total_amount.toLocaleString('vi-VN')}₫
                            </p>
                            <span className="inline-block text-[8px] uppercase tracking-[0.2em] font-medium px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-border/50 text-foreground">
                               {order.status_text}
                            </span>
                         </div>
                      </div>
                   ))}
                </div>
             ) : (
                <div className="py-20 text-center space-y-4 border border-dashed border-border/50">
                   <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em]">Danh sách đơn hàng trống</p>
                   <Link href="/products" className="text-[9px] text-accent uppercase tracking-widest hover:underline underline-offset-4">Bắt đầu mua sắm ngay</Link>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}
