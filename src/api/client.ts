import { create, type AxiosInstance } from 'axios';

export const apiClient: AxiosInstance = create({
  baseURL: 'https://dummyjson.com',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});
