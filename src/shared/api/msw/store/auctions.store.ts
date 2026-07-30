import type {
  AuctionListItem,
  AuctionListRequest,
  AuctionListResponse,
  AuctionShowResponse,
  AuctionStatus,
  AuctionUuid,
  BetListResponse,
  ProblemDetail,
  SetBetRequest,
  ValidationProblem,
} from '@/shared/api/contracts/auctions';
import { type AuctionRecord, seedAuctions } from '@/shared/api/msw/data/seed';

const VAT_RATE = 0.2;
const MY_ORG_ID = 14;
const MY_SUBSCRIBER_ID = 13;

/** Числовые коды AuctionStatus из OpenAPI (поле statuses) */
const AUCTION_STATUS_CODE: Partial<Record<AuctionStatus, number>> = {
  Planning: 1,
  Auction: 2,
  DeterminateWinner: 3,
  WaitDeal: 4,
  InProgress: 5,
  Finished: 6,
  Stopped: 7,
  Canceled: 8,
};

const clone = <T>(value: T): T => structuredClone(value);

const problem = (partial: ProblemDetail): ProblemDetail => ({
  trace_id: crypto.randomUUID().replaceAll('-', ''),
  ...partial,
});

class AuctionsStore {
  private records: AuctionRecord[] = seedAuctions();

  reset() {
    this.records = seedAuctions();
  }

  list(request: AuctionListRequest = {}): AuctionListResponse {
    const page = Math.max(1, request.page ?? 1);
    const perPage = Math.min(100, Math.max(1, request.per_page ?? 5));

    let items = this.records.map((record) => clone(record.list));

    if (request.cargo_num) {
      const query = request.cargo_num.trim().toLowerCase();
      items = items.filter((item) => item.main?.cargo_num?.toLowerCase().includes(query));
    }

    if (request.auc_type?.length) {
      const types = new Set(request.auc_type);
      items = items.filter(
        (item) =>
          item.main?.auc_type &&
          types.has(item.main.auc_type as 'Request' | 'Up' | 'Down' | 'FixPrice'),
      );
    }

    if (request.load_city) {
      items = items.filter((item) => item.route?.load?.city === request.load_city);
    }

    if (request.unload_city) {
      items = items.filter((item) => item.route?.unload?.city === request.unload_city);
    }

    if (request.load_date_from) {
      items = items.filter((item) => (item.route?.load?.date ?? '') >= request.load_date_from!);
    }

    if (request.load_date_to) {
      items = items.filter((item) => (item.route?.load?.date ?? '') <= request.load_date_to!);
    }

    if (typeof request.is_available === 'boolean') {
      items = items.filter((item) => item.trading?.is_available === request.is_available);
    }

    if (typeof request.is_bidder === 'boolean') {
      items = items.filter((item) => item.trading?.is_bidder === request.is_bidder);
    }

    if (typeof request.current_price_from === 'number') {
      items = items.filter(
        (item) =>
          (item.trading?.price?.current ?? Number.NEGATIVE_INFINITY) >= request.current_price_from!,
      );
    }

    if (typeof request.current_price_to === 'number') {
      items = items.filter(
        (item) =>
          (item.trading?.price?.current ?? Number.POSITIVE_INFINITY) <= request.current_price_to!,
      );
    }

    if (request.status?.length) {
      const tradingStatuses = new Set(request.status);
      items = items.filter(
        (item) => item.trading?.status_mobile && tradingStatuses.has(item.trading.status_mobile),
      );
    }

    if (request.statuses?.length) {
      const auctionStatusCodes = new Set(request.statuses);
      items = items.filter((item) => {
        const code = item.trading?.status ? AUCTION_STATUS_CODE[item.trading.status] : undefined;
        return typeof code === 'number' && auctionStatusCodes.has(code);
      });
    }

    const total = items.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;
    const pageItems = items.slice(start, start + perPage);

    return {
      data: pageItems,
      meta: {
        current_page: page,
        from: total === 0 ? 0 : start + 1,
        last_page: lastPage,
        per_page: perPage,
        to: total === 0 ? 0 : start + pageItems.length,
        total,
      },
    };
  }

