import api from "./axios";

// Hook dùng API Checkout
export const useCheckoutApi = () => {
    // Gửi thông tin đặt hàng
    const checkout = async (formData) => {
        return await api.post("/checkout", formData);
    };

    return { checkout };
};

export const useOrderHistoryApi = () => {
    // Lấy lịch sử đơn hàng của user
    const getOrderHistory = async () => {
        // Route Laravel: /api/orders/history
        return await api.get("/orders/history");
    };

    return { getOrderHistory };
};

// === API Chi tiết đơn hàng ===
export const useOrderDetailApi = () => {
    // Lấy chi tiết đơn hàng theo ID
    const getOrderDetail = async (orderId) => {
        // Route Laravel: /api/orders/detail/{id}
        return await api.get(`/orders/detail/${orderId}`);
    };

    return { getOrderDetail };
};