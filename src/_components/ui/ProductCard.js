"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faEye } from "@fortawesome/free-solid-svg-icons";
import { IMAGE_URL } from "@/api/config";
import slugify from "slugify";

export default function ProductCard({ product, showSaleBadge = false, showNewBadge = false }) {
  const isOutOfStock = product.stock === 0;
  const hasDiscount = product.price_sale && product.price_sale < product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price_sale / product.price) * 100)
    : 0;

  const productLink = `/products/${product.slug || slugify(product.name, { lower: true })}`;

  return (
    <div className="group relative flex flex-col bg-background border border-border/50 overflow-hidden transition-all duration-500 hover:border-accent/30">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {isOutOfStock && (
          <span className="bg-slate-900 text-white text-[9px] font-medium px-2 py-1 uppercase tracking-[0.2em]">
            Hết hàng
          </span>
        )}
        {showNewBadge && !isOutOfStock && (
          <span className="bg-accent text-white text-[9px] font-medium px-2 py-1 uppercase tracking-[0.2em]">
            NEW
          </span>
        )}
        {hasDiscount && !isOutOfStock && (
          <span className="bg-foreground text-background text-[9px] font-medium px-2 py-1 uppercase tracking-[0.2em]">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Image Wrapper */}
      <Link href={productLink} className="relative aspect-[4/5] overflow-hidden bg-slate-50 dark:bg-slate-900/20">
        <Image
          src={
            product.image
              ? `${IMAGE_URL}/products/${product.image}`
              : product.image_url
                ? product.image_url
                : "/images/placeholder.jpg"
          }
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-1000 group-hover:scale-110 ${isOutOfStock ? "opacity-40 grayscale" : ""
            }`}
        />

        {/* Overlay Action */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <span className="px-6 py-2 bg-white text-slate-900 text-[10px] font-medium uppercase tracking-[0.2em] shadow-2xl">
              Khám phá
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 md:p-5 flex flex-col items-center text-center">
        <div className="mb-1 md:mb-2">
          <span className="text-[8px] md:text-[9px] font-medium text-accent uppercase tracking-[0.2em] md:tracking-[0.3em]">
            {product.category_name || product.category?.name || "Collection"}
          </span>
        </div>

        <Link href={productLink} className="mb-2 md:mb-3">
          <h3 className="font-serif text-sm md:text-lg text-foreground group-hover:text-accent transition-colors duration-300 line-clamp-1 leading-tight tracking-wide">
            {product.name}
          </h3>
        </Link>

        <div className="flex flex-col items-center gap-0.5 md:gap-1">
          {hasDiscount ? (
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
              <span className="text-muted-foreground text-[10px] md:text-xs line-through tracking-wider">
                {Number(product.price).toLocaleString()}₫
              </span>
              <span className="text-foreground font-medium text-xs md:text-base tracking-widest">
                {Number(product.price_sale).toLocaleString()}₫
              </span>
            </div>
          ) : (
            <span className="text-foreground font-medium text-xs md:text-base tracking-widest">
              {Number(product.price).toLocaleString()}₫
            </span>
          )}

        </div>
      </div>
    </div>
  );
}