  getDetail(auctionUuid: AuctionUuid): AuctionShowResponse | null {
    const record = this.find(auctionUuid);
    if (!record) return null;

    const detail = clone(record.detail);

    if (detail.trading.hide_points_address_and_contacts) {
      detail.contacts = [];
      detail.routes = detail.routes.map((route) => ({
        ...route,
        location: route.location ? { ...route.location, loading_address: '' } : route.location,
        contact: { name: '', phone: '' },
      }));
    }

    if (detail.trading.no_view_cargo_price) {
      detail.cargo.price = '';
      if (detail.trading.price) {
        detail.trading.price = {
          ...detail.trading.price,
          current: null,
          available: null,
          min: null,
          max: null,
        };
      }
    }

    return detail;
  }

  getListItem(auctionUuid: AuctionUuid): AuctionListItem | null {
    const record = this.find(auctionUuid);
    return record ? clone(record.list) : null;
  }

  getBets(auctionUuid: AuctionUuid, all = false): BetListResponse | null {
    const record = this.find(auctionUuid);
    if (!record) return null;

    if (record.detail.hide_bets_history || record.detail.trading.hide_bets_history) {
      return { bets: [] };
    }

    const bets = clone(record.bets).filter((bet) => all || !bet.cancel_reason);

    return { bets };
  }

  setBet(
    auctionUuid: AuctionUuid,
    body: SetBetRequest,
  ): { ok: true } | { ok: false; status: 404 | 422; body: ProblemDetail | ValidationProblem } {
    const record = this.find(auctionUuid);
    if (!record) {
      return {
        ok: false,
        status: 404,
        body: problem({
          code: 'resource_not_found',
          title: 'Не найдено',
          message: 'Аукцион не найден',
        }),
      };
    }

    if (!record.detail.trading.can_set_bet) {
      return {
        ok: false,
        status: 422,
        body: {
          code: 'validation_failed',
          title: 'Ошибка валидации',
          message: 'Ставка недоступна для этого аукциона',
          errors: [
            {
              field: 'price',
              message: 'Betting is not available for this auction',
              code: 'can_set_bet',
            },
          ],
        },
      };
    }

    const validation = this.validateBetPrice(record, body.price);
    if (validation) {
      return { ok: false, status: 422, body: validation };
    }

    const price = body.price;
    const priceNoVat = Math.round((price / (1 + VAT_RATE)) * 100) / 100;
    const myBetIndex = record.bets.findIndex(
      (bet) => bet.organization_id === MY_ORG_ID && !bet.cancel_reason,
    );

    if (myBetIndex >= 0) {
      record.bets[myBetIndex] = {
        ...record.bets[myBetIndex],
        price_with_vat: price,
        price_no_vat: priceNoVat,
        created_at: new Date().toISOString(),
        cancel_reason: '',
        is_rejected: false,
      };
    } else {
      record.bets.unshift({
        id: Date.now(),
        created_at: new Date().toISOString(),
        auction_id: record.detail.main.id ?? 0,
        subscriber_id: MY_SUBSCRIBER_ID,
        contact_name: 'Моя компания',
        contact_phone: '',
        price_with_vat: price,
        price_no_vat: priceNoVat,
        organization_id: MY_ORG_ID,
        organization_inn: '9616244307',
        organization_name: 'Моя компания',
        transporter_comment: null,
        is_rejected: false,
        is_counter: false,
        place: null,
        is_win: false,
        run_number: 0,
        cancel_reason: '',
      });
    }

    this.recalculatePlaces(record);
    this.syncAfterBet(record, price, priceNoVat);

    return { ok: true };
  }

  private find(auctionUuid: AuctionUuid) {
    return this.records.find((record) => record.list.main?.order_uid === auctionUuid);
  }

