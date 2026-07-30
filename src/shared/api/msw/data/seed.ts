import type {
  AuctionListItem,
  AuctionShowResponse,
  BetItem,
} from '@/shared/api/contracts/auctions';

export type AuctionRecord = {
  list: AuctionListItem;
  detail: AuctionShowResponse;
  bets: BetItem[];
};

const now = '2026-07-30T12:00:00';

type SeedBet = {
  id: number;
  organization_name: string;
  organization_id: number;
  organization_inn: string;
  subscriber_id: number;
  price_with_vat: number;
  price_no_vat: number;
  place: number;
  is_win?: boolean;
  created_at?: string;
  isCurrentUser?: boolean;
};

type SeedAuction = {
  id: number;
  cargo_num: string;
  order_uid: string;
  auc_type: NonNullable<NonNullable<AuctionListItem['main']>['auc_type']>;
  created_at: string;
  cargo_date: string;
  price_per_km: number | null;
  organizer: {
    organization_name: string;
    organization_inn: string;
    organization_id: number;
    subscriber_id: number;
    subscriber_code: string;
    infobase_code: string;
    organization_kpp: string;
    is_hide_organization?: boolean;
  };
  contact: {
    name: string;
    phone: string;
    email?: string | null;
  };
  load: {
    city: string;
    address: string;
    date: string;
    end_date: string;
    city_gc_id?: number;
    lon?: number;
    lat?: number;
  };
  unload: {
    city: string;
    address: string;
    date: string;
    end_date: string;
    city_gc_id?: number;
    lon?: number;
    lat?: number;
  };
  cargo: {
    name: string;
    weight: number;
    volume: number;
    body_type: string;
    truck_count?: number;
    distance: number;
    temp_from?: number;
    temp_to?: number;
    car_type?: string;
  };
  trading: {
    status: NonNullable<NonNullable<AuctionListItem['trading']>['status']>;
    status_mobile: NonNullable<NonNullable<AuctionListItem['trading']>['status_mobile']>;
    start_time: string;
    stop_time: string;
    can_set_bet: boolean;
    allow_counter_bets?: boolean;
    is_bidder: boolean;
    is_available: boolean;
    bid_measurement_type?: 'PerRoute' | 'PerKm';
    price: {
      start: number;
      current: number;
      current_no_vat: number;
      available: number | null;
      min: number | null;
      max: number | null;
      step: number | null;
    };
    your: {
      bet: boolean;
      last_bet: number | null;
      win?: boolean;
    };
    hide_bets_history?: boolean;
    hide_points_address_and_contacts?: boolean;
    no_view_cargo_price?: boolean;
  };
  payment: {
    form: string;
    delay?: number | null;
    delay_type?: 'CalendarDays' | 'WorkDays' | null;
    condition?: string | null;
  };
  bets: SeedBet[];
};

const formatWeight = (value: number) => value.toFixed(3);

