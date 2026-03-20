"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getBannerSlider } from "@/api/apiBanner";
import { IMAGE_URL } from "@/api/config";
import { motion, AnimatePresence } from "framer-motion";

export default function Slider() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const data = await getBannerSlider();
        const banners = data.map((b) => ({
          image: b.image,
          title: b.name,
          desc: b.description ?? "",
          link: b.link ?? "#",
        }));
        setSlides(banners);
      } catch (err) {
        console.error("Lỗi lấy banner:", err);
      }
    }
    fetchBanner();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="h-[400px] md:h-[700px] bg-slate-50 dark:bg-slate-900/20 animate-pulse" />
    );
  }

  return (
    <section className="relative h-[450px] md:h-[750px] overflow-hidden bg-slate-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={
              slides[current].image
                ? `${IMAGE_URL}/banners/${slides[current].image}`
                : "/images/placeholder.jpg"
            }
            alt={slides[current].title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/20 to-transparent" />

          {/* Text Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="max-w-2xl space-y-6"
              >
                <span className="text-accent text-xs md:text-sm font-medium uppercase tracking-[0.4em] block">
                  Nghệ thuật chế tác thời gian
                </span>
                <h2 className="font-serif text-4xl md:text-7xl text-white leading-[1.1] tracking-wide">
                  {slides[current].title}
                </h2>
                {slides[current].desc && (
                  <p className="text-slate-300 text-sm md:text-lg font-light tracking-wider max-w-lg leading-relaxed">
                    {slides[current].desc}
                  </p>
                )}
                <div className="pt-4 flex items-center gap-8">
                  <a
                    href={slides[current].link}
                    className="group relative inline-flex items-center gap-4 text-white text-[11px] uppercase tracking-[0.3em] font-medium"
                  >
                    <span>Khám phá ngay</span>
                    <span className="w-12 h-[1px] bg-white/50 group-hover:w-20 group-hover:bg-accent transition-all duration-500"></span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute bottom-12 left-4 md:left-8 flex gap-4 items-center">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className="group py-4 px-1 focus:outline-none"
          >
            <div
              className={`h-[1px] transition-all duration-700 ${
                current === index ? "w-16 bg-accent" : "w-8 bg-white/30 group-hover:bg-white/60"
              }`}
            />
            <span className={`text-[10px] mt-2 block transition-all tracking-widest ${current === index ? 'text-white opacity-100' : 'text-white/40 opacity-0 group-hover:opacity-100'}`}>
              0{index + 1}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
