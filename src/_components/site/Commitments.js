"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTruckFast,
  faShieldAlt,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function Commitments() {
  return (
    <section className="container mx-auto px-4 py-20 border-t border-[var(--border)] mt-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { icon: faCheckCircle, text: "100% Hàng chính hãng", desc: "Cam kết chất lượng chuẩn Thụy Sĩ" },
          { icon: faTruckFast, text: "Miễn phí vận chuyển", desc: "Giao hàng hỏa tốc toàn quốc" },
          { icon: faShieldAlt, text: "Bảo hành 5 năm", desc: "Chế độ bảo hành tiêu chuẩn quốc tế" },
          { icon: faExchangeAlt, text: "Hỗ trợ đổi trả", desc: "Đổi mới dễ dàng trong 7 ngày" },
        ].map((item, index) => (
          <div
            key={index}
            className="group flex flex-col items-center bg-white/90 dark:bg-zinc-950/40 rounded-3xl p-8 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors duration-300 border border-[var(--border)]"
          >
            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-950 transition-all duration-300">
              <FontAwesomeIcon
                icon={item.icon}
                className="text-zinc-800 dark:text-zinc-200 text-2xl transition-colors duration-300 group-hover:text-white dark:group-hover:text-zinc-950"
              />
            </div>
            <h4 className="font-black text-zinc-900 dark:text-zinc-100 text-sm uppercase tracking-widest mb-2">{item.text}</h4>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
