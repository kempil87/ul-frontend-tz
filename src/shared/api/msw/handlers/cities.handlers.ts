import { http, HttpResponse } from 'msw';

import { CITIES } from '@/shared/api/msw/data/cities';

const withLatency = async <T>(data: T, ms = 200): Promise<T> => {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return data;
};

export const citiesHandlers = [
  http.get('/cities', async () => {
    return HttpResponse.json(await withLatency({ items: [...CITIES] }));
  }),
];
