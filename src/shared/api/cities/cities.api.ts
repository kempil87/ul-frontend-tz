import { apiClient } from '@/shared/api/http/api-client';
import type { CitiesListResponse } from '@/shared/api/contracts/cities';

export const citiesApi = {
  list: async () => {
    const { data } = await apiClient.get<CitiesListResponse>('/cities');
    return data;
  },
};
