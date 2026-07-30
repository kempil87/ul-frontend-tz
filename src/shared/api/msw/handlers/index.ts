import { auctionsHandlers } from '@/shared/api/msw/handlers/auctions.handlers';
import { citiesHandlers } from '@/shared/api/msw/handlers/cities.handlers';

export const handlers = [...citiesHandlers, ...auctionsHandlers];
