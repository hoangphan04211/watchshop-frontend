"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllClientPosts } from "@/api/apiPost";
import { IMAGE_URL } from "@/api/config";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [currentTime, setCurrentTime] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedTime, setSelectedTime] = useState("all");
  const [selectedSort, setSelectedSort] = useState("newest");

  useEffect(() => {
    getAllClientPosts()
      .then((data) => {
        console.log("POST DATA", data);
        const postsOnly = data.filter(p => p.post_type === 'post' && p.status !== 0);
        setPosts(postsOnly);
      })
      .catch((err) => console.error(err));

    const timer = setInterval(() => {
      const vnTime = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
      setCurrentTime(vnTime);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Tạo danh sách topic có sẵn từ posts
  const topics = Array.from(new Set(posts.map(p => p.topic?.name))).filter(Boolean);

  // Filter trực tiếp trên client
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

  // Sort nếu cần
  const sortedPosts = filteredPosts.sort((a, b) => {
    if (selectedSort === "newest") return new Date(b.created_at) - new Date(a.created_at);
    if (selectedSort === "oldest") return new Date(a.created_at) - new Date(b.created_at);
    return 0;
  });

  const mainPost = sortedPosts[0];
  const sidePosts = sortedPosts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative">
      {/* Giờ Việt Nam góc trên phải */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-md text-sm text-gray-700">
        Asia/Ho_Chi_Minh: {currentTime}
      </div>

      <h1 className="text-4xl font-bold mb-6 text-center">Tin tức & Bài viết</h1>

      {/* Thanh search + filter */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        {/* Search */}
        <input
          type="text"
          placeholder="Tìm kiếm bài viết..."
          className="w-full sm:w-64 px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Lọc theo topic */}
        <select
          className="px-4 py-2 border rounded-lg shadow focus:outline-none"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="all">Tất cả chủ đề</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>

        {/* Lọc theo thời gian */}
        <select
          className="px-4 py-2 border rounded-lg shadow focus:outline-none"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          <option value="all">Tất cả thời gian</option>
          <option value="today">Hôm nay</option>
          <option value="this_week">Tuần này</option>
          <option value="this_month">Tháng này</option>
        </select>

        {/* Sắp xếp */}
        <select
          className="px-4 py-2 border rounded-lg shadow focus:outline-none"
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
        >
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>

      {/* Layout bài lớn trái + bài nhỏ phải */}
      <div className="lg:flex lg:space-x-6">
        {/* Bài lớn */}
        {mainPost && (
          <Link
            href={`/posts/${mainPost.slug}`}
            className="relative group block flex-1 overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition mb-6 lg:mb-0"
          >
            <div className="relative w-full h-80 rounded-xl overflow-hidden">
              {mainPost.image && (
                <Image
                  src={`${IMAGE_URL}/posts/${mainPost.image}`}
                  alt={mainPost.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-white/70 backdrop-blur-md p-4">
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600">{mainPost.title}</h2>
                <span className="text-gray-600 text-sm">
                  Ngày tạo: {new Date(mainPost.created_at).toLocaleString("vi-VN")}
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Các bài nhỏ */}
        <div className="flex-1 flex flex-col gap-4">
          {sidePosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="block bg-white/70 backdrop-blur-md rounded-lg shadow px-4 py-3 hover:bg-blue-50 transition"
            >
              <h3 className="font-medium text-gray-900 group-hover:text-blue-600">{post.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
