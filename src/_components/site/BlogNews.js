'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { getNewPosts } from "@/api/apiPost";
import { IMAGE_URL } from "@/api/config";

export default function BlogNews() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getNewPosts(4);
        setPosts(data);
      } catch (err) {
        console.error("Lỗi lấy bài viết:", err);
      }
    }
    fetchPosts();
  }, []);

  if (posts.length === 0) {
    return (
      <section className="container mx-auto px-4 mt-32 mb-20">
        <div className="flex justify-center mb-12 pb-4">
          <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-wider uppercase text-center">
            Tạp chí đồng hồ
          </h3>
        </div>
        <p className="text-center text-zinc-500 font-medium">Đang tải bài viết...</p>
      </section>
    );
  }

  const mainPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <section className="container mx-auto px-4 mt-32 mb-20">
      <div className="flex justify-between items-end mb-12 border-b border-[var(--border)] pb-4">
        <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-wider uppercase">
          Tạp chí đồng hồ
        </h3>
        <a
          href="/posts"
          className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest"
        >
          Đọc thêm +
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Bài viết lớn bên trái */}
        <div className="group md:col-span-2 bg-white/90 dark:bg-zinc-950/40 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-[var(--border)] flex flex-col h-full overflow-hidden cursor-pointer">
          <div className="relative w-full h-[400px] overflow-hidden">
            <Image
              src={mainPost.image ? `${IMAGE_URL}/posts/${mainPost.image}` : "/images/placeholder.jpg"}
              alt={mainPost.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className="text-zinc-300 text-xs font-bold tracking-widest uppercase mb-3 block">Tin Nổi Bật</span>
              <h4 className="text-3xl font-bold text-white mb-4 leading-tight">{mainPost.title}</h4>
              <p className="text-zinc-300 text-sm line-clamp-2">{mainPost.description}</p>
            </div>
          </div>
        </div>

        {/* Các bài viết nhỏ bên phải */}
        <div className="flex flex-col gap-6 h-full">
          {otherPosts.map((item) => (
            <div
              key={item.id}
              className="group flex bg-white/90 dark:bg-zinc-950/40 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--border)] overflow-hidden flex-1 cursor-pointer"
            >
              <div className="relative w-32 md:w-40 h-full overflow-hidden shrink-0">
                <Image
                  src={item.image ? `${IMAGE_URL}/posts/${item.image}` : "/images/placeholder.jpg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5 flex flex-col justify-center flex-1">
                <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-base mb-2 line-clamp-2 group-hover:text-black dark:group-hover:text-white transition-colors">
                  {item.title}
                </h5>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-2 font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
