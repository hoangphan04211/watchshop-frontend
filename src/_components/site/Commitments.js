"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTruckFast,
  faShieldAlt,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function Commitments() {
  const items = [
    { icon: faCheckCircle, text: "Tuyệt tác Chính hãng", desc: "Cam kết 100% chuẩn xuất xứ Thụy Sĩ & Quốc tế" },
    { icon: faTruckFast, text: "Giao hàng Đặc quyền", desc: "Vận chuyển an toàn, hỏa tốc tới tận tay quý khách" },
    { icon: faShieldAlt, text: "Bảo hành 5 Năm", desc: "Tiêu chuẩn bảo dưỡng nghiêm ngặt toàn cầu" },
    { icon: faExchangeAlt, text: "Đổi trả Linh hoạt", desc: "Quy trình đơn giản, bảo vệ quyền lợi tối đa" },
  ];

  return (
    <section className="container mx-auto px-4 py-24 border-t border-border mt-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
        {items.map((item, index) => (
          <div
            key={index}
            className="group flex flex-col items-center text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full border border-border/50 flex items-center justify-center text-accent/60 group-hover:text-accent group-hover:border-accent transition-all duration-500 bg-slate-50 dark:bg-slate-900/10">
              <FontAwesomeIcon icon={item.icon} className="text-xl" />
            </div>
            <div className="space-y-3">
                <h4 className="font-serif text-base md:text-lg text-foreground tracking-wide group-hover:text-accent transition-colors">
                {item.text}
                </h4>
                <p className="text-muted-foreground text-[10px] md:text-xs font-light uppercase tracking-[0.1em] border-t border-border/50 pt-3 inline-block">
                {item.desc}
                </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
