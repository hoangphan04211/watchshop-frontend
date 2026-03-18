"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import dynamic from "next/dynamic";

const Slider = dynamic(() => import("@/_components/site/Slider"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] md:h-[600px] rounded-3xl border border-[var(--border)] bg-white/50 dark:bg-zinc-950/30 animate-pulse" />
  ),
});

const ListCategory = dynamic(() => import("@/_components/site/ListCategory"), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 mt-24">
      <div className="h-8 w-56 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
      <div className="mt-8 h-44 rounded-3xl border border-[var(--border)] bg-white/50 dark:bg-zinc-950/30 animate-pulse" />
    </div>
  ),
});

const ProductNew = dynamic(() => import("@/_components/site/ProductNew"), {
  ssr: false,
});
const ProductSale = dynamic(() => import("@/_components/site/ProductSale"), {
  ssr: false,
});
const BlogNews = dynamic(() => import("@/_components/site/BlogNews"), {
  ssr: false,
});
const ContactForm = dynamic(() => import("@/_components/site/ContactsForm"), {
  ssr: false,
});
const Commitments = dynamic(() => import("@/_components/site/Commitments"), {
  ssr: false,
});

export default function HomePage() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    const t = setTimeout(() => AOS.refresh(), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-20">
      <Slider />
      <ListCategory />
      <ProductNew />
      <ProductSale />
      <BlogNews />
      <ContactForm />
      <Commitments />
    </div>
  );
}
