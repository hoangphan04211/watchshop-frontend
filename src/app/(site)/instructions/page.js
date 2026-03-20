export default function InstructionsPage() {
  const steps = [
    { num: "01", title: "Khám phá Tuyệt tác", desc: "Duyệt qua bộ sưu tập đồng hồ Thụy Sĩ tinh hoa và thêm những cỗ máy thời gian ưng ý nhất vào giỏ hàng của quý khách." },
    { num: "02", title: "Kiểm duyệt Lựa chọn", desc: "Truy cập giỏ hàng để rà soát kỹ lưỡng số lượng, thuộc tính và tổng giá trị đơn hàng trước khi tiến hành bước tiếp theo." },
    { num: "03", title: "Xác nhận Đặc quyền", desc: "Cung cấp thông tin vận chuyển và phương thức thanh toán. Hệ thống bảo mật của chúng tôi sẽ bảo vệ mọi dữ liệu của quý khách." },
    { num: "04", title: "Theo dõi Hành trình", desc: "Sau khi đặt hàng, quý khách có thể theo dõi trạng thái vận chuyển hỏa tốc ngay tại mục Lịch sử đơn hàng cá nhân." },
  ];

  return (
    <section className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
      <div className="text-center mb-24 space-y-4">
        <span className="text-accent text-[10px] md:text-xs font-medium uppercase tracking-[0.4em]">
          Trải nghiệm đẳng cấp
        </span>
        <h1 className="font-serif text-4xl md:text-6xl text-foreground tracking-tight uppercase">
          Hướng dẫn mua hàng
        </h1>
        <div className="w-20 h-[1px] bg-accent/30 mx-auto mt-6"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
        {steps.map((step) => (
          <div key={step.num} className="group space-y-6">
            <div className="flex items-baseline gap-6">
              <span className="font-serif text-4xl md:text-6xl text-accent/20 group-hover:text-accent transition-colors duration-700 italic">
                {step.num}
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-foreground tracking-wide group-hover:text-accent transition-colors">
                {step.title}
              </h2>
            </div>
            <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base border-l border-border/50 pl-6 group-hover:border-accent transition-colors">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-24 p-12 border border-border/50 bg-slate-50/50 dark:bg-slate-900/10 text-center space-y-8">
         <p className="font-serif text-xl italic text-foreground tracking-wide">
           "Mỗi chiếc đồng hồ không chỉ là công cụ đo đếm thời gian, mà là một di sản tinh hoa."
         </p>
         <div className="pt-4">
            <a href="/products" className="inline-block px-12 py-5 bg-foreground text-background text-[10px] uppercase tracking-[0.4em] font-medium hover:bg-accent hover:text-white transition-all duration-500 shadow-xl shadow-black/5">
                Bắt đầu trải nghiệm ngay
            </a>
         </div>
      </div>
    </section>
  );
}