const createAuction = (seed: SeedAuction): AuctionRecord => {
  const truckCount = seed.cargo.truck_count ?? 1;
  const yourLastBet = seed.trading.your.last_bet;

  return {
    list: {
      main: {
        id: seed.id,
        cargo_num: seed.cargo_num,
        cargo_date: seed.cargo_date,
        auc_type: seed.auc_type,
        order_uid: seed.order_uid,
        created_at: seed.created_at,
        price_per_km: seed.price_per_km,
      },
      organizer: {
        subscriber_id: seed.organizer.subscriber_id,
        organization_id: seed.organizer.organization_id,
        organization_name: seed.organizer.organization_name,
        organization_inn: seed.organizer.organization_inn,
        organization_kpp: seed.organizer.organization_kpp,
        is_hide_organization: seed.organizer.is_hide_organization ?? false,
      },
      route: {
        load: {
          city: seed.load.city,
          address: seed.load.address,
          date: seed.load.date,
          city_gc_id: seed.load.city_gc_id,
          points_count: 1,
        },
        unload: {
          city: seed.unload.city,
          address: seed.unload.address,
          date: seed.unload.date,
          city_gc_id: seed.unload.city_gc_id,
          points_count: 1,
        },
      },
      cargo: {
        name: seed.cargo.name,
        weight: seed.cargo.weight,
        volume: seed.cargo.volume,
        body_type: seed.cargo.body_type,
        truck_count: truckCount,
        temp_from: seed.cargo.temp_from,
        temp_to: seed.cargo.temp_to,
      },
      trading: {
        status: seed.trading.status,
        status_mobile: seed.trading.status_mobile,
        start_time: seed.trading.start_time,
        stop_time: seed.trading.stop_time,
        bid_measurement_type: seed.trading.bid_measurement_type ?? 'PerRoute',
        can_set_bet: seed.trading.can_set_bet,
        allow_counter_bets: seed.trading.allow_counter_bets ?? false,
        is_bidder: seed.trading.is_bidder,
        is_available: seed.trading.is_available,
        price: {
          start: seed.trading.price.start,
          current: seed.trading.price.current,
          current_no_vat: seed.trading.price.current_no_vat,
        },
        your: {
          bet: seed.trading.your.bet,
          last_bet: yourLastBet,
        },
      },
      payment: {
        form: seed.payment.form,
        currency_code: '643',
      },
    },
    detail: {
      main: {
        id: seed.id,
        cargo_num: seed.cargo_num,
        cargo_date: seed.cargo_date,
        order_uid: seed.order_uid,
        auc_type: seed.auc_type,
        created_at: seed.created_at,
      },
      organizer: {
        subscriber_id: seed.organizer.subscriber_id,
        subscriber_code: seed.organizer.subscriber_code,
        infobase_code: seed.organizer.infobase_code,
        organization_name: seed.organizer.organization_name,
        organization_inn: seed.organizer.organization_inn,
        organization_kpp: seed.organizer.organization_kpp,
        organization_id: seed.organizer.organization_id,
      },
      contacts: [
        {
          name: seed.contact.name,
          phone: seed.contact.phone,
          email: seed.contact.email ?? null,
          work_phone: null,
          uid: `c${String(seed.id).padStart(4, '0')}1111-1111-1111-1111-111111111111`,
        },
      ],
      cargo: {
        price: seed.auc_type === 'FixPrice' ? String(seed.trading.price.current) : '0',
        currency: 643,
        distance: seed.cargo.distance,
        truck_count: truckCount,
        body_type: seed.cargo.body_type,
        temp_from: seed.cargo.temp_from,
        temp_to: seed.cargo.temp_to,
        loading_types: { side: true, top: false, rear: true, full: false },
        docs: { tir: false, cmr: false, t1: false, med: Boolean(seed.cargo.temp_from) },
        car: {
          type: seed.cargo.car_type ?? seed.cargo.body_type,
          weight: Math.ceil(seed.cargo.weight),
          volume: seed.cargo.volume,
        },
      },
      trading: {
        status: seed.trading.status,
        status_mobile: seed.trading.status_mobile,
        start_time: seed.trading.start_time,
        stop_time: seed.trading.stop_time,
        bid_measurement_type: seed.trading.bid_measurement_type ?? 'PerRoute',
        can_set_bet: seed.trading.can_set_bet,
        allow_counter_bets: seed.trading.allow_counter_bets ?? false,
        hide_bets_history: seed.trading.hide_bets_history ?? false,
        hide_places: false,
        no_view_cargo_price: seed.trading.no_view_cargo_price ?? false,
        hide_points_address_and_contacts: seed.trading.hide_points_address_and_contacts ?? false,
        is_bidder: seed.trading.is_bidder,
        price: {
          start: seed.trading.price.start,
          current: seed.trading.price.current,
          current_no_vat: seed.trading.price.current_no_vat,
          available: seed.trading.price.available,
          min: seed.trading.price.min,
          max: seed.trading.price.max,
          step: seed.trading.price.step,
          price_per_km: seed.price_per_km ?? 0,
        },
        your: {
          bet: seed.trading.your.bet,
          last_bet: yourLastBet,
          last_bet_with_vat: yourLastBet,
          win: seed.trading.your.win ?? false,
        },
        settings: { prolong_after_bet: 10, transmission_time_in: 24 },
      },
      payment: {
        condition: seed.payment.condition ?? 'По оригиналам накладных',
        form: seed.payment.form,
        delay: seed.payment.delay ?? 14,
        delay_type: seed.payment.delay_type ?? 'CalendarDays',
        currency_code: '643',
        prepay: null,
      },
      assembly: { num: null, date: null },
      routes: [
        {
          row_num: 1,
          op_type: 'Loading',
          start_date: seed.load.date,
          end_date: seed.load.end_date,
          contractor: '',
          contractor_inn: '',
          location: {
            city_name: seed.load.city,
            city_full_name: `${seed.load.city}, Россия`,
            city_gc_id: seed.load.city_gc_id,
            loading_address: seed.load.address,
            lon: seed.load.lon,
            lat: seed.load.lat,
          },
          cargo: {
            name: seed.cargo.name,
            package_name: '',
            weight: formatWeight(seed.cargo.weight),
            volume: formatWeight(seed.cargo.volume),
            length: '0',
            width: '0',
            height: '0',
            oversized: false,
          },
          contact: { name: seed.contact.name, phone: seed.contact.phone },
        },
        {
          row_num: 2,
          op_type: 'Unloading',
          start_date: seed.unload.date,
          end_date: seed.unload.end_date,
          contractor: '',
          contractor_inn: '',
          location: {
            city_name: seed.unload.city,
            city_full_name: `${seed.unload.city}, Россия`,
            city_gc_id: seed.unload.city_gc_id,
            loading_address: seed.unload.address,
            lon: seed.unload.lon,
            lat: seed.unload.lat,
          },
          cargo: {
            name: seed.cargo.name,
            package_name: '',
            weight: formatWeight(seed.cargo.weight),
            volume: formatWeight(seed.cargo.volume),
            length: '0',
            width: '0',
            height: '0',
            oversized: false,
          },
          contact: { name: '', phone: '' },
        },
      ],
      admitted_organizations: [],
      hide_bets_history: seed.trading.hide_bets_history ?? false,
    },
    bets: seed.bets.map((bet): BetItem => ({
      id: bet.id,
      created_at: bet.created_at ?? now,
      auction_id: seed.id,
      subscriber_id: bet.subscriber_id,
      contact_name: bet.isCurrentUser ? 'Моя компания' : bet.organization_name,
      contact_phone: '',
      price_with_vat: bet.price_with_vat,
      price_no_vat: bet.price_no_vat,
      organization_id: bet.isCurrentUser ? 14 : bet.organization_id,
      organization_inn: bet.isCurrentUser ? '9616244307' : bet.organization_inn,
      organization_name: bet.isCurrentUser ? 'Моя компания' : bet.organization_name,
      transporter_comment: null,
      is_rejected: false,
      is_counter: false,
      place: bet.place,
      is_win: bet.is_win ?? false,
      run_number: 0,
      cancel_reason: '',
    })),
  };
};

