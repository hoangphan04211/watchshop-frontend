export default function InstructionsPage() {
  return (
    <section className="w-full min-h-screen bg-white py-20 px-4 mt-20">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-4xl font-black text-zinc-900 mb-4 tracking-wider uppercase">
          Hướng dẫn mua hàng
        </h1>
        <div className="space-y-4 text-zinc-600 font-medium leading-relaxed">
          <p>
            1) Chọn sản phẩm bạn muốn mua và thêm vào giỏ hàng.
          </p>
          <p>
            2) Vào trang giỏ hàng để kiểm tra số lượng và tổng tiền.
          </p>
          <p>
            3) Tiến hành thanh toán, điền thông tin nhận hàng và xác nhận đặt hàng.
          </p>
          <p>
            4) Theo dõi trạng thái đơn hàng trong mục Đơn hàng của bạn.
          </p>
        </div>
      </div>
    </section>
  );
}
