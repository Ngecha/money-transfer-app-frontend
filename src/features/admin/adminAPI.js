import axios from 'axios';

const API_URL = 'your-api-endpoint';

export const fetchAllUsers = () => axios.get(`${API_URL}/users`);
export const addUser = (userData) => axios.post(`${API_URL}/users`, userData);
export const editUser = (id, userData) => axios.put(`${API_URL}/users/${id}`, userData);
export const removeUser = (id) => axios.delete(`${API_URL}/users/${id}`);
