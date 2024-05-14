import { useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

export const http = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000,
  maxRedirects: 5,
});

interface Props {
  children?: React.ReactNode;
}

const HttpProvider = ({ children }: Props) => {
  const reqInterceptor = http.interceptors.request.use((config) => {
    return config;
  });

  const resInterceptor = http.interceptors.response.use(
    <T>(config: AxiosResponse<T, any>): T | AxiosResponse => {
      if (config?.data) {
        return config.data;
      }
      return config;
    },
  );
  useEffect(() => {
    return () => {
      http.interceptors.request.eject(reqInterceptor);
      http.interceptors.response.eject(resInterceptor);
    };
  }, [reqInterceptor, resInterceptor]);

  return children;
};

export default HttpProvider;
