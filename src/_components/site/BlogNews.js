"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getNewPosts } from "@/api/apiPost";
import { IMAGE_URL } from "@/api/config";

export default function BlogNews() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getNewPosts(4);
        setPosts(data);
      } catch (err) {
        console.error("Lỗi lấy bài viết:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 mt-24">
        <div className="h-40 bg-slate-50 dark:bg-slate-900/20 animate-pulse" />
      </section>
    );
  }

  if (posts.length === 0) return null;

  const mainPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <section className="container mx-auto px-4 mt-32 mb-32">
      <div className="text-center mb-16 space-y-3">
        <span className="text-accent text-[10px] md:text-xs font-medium uppercase tracking-[0.4em]">
          Thế giới cơ khí & Nghệ thuật
          </span>
        <h2 className="font-serif text-3xl md:text-5xl text-foreground tracking-wide">
          Tạp chí Hoang Watch
        </h2>
        <div className="w-20 h-[1px] bg-accent/30 mx-auto mt-6"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Post */}
        <div className="lg:col-span-8 group">
          <Link href={`/posts/${mainPost.slug || mainPost.id}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-900/20">
            <Image
              src={mainPost.image ? `${IMAGE_URL}/posts/${mainPost.image}` : "/images/placeholder.jpg"}
              alt={mainPost.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors duration-500" />
          </Link>
          <div className="mt-8 space-y-4">
            <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-medium">
              Tin nổi bật / {new Date().toLocaleDateString("vi-VN")}
            </span>
            <Link href={`/posts/${mainPost.slug || mainPost.id}`} className="block">
              <h3 className="font-serif text-2xl md:text-4xl text-foreground group-hover:text-accent transition-colors duration-300 leading-tight">
                {mainPost.title}
              </h3>
            </Link>
            <p className="text-muted-foreground text-sm md:text-base font-light leading-relaxed line-clamp-2 max-w-3xl">
              {mainPost.description}
            </p>
            <Link 
              href={`/posts/${mainPost.slug || mainPost.id}`}
              className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-medium text-foreground hover:text-accent transition-colors"
            >
              <span>Đọc tiếp</span>
              <span className="w-8 h-[1px] bg-accent"></span>
            </Link>
          </div>
        </div>

        {/* Sidebar Posts */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          {otherPosts.map((item) => (
            <div key={item.id} className="group grid grid-cols-3 gap-6">
              <Link href={`/posts/${item.slug || item.id}`} className="block relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900/10">
                <Image
                  src={item.image ? `${IMAGE_URL}/posts/${item.image}` : "/images/placeholder.jpg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </Link>
              <div className="col-span-2 space-y-2">
                <span className="text-[9px] text-muted-foreground uppercase tracking-[0.2em]">Journal</span>
                <Link href={`/posts/${item.slug || item.id}`} className="block">
                  <h4 className="font-serif text-base text-foreground group-hover:text-accent transition-colors duration-300 line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                </Link>
                <div className="pt-1">
                   <Link href={`/posts/${item.slug || item.id}`} className="text-[9px] uppercase tracking-widest text-accent font-medium hover:underline decoration-accent/30 underline-offset-4">
                      Chi tiết
                   </Link>
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-auto pt-8 border-t border-border">
            <Link
              href="/posts"
              className="block w-full text-center py-4 border border-border text-[10px] uppercase tracking-[0.4em] font-medium text-foreground hover:bg-foreground hover:text-background transition-all duration-500"
            >
              Xem tất cả bài viết
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
