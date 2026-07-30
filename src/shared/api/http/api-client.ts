import axios, { type AxiosError } from 'axios';

import { toApiError } from '@/shared/api/http/api-error';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    return Promise.reject(toApiError(error));
  },
);
