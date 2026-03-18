"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPenToSquare,
  faEye,
  faToggleOn,
  faToggleOff,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { getPosts, deletePost } from "@/api/apiPost";
import { IMAGE_URL } from "@/api/config";
import { toast } from "react-toastify";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal xóa
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // load posts
  async function fetchData() {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      toast.error("Lỗi khi tải bài viết");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // mở modal xác nhận
  const confirmDelete = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  // thực hiện xóa
  const handleDelete = async () => {
    try {
      await deletePost(selectedPost.id);
      toast.success(`Đã xóa bài viết: ${selectedPost.title}`);
      fetchData(); // reload lại list
    } catch (error) {
      toast.error("Không thể xóa bài viết");
    } finally {
      setShowModal(false);
      setSelectedPost(null);
    }
  };

  if (loading) return <p className="p-6">Đang tải bài viết...</p>;

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Bài viết</h1>
        <div className="space-x-3">
          <Link
            href="/admin/posts/trash"
            className="px-4 py-2 bg-gray-100 rounded-lg shadow hover:bg-gray-200 text-gray-700 font-medium"
          >
            <FontAwesomeIcon icon={faTrashCan} className="mr-2" />
            Thùng rác
          </Link>
          <Link
            href="/admin/posts/create"
            className="px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 font-medium"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Thêm mới
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Ảnh</th>
              <th className="px-4 py-3">Tiêu đề</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{post.id}</td>
                  <td className="px-4 py-3">
                    {post.image ? (
                      <Image
                        src={`${IMAGE_URL}/posts/${post.image}`}
                        alt={post.title}
                        width={80}
                        height={80}
                        className="w-20 h-15 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-15 bg-gray-100 flex items-center justify-center rounded-md">
                        <span className="text-gray-400 text-xs">No Img</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {post.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{post.post_type}</td>
                  <td className="px-4 py-3">
                    {post.status === 1 ? (
                      <FontAwesomeIcon
                        icon={faToggleOn}
                        className="text-green-500 text-xl"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faToggleOff}
                        className="text-gray-400 text-xl"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center space-x-3">
                    {/* Xem chi tiết */}
                    <Link href={`/admin/posts/${post.id}`}>
                      <button className="text-blue-500 hover:text-blue-700">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </Link>

                    {/* Sửa */}
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <button className="text-yellow-500 hover:text-yellow-700">
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    </Link>

                    {/* Xóa */}
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => confirmDelete(post)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  Không có bài viết nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal xác nhận xóa */}
      {showModal && selectedPost && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Bạn có chắc muốn xóa bài viết{" "}
              <span className="text-red-600">{selectedPost.title}</span>?
            </h2>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
