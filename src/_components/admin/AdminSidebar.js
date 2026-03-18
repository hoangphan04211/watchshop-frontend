"use client";
import Link from "next/link";
import {
  FaHome,
  FaBox,
  FaTags,
  FaShoppingCart,
  FaUsers,
  FaNewspaper,
  FaImages,
  FaCogs,
  FaWarehouse,
  FaClipboardList,
  FaListAlt,
  FaPhotoVideo,
  FaGift,
  FaComments,
} from "react-icons/fa";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-blue-700 text-white flex flex-col min-h-screen">
      {/* Logo / Brand */}
      <div className="p-6 font-bold text-2xl border-b border-blue-600">
        HoangWatch
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-800">
        <ul className="space-y-2 px-4 py-4">
          <li>
            <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-600">
              <FaBox /> <span>Sản phẩm</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/categories" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-600">
              <FaTags /> <span>Danh mục</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/store" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-600">
              <FaWarehouse /> <span>Kho</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-600">
              <FaShoppingCart /> <span>Đơn hàng</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-600">
              <FaUsers /> <span>Người dùng</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/posts" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-600">
              <FaNewspaper /> <span>Bài viết</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/contacts" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-600">
              <FaComments /> <span>Liên hệ</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/menus" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-600">
              <FaListAlt /> <span>Menu</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/sales" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-600">
              <FaGift /> <span>Khuyến mãi</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/topics" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-600">
              <FaNewspaper /> <span>Topic</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/banners" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-600">
              <FaImages /> <span>Banner</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-600">
              <FaCogs /> <span>Cài đặt</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
