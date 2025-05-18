import axios, { AxiosRequestConfig } from 'axios';

export const createAxios = (options: AxiosRequestConfig = {}) => {
  const httpApi = axios.create({
    baseURL: process.env.API_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  httpApi.interceptors.response.use(
    (res) => res,
    (error) => Promise.reject(error),
  );
  return httpApi;
};
export default createAxios;