export const seedAuctions = (): AuctionRecord[] => [
  createAuction({
    id: 1001,
    cargo_num: 'CARGO-1001',
    order_uid: 'a1111111-1111-1111-1111-111111111111',
    auc_type: 'Down',
    created_at: '2026-07-20T11:00:00',
    cargo_date: '2026-08-01T10:00:00',
    price_per_km: 118,
    organizer: {
      organization_name: 'ООО Логистика Плюс',
      organization_inn: '7701234567',
      organization_id: 340,
      subscriber_id: 98,
      subscriber_code: '12345',
      infobase_code: 'RU_Cargo_01',
      organization_kpp: '770101001',
    },
    contact: { name: 'Иван Петров', phone: '+79991112233', email: 'ivan@logistika.example' },
    load: {
      city: 'Москва',
      address: 'ул. Складская, 1',
      date: '2026-08-02T09:00:00',
      end_date: '2026-08-02T12:00:00',
      city_gc_id: 1,
      lon: 37.62,
      lat: 55.75,
    },
    unload: {
      city: 'Казань',
      address: 'ул. Портовая, 14',
      date: '2026-08-03T18:00:00',
      end_date: '2026-08-03T20:00:00',
      city_gc_id: 2,
      lon: 49.12,
      lat: 55.79,
    },
    cargo: {
      name: 'Паллеты с электроникой',
      weight: 12.5,
      volume: 36,
      body_type: 'Тент',
      distance: 800,
      car_type: 'Тягач',
    },
    trading: {
      status: 'Auction',
      status_mobile: 'Losing',
      start_time: '2026-07-30T10:00:00',
      stop_time: '2026-07-30T18:00:00',
      can_set_bet: true,
      allow_counter_bets: true,
      is_bidder: true,
      is_available: true,
      price: {
        start: 120000,
        current: 95000,
        current_no_vat: 79167,
        available: 94000,
        min: 70000,
        max: 120000,
        step: 1000,
      },
      your: { bet: true, last_bet: 96000 },
    },
    payment: { form: 'Безналичная с НДС', delay: 14, delay_type: 'CalendarDays' },
    bets: [
      {
        id: 1,
        organization_name: 'ТрансЛайн',
        organization_id: 21,
        organization_inn: '7701111222',
        subscriber_id: 20,
        price_with_vat: 95000,
        price_no_vat: 79167,
        place: 1,
      },
      {
        id: 2,
        organization_name: 'Моя компания',
        organization_id: 14,
        organization_inn: '9616244307',
        subscriber_id: 13,
        price_with_vat: 96000,
        price_no_vat: 80000,
        place: 2,
        created_at: '2026-07-30T11:00:00',
        isCurrentUser: true,
      },
    ],
  }),
  createAuction({
    id: 1002,
    cargo_num: 'CARGO-1002',
    order_uid: 'a2222222-2222-2222-2222-222222222222',
    auc_type: 'Up',
    created_at: '2026-07-21T11:00:00',
    cargo_date: '2026-08-04T10:00:00',
    price_per_km: 140,
    organizer: {
      organization_name: 'АО МеталлТрейд',
      organization_inn: '7809876543',
      organization_id: 341,
      subscriber_id: 99,
      subscriber_code: '54321',
      infobase_code: 'RU_Cargo_02',
      organization_kpp: '780101001',
    },
    contact: { name: 'Анна Смирнова', phone: '+78125554433' },
    load: {
      city: 'Санкт-Петербург',
      address: 'пр. Индустриальный, 40',
      date: '2026-08-05T08:00:00',
      end_date: '2026-08-05T10:00:00',
    },
    unload: {
      city: 'Москва',
      address: 'МКАД, 47 км',
      date: '2026-08-06T16:00:00',
      end_date: '2026-08-06T18:00:00',
    },
    cargo: {
      name: 'Металлопрокат',
      weight: 20,
      volume: 18,
      body_type: 'Открытый',
      distance: 700,
    },
    trading: {
      status: 'Auction',
      status_mobile: 'NotParticipating',
      start_time: '2026-07-30T09:00:00',
      stop_time: '2026-07-31T18:00:00',
      can_set_bet: true,
      is_bidder: false,
      is_available: true,
      price: {
        start: 100000,
        current: 110000,
        current_no_vat: 91667,
        available: 112000,
        min: 110000,
        max: 150000,
        step: 2000,
      },
      your: { bet: false, last_bet: null },
    },
    payment: { form: 'Наличный', delay: null, delay_type: null, condition: null },
    bets: [
      {
        id: 3,
        organization_name: 'СеверКарго',
        organization_id: 31,
        organization_inn: '7801222333',
        subscriber_id: 30,
        price_with_vat: 110000,
        price_no_vat: 91667,
        place: 1,
      },
    ],
  }),
  createAuction({
    id: 1003,
    cargo_num: 'CARGO-1003',
    order_uid: 'a3333333-3333-3333-3333-333333333333',
    auc_type: 'FixPrice',
    created_at: '2026-07-22T11:00:00',
    cargo_date: '2026-08-10T10:00:00',
    price_per_km: null,
    organizer: {
      organization_name: 'ООО ХолодЦепь',
      organization_inn: '6601122334',
      organization_id: 342,
      subscriber_id: 100,
      subscriber_code: '99999',
      infobase_code: 'RU_Cargo_03',
      organization_kpp: '660101001',
      is_hide_organization: true,
    },
    contact: { name: 'Ольга Морозова', phone: '+73431234567' },
    load: {
      city: 'Екатеринбург',
      address: 'ул. Холодильная, 5',
      date: '2026-08-10T07:00:00',
      end_date: '2026-08-10T09:00:00',
    },
    unload: {
      city: 'Новосибирск',
      address: 'ул. Складская, 22',
      date: '2026-08-12T20:00:00',
      end_date: '2026-08-12T22:00:00',
    },
    cargo: {
      name: 'Продукты питания',
      weight: 8,
      volume: 28,
      body_type: 'Реф',
      distance: 1400,
      temp_from: 2,
      temp_to: 4,
      car_type: 'Реф',
    },
    trading: {
      status: 'Finished',
      status_mobile: 'Winner',
      start_time: '2026-07-25T10:00:00',
      stop_time: '2026-07-28T18:00:00',
      can_set_bet: false,
      is_bidder: true,
      is_available: false,
      hide_bets_history: true,
      hide_points_address_and_contacts: true,
      no_view_cargo_price: true,
      price: {
        start: 180000,
        current: 180000,
        current_no_vat: 150000,
        available: null,
        min: null,
        max: null,
        step: null,
      },
      your: { bet: true, last_bet: 180000, win: true },
    },
    payment: { form: 'Безналичная с НДС', delay: 7, delay_type: 'WorkDays' },
    bets: [
      {
        id: 4,
        organization_name: 'Скрытый перевозчик',
        organization_id: 41,
        organization_inn: '6601999888',
        subscriber_id: 40,
        price_with_vat: 180000,
        price_no_vat: 150000,
        place: 1,
      },
      {
        id: 5,
        organization_name: 'Моя компания',
        organization_id: 14,
        organization_inn: '9616244307',
        subscriber_id: 13,
        price_with_vat: 180000,
        price_no_vat: 150000,
        place: 1,
        is_win: true,
        isCurrentUser: true,
      },
    ],
  }),
  createAuction({
    id: 1004,
    cargo_num: 'CARGO-1004',
    order_uid: 'a4444444-4444-4444-4444-444444444444',
    auc_type: 'Down',
    created_at: '2026-07-23T09:30:00',
    cargo_date: '2026-08-07T08:00:00',
    price_per_km: 95,
    organizer: {
      organization_name: 'ООО ЮгТранс',
      organization_inn: '2311456789',
      organization_id: 343,
      subscriber_id: 101,
      subscriber_code: '77881',
      infobase_code: 'RU_Cargo_04',
      organization_kpp: '231101001',
    },
    contact: { name: 'Сергей Кубанцев', phone: '+78612223344', email: 'sergey@yugtrans.example' },
    load: {
      city: 'Краснодар',
      address: 'ул. Заводская, 8',
      date: '2026-08-07T08:00:00',
      end_date: '2026-08-07T11:00:00',
    },
    unload: {
      city: 'Ростов-на-Дону',
      address: 'пр. Стачки, 150',
      date: '2026-08-07T18:00:00',
      end_date: '2026-08-07T20:00:00',
    },
    cargo: {
      name: 'Стройматериалы',
      weight: 18,
      volume: 42,
      body_type: 'Тент',
      distance: 280,
    },
    trading: {
      status: 'Auction',
      status_mobile: 'Leading',
      start_time: '2026-07-30T08:00:00',
      stop_time: '2026-07-30T20:00:00',
      can_set_bet: true,
      allow_counter_bets: true,
      is_bidder: true,
      is_available: true,
      price: {
        start: 65000,
        current: 52000,
        current_no_vat: 43333,
        available: 51000,
        min: 40000,
        max: 65000,
        step: 1000,
      },
      your: { bet: true, last_bet: 52000, win: false },
    },
    payment: { form: 'Безналичная с НДС', delay: 10, delay_type: 'CalendarDays' },
    bets: [
      {
        id: 6,
        organization_name: 'Моя компания',
        organization_id: 14,
        organization_inn: '9616244307',
        subscriber_id: 13,
        price_with_vat: 52000,
        price_no_vat: 43333,
        place: 1,
        isCurrentUser: true,
      },
      {
        id: 7,
        organization_name: 'ДонЛогистик',
        organization_id: 51,
        organization_inn: '6161555444',
        subscriber_id: 50,
        price_with_vat: 54000,
        price_no_vat: 45000,
        place: 2,
        created_at: '2026-07-30T10:30:00',
      },
    ],
  }),
  createAuction({
    id: 1005,
    cargo_num: 'CARGO-1005',
    order_uid: 'a5555555-5555-5555-5555-555555555555',
    auc_type: 'Request',
    created_at: '2026-07-24T14:00:00',
    cargo_date: '2026-08-09T12:00:00',
    price_per_km: 110,
    organizer: {
      organization_name: 'ПАО ВолгаТрейд',
      organization_inn: '6311987654',
      organization_id: 344,
      subscriber_id: 102,
      subscriber_code: '33445',
      infobase_code: 'RU_Cargo_05',
      organization_kpp: '631101001',
    },
    contact: { name: 'Мария Волкова', phone: '+78462221100' },
    load: {
      city: 'Самара',
      address: 'ул. Гаражная, 3',
      date: '2026-08-09T12:00:00',
      end_date: '2026-08-09T15:00:00',
    },
    unload: {
      city: 'Нижний Новгород',
      address: 'ул. Ленина, 88',
      date: '2026-08-10T16:00:00',
      end_date: '2026-08-10T19:00:00',
    },
    cargo: {
      name: 'Бытовая техника',
      weight: 9.2,
      volume: 30,
      body_type: 'Тент',
      distance: 540,
    },
    trading: {
      status: 'Auction',
      status_mobile: 'NotParticipating',
      start_time: '2026-07-29T10:00:00',
      stop_time: '2026-08-01T18:00:00',
      can_set_bet: true,
      allow_counter_bets: true,
      is_bidder: false,
      is_available: true,
      price: {
        start: 80000,
        current: 80000,
        current_no_vat: 66667,
        available: 78000,
        min: 60000,
        max: 90000,
        step: 1000,
      },
      your: { bet: false, last_bet: null },
    },
    payment: { form: 'Безналичная без НДС', delay: 21, delay_type: 'CalendarDays' },
    bets: [],
  }),
  createAuction({
    id: 1006,
    cargo_num: 'CARGO-1006',
    order_uid: 'a6666666-6666-6666-6666-666666666666',
    auc_type: 'Up',
    created_at: '2026-07-25T08:15:00',
    cargo_date: '2026-08-11T07:00:00',
    price_per_km: 165,
    organizer: {
      organization_name: 'ООО ЧерноземЛогистика',
      organization_inn: '3661123456',
      organization_id: 345,
      subscriber_id: 103,
      subscriber_code: '55667',
      infobase_code: 'RU_Cargo_06',
      organization_kpp: '366101001',
    },
    contact: { name: 'Павел Орлов', phone: '+74732556677', email: 'pavel@chernozem.example' },
    load: {
      city: 'Воронеж',
      address: 'ул. Элеваторная, 12',
      date: '2026-08-11T07:00:00',
      end_date: '2026-08-11T10:00:00',
    },
    unload: {
      city: 'Москва',
      address: 'ул. Складочная, 1с1',
      date: '2026-08-12T14:00:00',
      end_date: '2026-08-12T17:00:00',
    },
    cargo: {
      name: 'Зерно в мешках',
      weight: 22,
      volume: 45,
      body_type: 'Зерновоз',
      distance: 520,
      car_type: 'Зерновоз',
    },
    trading: {
      status: 'Auction',
      status_mobile: 'Losing',
      start_time: '2026-07-30T11:00:00',
      stop_time: '2026-07-31T12:00:00',
      can_set_bet: true,
      is_bidder: true,
      is_available: true,
      price: {
        start: 90000,
        current: 98000,
        current_no_vat: 81667,
        available: 100000,
        min: 98000,
        max: 130000,
        step: 2000,
      },
      your: { bet: true, last_bet: 96000 },
    },
    payment: { form: 'Безналичная с НДС', delay: 14, delay_type: 'WorkDays' },
    bets: [
      {
        id: 8,
        organization_name: 'АгроКарго',
        organization_id: 61,
        organization_inn: '3661999000',
        subscriber_id: 60,
        price_with_vat: 98000,
        price_no_vat: 81667,
        place: 1,
      },
      {
        id: 9,
        organization_name: 'Моя компания',
        organization_id: 14,
        organization_inn: '9616244307',
        subscriber_id: 13,
        price_with_vat: 96000,
        price_no_vat: 80000,
        place: 2,
        created_at: '2026-07-30T11:20:00',
        isCurrentUser: true,
      },
    ],
  }),
  createAuction({
    id: 1007,
    cargo_num: 'CARGO-1007',
    order_uid: 'a7777777-7777-7777-7777-777777777777',
    auc_type: 'Down',
    created_at: '2026-07-26T16:40:00',
    cargo_date: '2026-08-14T09:00:00',
    price_per_km: 210,
    organizer: {
      organization_name: 'ООО СибирьФрут',
      organization_inn: '5401987654',
      organization_id: 346,
      subscriber_id: 104,
      subscriber_code: '11223',
      infobase_code: 'RU_Cargo_07',
      organization_kpp: '540101001',
    },
    contact: { name: 'Елена Сидорова', phone: '+73832220011' },
    load: {
      city: 'Новосибирск',
      address: 'ул. Фруктовая, 7',
      date: '2026-08-14T09:00:00',
      end_date: '2026-08-14T12:00:00',
    },
    unload: {
      city: 'Иркутск',
      address: 'ул. Байкальская, 250',
      date: '2026-08-16T18:00:00',
      end_date: '2026-08-16T21:00:00',
    },
    cargo: {
      name: 'Свежие фрукты',
      weight: 14,
      volume: 38,
      body_type: 'Реф',
      distance: 1850,
      temp_from: 4,
      temp_to: 8,
      car_type: 'Реф',
    },
    trading: {
      status: 'Planning',
      status_mobile: 'NotParticipating',
      start_time: '2026-08-01T10:00:00',
      stop_time: '2026-08-03T18:00:00',
      can_set_bet: false,
      is_bidder: false,
      is_available: true,
      price: {
        start: 240000,
        current: 240000,
        current_no_vat: 200000,
        available: null,
        min: 180000,
        max: 240000,
        step: 5000,
      },
      your: { bet: false, last_bet: null },
    },
    payment: { form: 'Безналичная с НДС', delay: 5, delay_type: 'WorkDays' },
    bets: [],
  }),
  createAuction({
    id: 1008,
    cargo_num: 'CARGO-1008',
    order_uid: 'a8888888-8888-8888-8888-888888888888',
    auc_type: 'FixPrice',
    created_at: '2026-07-27T12:00:00',
    cargo_date: '2026-08-18T06:00:00',
    price_per_km: 175,
    organizer: {
      organization_name: 'АО Дальневосточный Порт',
      organization_inn: '2540123456',
      organization_id: 347,
      subscriber_id: 105,
      subscriber_code: '88990',
      infobase_code: 'RU_Cargo_08',
      organization_kpp: '254001001',
    },
    contact: {
      name: 'Дмитрий Портов',
      phone: '+74232221133',
      email: 'd.portov@dvport.example',
    },
    load: {
      city: 'Владивосток',
      address: 'ул. Портовая, 1',
      date: '2026-08-18T06:00:00',
      end_date: '2026-08-18T10:00:00',
    },
    unload: {
      city: 'Хабаровск',
      address: 'ул. Складская, 44',
      date: '2026-08-19T18:00:00',
      end_date: '2026-08-19T21:00:00',
    },
    cargo: {
      name: 'Контейнер 40HC',
      weight: 24,
      volume: 67,
      body_type: 'Контейнеровоз',
      distance: 760,
      truck_count: 1,
      car_type: 'Контейнеровоз',
    },
    trading: {
      status: 'Auction',
      status_mobile: 'NotParticipating',
      start_time: '2026-07-30T07:00:00',
      stop_time: '2026-08-02T19:00:00',
      can_set_bet: true,
      is_bidder: false,
      is_available: true,
      price: {
        start: 150000,
        current: 150000,
        current_no_vat: 125000,
        available: 150000,
        min: 150000,
        max: 150000,
        step: null,
      },
      your: { bet: false, last_bet: null },
    },
    payment: { form: 'Безналичная с НДС', delay: 30, delay_type: 'CalendarDays' },
    bets: [],
  }),
];
