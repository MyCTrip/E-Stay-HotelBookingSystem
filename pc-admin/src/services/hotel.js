import request from './request';

export const getHotels = (params) => request.get('/hotels', { params });
export const getHotelById = (id) => request.get(`/hotels/${id}`);
export const createHotel = (data) => request.post('/hotels', data);
export const updateHotel = (id, data) => request.put(`/hotels/${id}`, data);
export const deleteHotel = (id) => request.delete(`/hotels/${id}`);
