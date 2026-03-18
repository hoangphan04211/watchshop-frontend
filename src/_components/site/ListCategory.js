"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { getCategories } from "@/api/apiCategory";
import { IMAGE_URL } from "@/api/config";
import Link from "next/link";

import "swiper/css";

export default function CategoryCarousel() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCategories(20)
            .then((data) => {
                setCategories(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p className="text-center">Đang tải danh mục...</p>;
    }

    return (
        <section className="container mx-auto px-4 mt-24">
            <div className="flex justify-between items-end mb-10 border-b border-[var(--border)] pb-4">
                <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-wider uppercase">
                    Danh mục nổi bật
                </h3>
            </div>

            <Swiper
                modules={[Autoplay]}
                slidesPerView={2}
                breakpoints={{
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                }}
                spaceBetween={20}
                loop={true}
                speed={3000}
                autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                    reverseDirection: true,
                }}
                className="w-full !py-4"
            >
                {categories.map((cat, index) => (
                    <SwiperSlide key={index}>
                        <Link href={`/products?category=${cat.id}`} className="group flex flex-col items-center">
                            <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden mb-4 border border-[var(--border)] shadow-md transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl relative bg-white/90 dark:bg-zinc-950/40">
                                <Image
                                    src={cat.image ? `${IMAGE_URL}/categories/${cat.image}` : "/images/placeholder.jpg"}
                                    alt={cat.name}
                                    width={200}
                                    height={200}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>
                            <p className="text-zinc-800 dark:text-zinc-100 text-lg font-semibold text-center uppercase tracking-widest text-sm transition-colors group-hover:text-black dark:group-hover:text-white">
                                {cat.name}
                            </p>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
