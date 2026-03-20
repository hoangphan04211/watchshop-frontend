"use client";
import dynamic from "next/dynamic";

const Slider = dynamic(() => import("@/_components/site/Slider"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] md:h-[600px] border border-border/50 bg-white/50 dark:bg-slate-900/10" />
  ),
});

const ListCategory = dynamic(() => import("@/_components/site/ListCategory"), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 mt-24">
      <div className="h-8 w-56 bg-slate-200/60 dark:bg-slate-800/40 animate-pulse" />
      <div className="mt-8 h-44 border border-border/50 bg-white/50 dark:bg-slate-900/10" />
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
