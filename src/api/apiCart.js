import api from "./axios";

// Hook dùng API giỏ hàng
export const useCartApi = () => {


    // Lấy giỏ hàng
    const getCart = async () => {
        return await api.get("/cart");
    };

    // Thêm sản phẩm
    const addToCart = async (productId, qty = 1, attributes = {}) => {
        return await api.post("/cart/add", { product_id: productId, qty, attributes });
    };

    // Cập nhật số lượng
    const updateCart = async (cartDetailId, qty) => {
        return await api.put(`/cart/update/${cartDetailId}`, { qty });
    };

    // Xóa sản phẩm
    const removeCartItem = async (cartDetailId) => {
        return await api.delete(`/cart/remove/${cartDetailId}`);
    };

    // Xóa toàn bộ giỏ
    const clearCart = async () => {
        return await api.delete("/cart/clear");
    };

    return { getCart, addToCart, updateCart, removeCartItem, clearCart };
};
