"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getClientPostBySlug } from "@/api/apiPost";
import { IMAGE_URL } from "@/api/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faUser, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function PostDetail() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            getClientPostBySlug(slug)
                .then((data) => setPost(data))
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [slug]);

    if (loading) return (
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-6">
            <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-medium">Đang mở trang di sản...</p>
        </div>
    );

    if (!post) return (
        <div className="container mx-auto px-4 py-32 text-center space-y-6">
            <h2 className="font-serif text-3xl text-foreground">Không tìm thấy câu chuyện</h2>
            <Link href="/posts" className="text-[10px] text-accent uppercase tracking-widest hover:underline underline-offset-4">Quay lại tạp chí</Link>
        </div>
    );

    return (
        <div className="bg-background min-h-screen">
            <article className="max-w-4xl mx-auto px-4 py-16 md:py-24 space-y-16">
                {/* Back Link */}
                <div className="mb-12">
                   <Link href="/posts" className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-accent transition-colors group">
                      <FontAwesomeIcon icon={faChevronLeft} className="text-[8px] transition-transform group-hover:-translate-x-1" />
                      Trở lại tuyển tập
                   </Link>
                </div>

                {/* Header Section */}
                <div className="space-y-10 text-center">
                    <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.4em] text-accent font-medium">
                        <span>Chương {post.id}</span>
                        <div className="w-8 h-[1px] bg-accent/30" />
                        <span>{post.topic?.name || "Khai văn"}</span>
                    </div>
                    <h1 className="font-serif text-4xl md:text-6xl text-foreground tracking-tight leading-tight uppercase">
                        {post.title}
                    </h1>
                    <div className="flex items-center justify-center gap-8 pt-4">
                        <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-muted-foreground font-medium">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-accent/40" />
                            <span>{new Date(post.created_at).toLocaleDateString("vi-VN")}</span>
                        </div>
                        {post.author && (
                            <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-muted-foreground font-medium">
                                <FontAwesomeIcon icon={faUser} className="text-accent/40" />
                                <span>Tác giả: {post.author}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Featured Image */}
                {post.image && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden grayscale contrast-125 border border-border/50">
                        <Image
                            src={`${IMAGE_URL}/posts/${post.image}`}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </div>
                )}

                {/* Content Section */}
                <div className="prose prose-slate dark:prose-invert max-w-none 
                    prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-foreground
                    prose-p:text-sm prose-p:font-medium prose-p:leading-loose prose-p:text-muted-foreground
                    prose-strong:text-foreground prose-strong:font-bold
                    prose-img:border prose-img:border-border/50 prose-img:mx-auto
                    prose-blockquote:border-l-accent prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-lg prose-blockquote:bg-slate-50/50 dark:prose-blockquote:bg-slate-900/5 prose-blockquote:py-4 prose-blockquote:px-8
                ">
                    <div 
                      className="drop-cap-serif"
                      dangerouslySetInnerHTML={{ __html: post.content }} 
                    />
                </div>

                {/* Footer Section */}
                <div className="pt-24 border-t border-border/50 flex flex-col items-center space-y-8">
                     <div className="text-center space-y-2">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em]">Kết thúc câu chuyện</p>
                        <p className="font-serif text-lg italic text-foreground">"Thời gian là thứ tài sản quý giá nhất của con người."</p>
                     </div>
                     <Link href="/posts" className="px-12 py-5 text-[10px] uppercase tracking-[0.4em] font-medium bg-foreground text-background hover:bg-accent hover:text-white transition-all duration-300">
                         Khám phá thêm
                     </Link>
                </div>
            </article>
        </div>
    );
}
