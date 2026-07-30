import type { AuctionStatus, AuctionType, TradingStatus } from '@/shared/api/contracts/auctions';

export const TRADING_STATUSES = [
  'NotParticipating',
  'Leading',
  'Losing',
  'OnPending',
  'Confirmed',
  'ChoosingWinner',
  'Winner',
  'Accepted',
  'Unknown',
] as const satisfies readonly TradingStatus[];

export const AUCTION_STATUSES = [
  'Planning',
  'Auction',
  'DeterminateWinner',
  'WaitDeal',
  'InProgress',
  'Finished',
  'Stopped',
  'Canceled',
  'Unknown',
] as const satisfies readonly AuctionStatus[];

export const AUCTION_TYPES = [
  'Request',
  'Up',
  'Down',
  'FixPrice',
] as const satisfies readonly Exclude<AuctionType, 'Unknown'>[];

/** Числовые коды AuctionStatus для поля statuses в AuctionListRequest */
export const AUCTION_STATUS_CODE: Record<Exclude<AuctionStatus, 'Unknown'>, number> = {
  Planning: 1,
  Auction: 2,
  DeterminateWinner: 3,
  WaitDeal: 4,
  InProgress: 5,
  Finished: 6,
  Stopped: 7,
  Canceled: 8,
};

export const TRADING_STATUS_LABEL: Record<TradingStatus, string> = {
  NotParticipating: 'Не участвую',
  Leading: 'Лидирую',
  Losing: 'Перебит',
  OnPending: 'Ожидание',
  Confirmed: 'Подтверждён',
  ChoosingWinner: 'Выбор победителя',
  Winner: 'Победитель',
  Accepted: 'Принят',
  Unknown: 'Неизвестно',
};

export const AUCTION_STATUS_LABEL: Record<AuctionStatus, string> = {
  Planning: 'Планирование',
  Auction: 'Торги',
  DeterminateWinner: 'Определение победителя',
  WaitDeal: 'Ожидание сделки',
  InProgress: 'В работе',
  Finished: 'Завершён',
  Stopped: 'Остановлен',
  Canceled: 'Отменён',
  Unknown: 'Неизвестно',
};

export const AUCTION_TYPE_LABEL: Record<(typeof AUCTION_TYPES)[number], string> = {
  Request: 'Заявочный',
  Up: 'На повышение',
  Down: 'На понижение',
  FixPrice: 'Фикс. цена',
};

export const FILTER_DEBOUNCE_MS = 300;

export const TRADING_STATUS_OPTIONS = TRADING_STATUSES.map((status) => ({
  value: status,
  label: TRADING_STATUS_LABEL[status],
}));

export const AUCTION_STATUS_OPTIONS = AUCTION_STATUSES.map((status) => ({
  value: status,
  label: AUCTION_STATUS_LABEL[status],
}));

export const AUCTION_TYPE_OPTIONS = AUCTION_TYPES.map((type) => ({
  value: type,
  label: AUCTION_TYPE_LABEL[type],
}));

export const toCityOptions = (cities: string[]) =>
  cities.map((city) => ({
    value: city,
    label: city,
  }));
