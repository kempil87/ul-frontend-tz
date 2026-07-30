import type { AuctionStatus, AuctionType, TradingStatus } from '@/shared/api/contracts/auctions';

export const AUCTION_TYPE_LABEL: Record<AuctionType, string> = {
  Request: 'Заявочный',
  Up: 'На повышение',
  Down: 'На понижение',
  FixPrice: 'Фикс. цена',
  Unknown: 'Unknown',
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

export const TRADING_STATUS_LABEL: Partial<Record<TradingStatus, string>> = {
  NotParticipating: 'Не участвую',
  Leading: 'Лидирую',
  Losing: 'Перебит',
  Winner: 'Победитель',
  Confirmed: 'Подтверждён',
  OnPending: 'Ожидание',
  ChoosingWinner: 'Выбор победителя',
  Accepted: 'Принят',
  Unknown: 'Неизвестно',
};

export const getTradingStatusChipVariant = (status: TradingStatus) => {
  if (status === 'Losing') return 'danger' as const;
  if (status === 'Winner' || status === 'Leading') return 'success' as const;
  return 'link' as const;
};

export const OPERATION_TYPE_LABEL: Record<string, string> = {
  Loading: 'Погрузка',
  Unloading: 'Выгрузка',
  Unknown: 'Точка',
};

export const PAYMENT_DELAY_LABEL: Record<string, string> = {
  CalendarDays: 'календарных дней',
  WorkDays: 'рабочих дней',
  Unknown: '',
};
