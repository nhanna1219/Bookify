import api from "../api.js";

export const payWithCOD = (data) =>
    api.post('/orders',data);

export const payWithMomo = (data) =>
    api.post('/orders/momo', data);

export const getOrderById = (id) =>
    api.get(`/orders/${id}`);