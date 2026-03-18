export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bảng điều khiển</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-pink-600">Sản phẩm</h3>
          <p className="text-2xl font-bold">120</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-pink-600">Đơn hàng</h3>
          <p className="text-2xl font-bold">85</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-pink-600">Người dùng</h3>
          <p className="text-2xl font-bold">42</p>
        </div>
      </div>
    </div>
  );
}
