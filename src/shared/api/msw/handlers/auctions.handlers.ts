import { http, HttpResponse } from 'msw';

import type { AuctionListRequest, SetBetRequest } from '@/shared/api/contracts/auctions';
import { auctionsStore } from '@/shared/api/msw/store/auctions.store';

const withLatency = async <T>(data: T, ms = 300): Promise<T> => {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return data;
};

export const auctionsHandlers = [
  /** Почему POST method я так и не понял,
   * правильнее было бы использовать для таких запросов кешируемый GET с query парамтерами **/
  http.post('/auctions/list', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as AuctionListRequest;
    return HttpResponse.json(await withLatency(auctionsStore.list(body)));
  }),

  http.get('/auctions/:auctionUuid', async ({ params }) => {
    const auctionUuid = String(params.auctionUuid);
    const detail = auctionsStore.getDetail(auctionUuid);

    if (!detail) {
      return HttpResponse.json(
        await withLatency({
          code: 'resource_not_found',
          title: 'Не найдено',
          message: 'Аукцион не найден',
        }),
        { status: 404 },
      );
    }

    return HttpResponse.json(await withLatency(detail));
  }),

  http.get('/auctions/:auctionUuid/bets', async ({ params, request }) => {
    const auctionUuid = String(params.auctionUuid);
    const url = new URL(request.url);
    const allParam = url.searchParams.get('all');
    const all = allParam === 'true' || allParam === '1';
    const bets = auctionsStore.getBets(auctionUuid, all);

    if (!bets) {
      return HttpResponse.json(
        await withLatency({
          code: 'resource_not_found',
          title: 'Не найдено',
          message: 'Аукцион не найден',
        }),
        { status: 404 },
      );
    }

    return HttpResponse.json(await withLatency(bets));
  }),

  http.post('/auctions/:auctionUuid/bets', async ({ params, request }) => {
    const auctionUuid = String(params.auctionUuid);
    const body = (await request.json().catch(() => ({}))) as Partial<SetBetRequest>;
    const result = auctionsStore.setBet(auctionUuid, { price: Number(body.price) });

    if (!result.ok) {
      return HttpResponse.json(await withLatency(result.body), {
        status: result.status,
        headers: { 'Content-Type': 'application/problem+json' },
      });
    }

    return new HttpResponse(null, { status: 200 });
  }),
];
