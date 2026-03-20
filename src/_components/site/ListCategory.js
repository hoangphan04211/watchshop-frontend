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
        return (
            <div className="container mx-auto px-4 mt-20 md:mt-32">
                <div className="h-40 bg-slate-50 dark:bg-slate-900/20 animate-pulse" />
            </div>
        );
    }

    return (
        <section className="container mx-auto px-4 mt-24 md:mt-32">
            <div className="text-center mb-16 space-y-4">
                <span className="text-accent text-[10px] md:text-xs font-medium uppercase tracking-[0.4em]">
                    Bộ sưu tập của chúng tôi
                </span>
                <h2 className="font-serif text-3xl md:text-5xl text-foreground tracking-wide">
                    Khám phá Tuyệt tác
                </h2>
                <div className="w-20 h-[1px] bg-accent/30 mx-auto mt-6"></div>
            </div>

            <Swiper
                modules={[Autoplay]}
                slidesPerView={2}
                breakpoints={{
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                    1280: { slidesPerView: 6 },
                }}
                spaceBetween={40}
                loop={true}
                speed={4000}
                autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                }}
                className="w-full"
            >
                {categories.map((cat, index) => (
                    <SwiperSlide key={index} className="pb-8">
                        <Link 
                            href={`/products?category=${cat.id}`} 
                            className="group flex flex-col items-center gap-6"
                        >
                            <div className="relative w-full aspect-square rounded-full overflow-hidden border border-border/50 bg-slate-50 dark:bg-slate-900/10 transition-all duration-700 group-hover:border-accent group-hover:shadow-2xl group-hover:shadow-accent/10">
                                <Image
                                    src={cat.image ? `${IMAGE_URL}/categories/${cat.image}` : "/images/placeholder.jpg"}
                                    alt={cat.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors duration-500" />
                            </div>
                            <div className="text-center">
                                <p className="font-serif text-base md:text-lg text-foreground hover:text-accent transition-colors duration-300 tracking-wide">
                                    {cat.name}
                                </p>
                                <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Xem ngay
                                </span>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
