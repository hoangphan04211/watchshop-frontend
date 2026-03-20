"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllClientPosts } from "@/api/apiPost";
import { IMAGE_URL } from "@/api/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSlidersH, faArrowRight, faClock } from "@fortawesome/free-solid-svg-icons";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedTime, setSelectedTime] = useState("all");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllClientPosts()
      .then((data) => {
        const postsOnly = data.filter(p => p.post_type === 'post' && p.status !== 0);
        setPosts(postsOnly);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const topics = Array.from(new Set(posts.map(p => p.topic?.name))).filter(Boolean);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = selectedTopic === "all" || post.topic?.name === selectedTopic;

    let matchesTime = true;
    if (selectedTime !== "all") {
      const createdAt = new Date(post.created_at);
      const now = new Date();
      if (selectedTime === "today") {
        matchesTime = createdAt.toDateString() === now.toDateString();
      } else if (selectedTime === "this_week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        matchesTime = createdAt >= startOfWeek;
      } else if (selectedTime === "this_month") {
        matchesTime = createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
      }
    }

    return matchesSearch && matchesTopic && matchesTime;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (selectedSort === "newest") return new Date(b.created_at) - new Date(a.created_at);
    if (selectedSort === "oldest") return new Date(a.created_at) - new Date(b.created_at);
    return 0;
  });

  if (loading) return (
    <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-6">
      <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
      <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-medium">Đang chuẩn bị trang tạp chí...</p>
    </div>
  );

  const mainPost = sortedPosts[0];
  const sidePosts = sortedPosts.slice(1);

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-border/50 gap-8">
        <div className="space-y-4">
           <span className="text-accent text-[10px] uppercase tracking-[0.5em] font-medium transition-all">Góc nhìn WatchShop</span>
           <h1 className="font-serif text-4xl md:text-6xl text-foreground tracking-tight leading-tight uppercase">
             Tạp chí <br /> & Câu chuyện
           </h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-20 flex flex-wrap items-center gap-6">
        <div className="relative flex-1 min-w-[300px] group">
          <input
            type="text"
            placeholder="Tìm kiếm cảm hứng..."
            className="w-full bg-slate-50/50 dark:bg-slate-900/5 border-b border-border/50 px-10 py-4 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-xs transition-colors group-focus-within:text-accent" />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
             <select
                className="appearance-none bg-transparent border border-border/50 px-6 py-4 pr-12 text-[10px] font-medium uppercase tracking-[0.2em] text-foreground focus:outline-none focus:border-accent transition-all cursor-pointer"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                <option value="all">Tất cả chủ đề</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
              <FontAwesomeIcon icon={faSlidersH} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 text-[10px] pointer-events-none" />
          </div>

          <div className="relative group">
             <select
                className="appearance-none bg-transparent border border-border/50 px-6 py-4 pr-12 text-[10px] font-medium uppercase tracking-[0.2em] text-foreground focus:outline-none focus:border-accent transition-all cursor-pointer"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
              <FontAwesomeIcon icon={faClock} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 text-[10px] pointer-events-none" />
          </div>
        </div>
      </div>

      {sortedPosts.length > 0 ? (
        <div className="grid lg:grid-cols-12 gap-16 md:gap-24">
          {/* Main Featured Post */}
          <div className="lg:col-span-8">
            {mainPost && (
              <article className="group space-y-8">
                 <Link href={`/posts/${mainPost.slug}`} className="block relative aspect-[16/9] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                    <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 animate-pulse" />
                    {mainPost.image && (
                        <Image
                        src={`${IMAGE_URL}/posts/${mainPost.image}`}
                        alt={mainPost.title}
                        fill
                        className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                        />
                    )}
                    <div className="absolute inset-0 border border-inset border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 </Link>
                 
                 <div className="space-y-6">
                    <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em] text-accent">
                        <span>{mainPost.topic?.name || "Khai phóng"}</span>
                        <div className="w-1 h-1 bg-accent/30 rounded-full" />
                        <span className="text-muted-foreground">Phát hành: {new Date(mainPost.created_at).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <Link href={`/posts/${mainPost.slug}`} className="block space-y-4">
                        <h2 className="font-serif text-3xl md:text-5xl text-foreground tracking-tight leading-tight group-hover:text-accent transition-colors duration-500">
                            {mainPost.title}
                        </h2>
                        <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-2xl line-clamp-3">
                            Khám phá những góc nhìn sâu sắc nhất về di sản đồng hồ thế giới, nơi truyền thống giao thoa với tương lai của nghệ thuật chế tác tinh xảo...
                        </p>
                    </Link>
                    <Link href={`/posts/${mainPost.slug}`} className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-foreground hover:text-accent transition-colors group/link">
                        <span>Đọc tiếp</span>
                        <FontAwesomeIcon icon={faArrowRight} className="text-[8px] transition-transform group-hover/link:translate-x-2" />
                    </Link>
                 </div>
              </article>
            )}
          </div>

          {/* Sidebar / List Posts */}
          <div className="lg:col-span-4 space-y-16">
            <div className="space-y-8">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-foreground/40 border-b border-border/50 pb-6 italic">Bài viết nổi bật khác</h3>
                <div className="space-y-12">
                {sidePosts.map((post) => (
                    <article key={post.id} className="group space-y-4">
                       <div className="flex items-center gap-4 text-[8px] font-bold uppercase tracking-[0.2em] text-accent">
                            <span>{post.topic?.name || "Di sản"}</span>
                            <span className="text-muted-foreground/40">•</span>
                            <span className="text-muted-foreground/60">{new Date(post.created_at).toLocaleDateString("vi-VN")}</span>
                       </div>
                       <Link href={`/posts/${post.slug}`} className="block">
                          <h3 className="font-serif text-xl text-foreground tracking-wide group-hover:text-accent transition-colors duration-500 line-clamp-2 leading-relaxed">
                            {post.title}
                          </h3>
                       </Link>
                       <div className="w-8 h-[1px] bg-border/50 group-hover:w-full transition-all duration-700" />
                    </article>
                ))}
                {sidePosts.length === 0 && (
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest italic opacity-50">Đang cập nhật thêm...</p>
                )}
                </div>
            </div>
            
            <div className="p-8 border border-accent/20 bg-slate-50/50 dark:bg-slate-900/5 space-y-6">
                <h4 className="font-serif text-lg text-foreground">Bạn muốn nhận thông tin sớm nhất?</h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">Đăng ký nhận bản tin để không bỏ lỡ những câu chuyện thời gian độc bản.</p>
                <div className="relative">
                    <input type="email" placeholder="example@watchshop.vn" className="w-full bg-transparent border-b border-border/50 py-3 text-xs focus:outline-none focus:border-accent transition-colors" />
                    <button className="absolute right-0 top-1/2 -translate-y-1/2 text-accent text-[8px] uppercase tracking-widest font-bold">Gửi</button>
                </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-24 text-center border border-dashed border-border/50">
          <p className="text-muted-foreground font-medium uppercase tracking-[0.4em] text-[10px]">Kho lưu trữ trống hoặc không tìm thấy kết quả.</p>
        </div>
      )}
    </div>
  );
}
