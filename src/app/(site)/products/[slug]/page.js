'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getProductBySlug } from "@/api/apiProduct";
import { toast } from "react-hot-toast";
import { IMAGE_URL } from "@/api/config";
import { useCartApi } from "@/api/apiCart";
import ProductCard from "@/_components/ui/ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faShieldHalved, faTruckFast, faRotateLeft } from "@fortawesome/free-solid-svg-icons";

export default function ProductDetail() {
  const { slug } = useParams();
  const [productData, setProductData] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const [thumbImages, setThumbImages] = useState([]);
  const [updating, setUpdating] = useState(false);

  const { addToCart } = useCartApi();

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const data = await getProductBySlug(slug);
        setProductData(data);
        const allImages = [data.product, ...(data.product.images || [])];
        setMainImage(allImages[0]);
        setThumbImages(allImages.slice(1));
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return (
    <div className="container mx-auto px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="aspect-square bg-slate-50 dark:bg-slate-900/20 animate-pulse" />
        <div className="space-y-8">
          <div className="h-12 bg-slate-50 dark:bg-slate-900/20 animate-pulse w-3/4" />
          <div className="h-6 bg-slate-50 dark:bg-slate-900/20 animate-pulse w-1/4" />
          <div className="h-32 bg-slate-50 dark:bg-slate-900/10 animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (!productData) return <div className="p-20 text-center font-serif text-xl border-t border-border">Tuyệt tác không còn tồn tại hoặc đã được di chuyển.</div>;

  const { product, related } = productData;

  const groupedAttributes =
    product.attributes?.reduce((acc, attr) => {
      if (!acc[attr.name]) acc[attr.name] = [];
      if (!acc[attr.name].includes(attr.value)) acc[attr.name].push(attr.value);
      return acc;
    }, {}) || {};

  const handleSelectAttr = (name, value) => {
    setSelectedAttributes((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeQty = (newQty) => {
    if (newQty < 1) return;
    if (newQty > 20) newQty = 20;
    setQty(newQty);
  };

  const handleAddToCart = async () => {
    if (product.stock <= 0) {
      toast.error("Tuyệt tác này hiện đang tạm hết.");
      return;
    }
    if (qty > product.stock) {
      toast.error(`Chỉ còn ${product.stock} sản phẩm sẵn có.`);
      return;
    }

    const requiredAttrs = Object.keys(groupedAttributes);
    for (let attr of requiredAttrs) {
      if (!selectedAttributes[attr]) {
        toast.error(`Vui lòng chọn ${attr.toLowerCase()}.`);
        return;
      }
    }

    setUpdating(true);
    try {
      await addToCart(product.id, qty, selectedAttributes);
      toast.success("Đã thêm vào bộ sưu tập của bạn.");
    } catch (err) {
      console.error(err);
      toast.error("Không thể thêm vào giỏ hàng.");
    } finally {
      setUpdating(false);
    }
  };

  const swapImage = (img) => {
    if (img.id === mainImage.id) return;
    const newThumbs = thumbImages.filter((i) => i.id !== img.id);
    newThumbs.push(mainImage);
    setMainImage(img);
    setThumbImages(newThumbs);
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-32">
        {/* Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-900/10 group">
            <Image
              src={mainImage.url || `${IMAGE_URL}/products/${mainImage.image}`}
              alt={product.name}
              fill
              className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
              priority
            />
            {product.price_sale && (
              <div className="absolute top-6 left-6 bg-accent text-white text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 font-medium">
                Ưu đãi
              </div>
            )}
          </div>
          {thumbImages.length > 0 && (
            <div className="grid grid-cols-5 gap-4">
              {thumbImages.map((img) => (
                <div
                  key={img.id}
                  onClick={() => swapImage(img)}
                  className="relative aspect-square cursor-pointer border border-border/50 hover:border-accent transition-colors bg-slate-50/50 dark:bg-slate-900/5 group"
                >
                  <Image
                    src={img.url || `${IMAGE_URL}/products/${img.image}`}
                    alt={product.name}
                    fill
                    className="object-contain p-2 grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <span className="text-accent text-xs font-medium uppercase tracking-[0.4em]">
              {product.category?.name || "Bộ sưu tập"}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-tight tracking-wide">
              {product.name}
            </h1>
            <div className="flex items-center gap-6 pt-2">
              {product.price_sale ? (
                <>
                  <span className="text-accent text-2xl md:text-3xl font-serif">
                    {product.price_sale.toLocaleString()}₫
                  </span>
                  <span className="text-muted-foreground text-sm line-through decoration-slate-400/50">
                    {product.price.toLocaleString()}₫
                  </span>
                </>
              ) : (
                <span className="text-foreground text-2xl md:text-3xl font-serif">
                  {product.price.toLocaleString()}₫
                </span>
              )}
            </div>
          </div>

          <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base border-t border-border/50 pt-8">
            {product.description || "Một tuyệt tác thời gian hội tụ đầy đủ những tinh hoa về thẩm mỹ và độ bền bỉ vượt thời gian."}
          </p>

          <div className="space-y-8">
            {/* Attributes */}
            {Object.entries(groupedAttributes).map(([name, values]) => (
              <div key={name} className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground">{name}</h3>
                <div className="flex gap-4 flex-wrap">
                  {values.map((val) => {
                    const selected = selectedAttributes[name] === val;
                    return (
                      <button
                        key={val}
                        onClick={() => handleSelectAttr(name, val)}
                        className={`px-6 py-2.5 text-[10px] uppercase tracking-widest border transition-all duration-300 ${selected ? "border-accent text-accent bg-accent/5" : "border-border text-foreground hover:border-accent"}`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Qty & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <div className="flex items-center border border-border w-fit">
                <button
                  onClick={() => handleChangeQty(qty - 1)}
                  className="w-12 h-12 flex items-center justify-center text-muted-foreground hover:text-accent transition-colors disabled:opacity-30"
                  disabled={updating || qty <= 1}
                ><FontAwesomeIcon icon={faMinus} className="text-[10px]" /></button>
                <span className="w-12 text-center text-xs font-medium">{qty}</span>
                <button
                  onClick={() => handleChangeQty(qty + 1)}
                  className="w-12 h-12 flex items-center justify-center text-muted-foreground hover:text-accent transition-colors disabled:opacity-30"
                  disabled={updating || qty >= 20 || qty >= product.stock}
                ><FontAwesomeIcon icon={faPlus} className="text-[10px]" /></button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || updating}
                className="flex-1 bg-foreground text-background py-4 px-8 text-[10px] uppercase tracking-[0.4em] font-medium transition-all hover:bg-accent hover:text-white disabled:opacity-40"
              >
                {updating ? "Đang xử lý..." : product.stock <= 0 ? "Tạm hết hàng" : "Thêm vào bộ sưu tập"}
              </button>
            </div>
          </div>

          {/* Commitments mini */}
          <div className="grid grid-cols-3 gap-4 pt-10 border-t border-border/50">
            <div className="flex flex-col items-center text-center space-y-2 group">
              <FontAwesomeIcon icon={faShieldHalved} className="text-accent/40 text-sm group-hover:text-accent transition-colors" />
              <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">Bảo hành 5 năm</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 group">
              <FontAwesomeIcon icon={faTruckFast} className="text-accent/40 text-sm group-hover:text-accent transition-colors" />
              <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">Giao hàng hỏa tốc</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 group">
              <FontAwesomeIcon icon={faRotateLeft} className="text-accent/40 text-sm group-hover:text-accent transition-colors" />
              <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">Đổi trả 7 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related?.length > 0 && (
        <section className="space-y-16 pt-24 border-t border-border/50">
          <div className="text-center space-y-3">
            <span className="text-accent text-[10px] uppercase tracking-[0.3em]">Có thể quý khách quan tâm</span>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground">Sản phẩm tương tự</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
