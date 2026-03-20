'use client';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20 md:py-32">
      <div className="max-w-5xl mx-auto space-y-24 md:space-y-32">
        {/* Hero Section */}
        <div className="space-y-8 text-center max-w-3xl mx-auto">
          <span className="text-accent text-[10px] uppercase tracking-[0.5em] font-medium">Bản sắc WatchShop</span>
          <h1 className="font-serif text-4xl md:text-7xl text-foreground tracking-tight leading-tight uppercase">
            Tuyệt tác <br /> thời gian & Di sản
          </h1>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-8" />
          <p className="text-lg text-muted-foreground font-medium italic leading-relaxed">
            "Nơi khởi nguồn của những giấc mơ xa xỉ, nơi mỗi nhịp đập của thời gian là một lời khẳng định cho đẳng cấp thượng lưu."
          </p>
        </div>

        {/* Brand Story */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="relative aspect-[4/5] bg-slate-100 dark:bg-slate-900 border border-border/50 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent z-10" />
            <div className="absolute inset-0 flex items-center justify-center p-12 transition-transform duration-1000 group-hover:scale-110">
               <span className="font-serif text-[12vw] md:text-[6rem] text-accent/10 select-none tracking-tighter">EST. 2024</span>
            </div>
            <div className="absolute inset-4 border border-white/10 pointer-events-none" />
          </div>
          <div className="space-y-10">
            <div className="space-y-4">
               <span className="text-accent text-[9px] uppercase tracking-[0.3em] font-semibold">Khởi nguồn</span>
               <h2 className="font-serif text-3xl md:text-4xl text-foreground capitalize">Câu chuyện của chúng tôi</h2>
            </div>
            <div className="space-y-6 text-muted-foreground text-sm font-medium leading-relaxed">
              <p>
                WatchShop không chỉ là một nền tảng thương mại điện tử đơn thuần. Chúng tôi ra đời từ niềm đam mê mãnh liệt đối với nghệ thuật chế tác đồng hồ cao cấp - những tuyệt tác được kết tinh từ trí tuệ và sự kiên nhẫn của con người.
              </p>
              <p>
                Với tâm thế của một người đồng hành tin cậy, chúng tôi cam kết mang đến những sản phẩm đạt tiêu chuẩn khắt khe nhất của Thụy Sĩ và các cường quốc đồng hồ trên thế giới. Mỗi chiếc đồng hồ trao đi là một lời hứa về sự minh bạch, đẳng cấp và dịch vụ hậu mãi xứng tầm.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid sm:grid-cols-3 gap-12 md:gap-16">
          {[
            { 
              title: "Chất lượng tuyệt đối", 
              desc: "Mọi sản phẩm đều trải qua quy trình kiểm định 12 bước nghiêm ngặt, đảm bảo tính nguyên bản 100%." 
            },
            { 
              title: "Dịch vụ độc quyền", 
              desc: "Chế độ chăm sóc Concierge Service 24/7, luôn song hành cùng trải nghiệm sở hữu của quý khách." 
            },
            { 
              title: "Tín thác trường tồn", 
              desc: "Minh bạch trong nguồn gốc, bảo mật tuyệt đối thông tin và quyền lợi của cộng đồng nhà sưu tập." 
            }
          ].map((item, i) => (
            <div key={i} className="space-y-6 group">
              <div className="w-10 h-[1px] bg-accent/30 group-hover:w-full transition-all duration-700" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">{item.title}</h3>
              <p className="text-xs text-muted-foreground font-medium leading-loose">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