  private validateBetPrice(record: AuctionRecord, price: unknown): ValidationProblem | null {
    if (typeof price !== 'number' || Number.isNaN(price)) {
      return {
        code: 'validation_failed',
        title: 'Ошибка валидации',
        message: 'Запрос содержит некорректные поля.',
        errors: [
          { field: 'price', message: 'Price is required and must be a number', code: 'type' },
        ],
      };
    }

    if (price <= 0) {
      return {
        code: 'validation_failed',
        title: 'Ошибка валидации',
        message: 'Запрос содержит некорректные поля.',
        errors: [{ field: 'price', message: 'Price must be greater than 0', code: 'min_value' }],
      };
    }

    const tradingPrice = record.detail.trading.price;
    const min = tradingPrice?.min ?? null;
    const max = tradingPrice?.max ?? null;
    const step = tradingPrice?.step ?? null;
    const available = tradingPrice?.available ?? null;

    if (min != null && price < min) {
      return {
        code: 'validation_failed',
        title: 'Ошибка валидации',
        message: 'Запрос содержит некорректные поля.',
        errors: [{ field: 'price', message: `Price must be >= ${min}`, code: 'min_value' }],
      };
    }

    if (max != null && price > max) {
      return {
        code: 'validation_failed',
        title: 'Ошибка валидации',
        message: 'Запрос содержит некорректные поля.',
        errors: [{ field: 'price', message: `Price must be <= ${max}`, code: 'max_value' }],
      };
    }

    if (step != null && step > 0 && available != null) {
      const diff = Math.abs(price - available);
      if (diff % step !== 0) {
        return {
          code: 'validation_failed',
          title: 'Ошибка валидации',
          message: 'Запрос содержит некорректные поля.',
          errors: [
            {
              field: 'price',
              message: `Price must respect step ${step} from available price ${available}`,
              code: 'step',
            },
          ],
        };
      }
    }

    return null;
  }

  private recalculatePlaces(record: AuctionRecord) {
    const active = record.bets.filter((bet) => !bet.cancel_reason && !bet.is_rejected);
    const isUp = record.list.main?.auc_type === 'Up';

    const sorted = [...active].sort((a, b) => {
      const left = a.price_with_vat ?? 0;
      const right = b.price_with_vat ?? 0;
      return isUp ? right - left : left - right;
    });

    sorted.forEach((bet, index) => {
      bet.place = index + 1;
      bet.is_win = record.detail.trading.status === 'Finished' && index === 0;
    });

    record.bets
      .filter((bet) => bet.cancel_reason || bet.is_rejected)
      .forEach((bet) => {
        bet.place = null;
        bet.is_win = false;
      });
  }

  private syncAfterBet(record: AuctionRecord, myPrice: number, myPriceNoVat: number) {
    const active = record.bets.filter((bet) => !bet.cancel_reason && !bet.is_rejected);
    const isUp = record.list.main?.auc_type === 'Up';
    const best = [...active].sort((a, b) => {
      const left = a.price_with_vat ?? 0;
      const right = b.price_with_vat ?? 0;
      return isUp ? right - left : left - right;
    })[0];

    const current = best?.price_with_vat ?? myPrice;
    const currentNoVat = best?.price_no_vat ?? myPriceNoVat;
    const step = record.detail.trading.price?.step ?? null;
    const isDownLike =
      record.list.main?.auc_type === 'Down' || record.list.main?.auc_type === 'Request';

    const available = step == null ? current : isDownLike ? current - step : current + step;

    const myBet = record.bets.find(
      (bet) => bet.organization_id === MY_ORG_ID && !bet.cancel_reason,
    );
    const statusMobile = myBet?.place === 1 ? 'Leading' : myBet ? 'Losing' : 'NotParticipating';

    record.detail.trading.status_mobile = statusMobile;
    record.detail.trading.is_bidder = true;
    record.detail.trading.your = {
      bet: true,
      last_bet: myPriceNoVat,
      last_bet_with_vat: myPrice,
      win: false,
    };
    record.detail.trading.price = {
      ...record.detail.trading.price,
      current,
      current_no_vat: currentNoVat,
      available,
      price_per_km: record.detail.trading.price?.price_per_km ?? 0,
    };

    if (record.list.trading) {
      record.list.trading.status_mobile = statusMobile;
      record.list.trading.is_bidder = true;
      record.list.trading.your = { bet: true, last_bet: myPrice };
      record.list.trading.price = {
        start: record.list.trading.price?.start ?? current,
        current,
        current_no_vat: currentNoVat,
      };
    }
  }
}

export const auctionsStore = new AuctionsStore();
