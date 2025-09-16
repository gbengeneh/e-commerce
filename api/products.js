import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://dummyjson.com';

export const fetchProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/products`);
  return response.data.products;
};

export const fetchCarts = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.get(`${API_BASE_URL}/carts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.carts;
};

export const fetchUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/users`);
  return response.data.users;
};

export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    username,
    password,
  });
  const { token } = response.data;
  await AsyncStorage.setItem('token', token);
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await axios.post(`${API_BASE_URL}/carts/add`, {
    userId: 1, // Assuming userId 1 for simulation
    products: [{ id: productId, quantity }],
  });
  return response.data;
};

// Generic function for other endpoints
export const fetchData = async (endpoint) => {
  const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
  return response.data;
};
