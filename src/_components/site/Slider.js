"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getBannerSlider } from "@/api/apiBanner";
import { IMAGE_URL } from "@/api/config";

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
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="h-64 md:h-[500px] flex items-center justify-center">
        <span>Đang tải banner...</span>
      </div>
    );
  }

  return (
    <section className="relative h-[300px] md:h-[600px] md:rounded-3xl overflow-hidden shadow-2xl border border-[var(--border)] bg-white/30 dark:bg-zinc-950/30">
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src={
                slides[current].image
                  ? `${IMAGE_URL}/banners/${slides[current].image}`
                  : "/images/placeholder.jpg"
              }
              alt={slides[current].title}
              fill
              style={{ objectFit: "cover" }}
              priority={current === 0}
              loading={current === 0 ? "eager" : "lazy"}
            />
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Text overlay */}
            <div className="absolute bottom-10 left-4 md:bottom-12 md:left-16 bg-white/10 dark:bg-zinc-950/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 md:px-8 py-5 md:py-6 max-w-2xl">
              <motion.h2
                key={slides[current].title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="text-3xl md:text-5xl font-black text-white leading-tight tracking-wide"
              >
                {slides[current].title}
              </motion.h2>

              {slides[current].desc && (
                <motion.p
                  key={slides[current].desc}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  className="text-zinc-200 text-lg md:text-xl font-light mt-3"
                >
                  {slides[current].desc}
                </motion.p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 right-6 md:right-16 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              current === index ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/60"
            }`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </section>
  );
}
