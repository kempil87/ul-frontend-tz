import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';

import { AppLinks } from '@/app/links';
import {
  AUCTION_STATUS_LABEL,
  AUCTION_TYPE_LABEL,
  getTradingStatusChipVariant,
  OPERATION_TYPE_LABEL,
  PAYMENT_DELAY_LABEL,
  TRADING_STATUS_LABEL,
} from '@/entities/auction/model/auction.labels';
import {
  AuctionDetailInfoRow,
  AuctionDetailSection,
} from '@/entities/auction/ui/auction-detail-section.component';
import type { AuctionsListSearch } from '@/features/auctions-list-filters';
import type { AuctionShowResponse } from '@/shared/api/contracts/auctions';
import { dateService } from '@/shared/lib/date';
import { priceService } from '@/shared/lib/price';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Chip } from '@/shared/ui/chip';

type AuctionDetailViewProps = {
  auction: AuctionShowResponse;
  betsSlot?: ReactNode;
  betFormSlot?: ReactNode;
  /** Preserves auctions list filters when navigating back. */
  listSearch?: AuctionsListSearch;
};

const boolFlags = (flags: Record<string, boolean | null | undefined>) =>
  Object.entries(flags)
    .filter(([, value]) => Boolean(value))
    .map(([key]) => key);

export const AuctionDetailView = ({
  auction,
  betsSlot,
  betFormSlot,
  listSearch = { page: 1 },
}: AuctionDetailViewProps) => {
  const { main, organizer, contacts, cargo, trading, payment, routes } = auction;
  const status = trading.status ?? 'Unknown';
  const tradingStatus = trading.status_mobile ?? 'Unknown';
  const aucType = main.auc_type ?? 'Unknown';
  const price = trading.price;
  const your = trading.your;

  const loadingTypes = boolFlags({
    Боковая: cargo.loading_types?.side,
    Верхняя: cargo.loading_types?.top,
    Задняя: cargo.loading_types?.rear,
    Полная: cargo.loading_types?.full,
  });

  const docs = boolFlags({
    TIR: cargo.docs?.tir,
    CMR: cargo.docs?.cmr,
    T1: cargo.docs?.t1,
    Медкнижка: cargo.docs?.med,
  });

  const restrictions = [
    trading.status_mobile === 'Leading' ? 'Вы лидируете — перебивать свою ставку не нужно' : null,
    trading.can_set_bet === false ? 'Ставка недоступна' : null,
    trading.hide_bets_history || auction.hide_bets_history ? 'История ставок скрыта' : null,
    trading.hide_points_address_and_contacts ? 'Адреса и контакты скрыты' : null,
    trading.no_view_cargo_price ? 'Цены скрыты' : null,
  ].filter(Boolean) as string[];

  return (
    <div className={betFormSlot ? 'space-y-6 pb-28' : 'space-y-6'}>
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to={AppLinks.home()} search={listSearch}>
            ← К списку аукционов
          </Link>
        </Button>

        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-muted">{main.cargo_num ?? '—'}</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-text md:text-3xl">
                {routes[0]?.location?.city_name ?? '—'}
                <span className="mx-2 font-medium text-muted">→</span>
                {routes[routes.length - 1]?.location?.city_name ?? '—'}
              </h1>

              <div className="mt-3 flex flex-wrap gap-2">
                <Chip>{AUCTION_TYPE_LABEL[aucType]}</Chip>
                <Chip>{AUCTION_STATUS_LABEL[status]}</Chip>
                <Chip variant={getTradingStatusChipVariant(tradingStatus)}>
                  {TRADING_STATUS_LABEL[tradingStatus] ?? tradingStatus}
                </Chip>
                {your?.bet ? (
                  <Chip variant="accent">Моя ставка есть</Chip>
                ) : (
                  <Chip variant="muted">Моей ставки нет</Chip>
                )}
              </div>
            </div>

            <div className="md:text-right">
              <p className="text-xs text-muted">Текущая цена</p>
              <p className="text-3xl font-bold text-text">{priceService.format(price?.current)}</p>
              <p className="mt-1 text-sm text-muted">
                без НДС {priceService.format(price?.current_no_vat)}
              </p>
            </div>
          </div>

          {restrictions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {restrictions.map((item) => (
                <Chip key={item} variant="muted">
                  {item}
                </Chip>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <AuctionDetailSection title="Основные данные">
            <AuctionDetailInfoRow label="Номер заявки" value={main.cargo_num} />
            <AuctionDetailInfoRow label="ID" value={main.id} />
            <AuctionDetailInfoRow
              label="Дата груза"
              value={dateService.formatDateTime(main.cargo_date)}
            />
            <AuctionDetailInfoRow
              label="Создан"
              value={dateService.formatDateTime(main.created_at)}
            />
            <AuctionDetailInfoRow label="Тип" value={AUCTION_TYPE_LABEL[aucType]} />
          </AuctionDetailSection>

          <AuctionDetailSection title="Организатор">
            <AuctionDetailInfoRow label="Организация" value={organizer.organization_name} />
            <AuctionDetailInfoRow label="ИНН" value={organizer.organization_inn} />
            <AuctionDetailInfoRow label="КПП" value={organizer.organization_kpp} />
            <AuctionDetailInfoRow label="Код" value={organizer.subscriber_code} />
          </AuctionDetailSection>

          <AuctionDetailSection title="Контакты">
            {trading.hide_points_address_and_contacts || contacts.length === 0 ? (
              <p className="text-sm text-muted">
                {trading.hide_points_address_and_contacts
                  ? 'Контакты скрыты'
                  : 'Контакты не указаны'}
              </p>
            ) : (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div key={contact.uid ?? contact.phone ?? contact.name} className="text-sm">
                    <p className="font-medium text-text">{contact.name || '—'}</p>
                    <p className="text-muted">
                      {[contact.phone, contact.work_phone, contact.email]
                        .filter(Boolean)
                        .join(' · ') || '—'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </AuctionDetailSection>

          <AuctionDetailSection title="Маршрут">
            <div className="space-y-4">
              {routes.map((point, index) => (
                <Card
                  bordered={false}
                  className="bg-chip"
                  key={`${point.row_num}-${index}`}
                  padding="sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-text">
                      {point.location?.city_full_name || point.location?.city_name || '—'}
                    </span>

                    <Chip size="sm" variant="accent">
                      {OPERATION_TYPE_LABEL[point.op_type ?? 'Unknown'] ?? point.op_type}
                    </Chip>
                  </div>

                  <p className="mt-2 text-sm text-muted">
                    {point.location?.loading_address ||
                      (trading.hide_points_address_and_contacts
                        ? 'Адрес скрыт'
                        : 'Адрес не указан')}
                  </p>

                  <p className="mt-2 text-sm text-text">
                    {dateService.formatDateTime(point.start_date)}
                    {' – '}
                    {dateService.formatDateTime(point.end_date)}
                  </p>

                  {(point.contact?.name || point.contact?.phone) && (
                    <p className="mt-2 text-sm text-muted">
                      Контакт:{' '}
                      {[point.contact.name, point.contact.phone].filter(Boolean).join(', ')}
                    </p>
                  )}

                  {point.cargo?.name && (
                    <p className="mt-2 text-sm text-text">
                      {point.cargo.name}
                      <span className="text-muted">
                        {' '}
                        · {point.cargo.weight ?? '—'} т · {point.cargo.volume ?? '—'} м³
                      </span>
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </AuctionDetailSection>

          <AuctionDetailSection title="Груз и ТС">
            <AuctionDetailInfoRow
              label="Цена груза"
              value={
                trading.no_view_cargo_price
                  ? 'Скрыта'
                  : cargo.price
                    ? priceService.format(Number(cargo.price))
                    : '—'
              }
            />
            <AuctionDetailInfoRow
              label="Расстояние"
              value={cargo.distance != null ? `${cargo.distance} км` : '—'}
            />
            <AuctionDetailInfoRow label="Кузов" value={cargo.body_type} />
            <AuctionDetailInfoRow label="Кол-во ТС" value={cargo.truck_count} />
            <AuctionDetailInfoRow label="Тип ТС" value={cargo.car?.type} />
            <AuctionDetailInfoRow
              label="Требования ТС"
              value={
                cargo.car ? `${cargo.car.weight ?? '—'} т · ${cargo.car.volume ?? '—'} м³` : '—'
              }
            />
            <AuctionDetailInfoRow
              label="Погрузка"
              value={loadingTypes.length ? loadingTypes.join(', ') : '—'}
            />
            <AuctionDetailInfoRow label="Документы" value={docs.length ? docs.join(', ') : '—'} />
          </AuctionDetailSection>

          <AuctionDetailSection title="Оплата">
            <AuctionDetailInfoRow label="Форма" value={payment.form} />
            <AuctionDetailInfoRow label="Условие" value={payment.condition} />
            <AuctionDetailInfoRow
              label="Отсрочка"
              value={
                payment.delay != null
                  ? `${payment.delay} ${PAYMENT_DELAY_LABEL[payment.delay_type ?? 'Unknown'] ?? ''}`.trim()
                  : '—'
              }
            />
            <AuctionDetailInfoRow label="Предоплата" value={payment.prepay || '—'} />
            <AuctionDetailInfoRow label="Валюта" value={payment.currency_code} />
          </AuctionDetailSection>

          {betsSlot}
        </div>

        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <AuctionDetailSection title="Торги">
            <AuctionDetailInfoRow
              label="Старт"
              value={dateService.formatDateTime(trading.start_time)}
            />
            <AuctionDetailInfoRow
              label="Стоп"
              value={dateService.formatDateTime(trading.stop_time)}
            />
            <AuctionDetailInfoRow label="Текущая" value={priceService.format(price?.current)} />
            <AuctionDetailInfoRow label="Доступная" value={priceService.format(price?.available)} />
            <AuctionDetailInfoRow label="Min" value={priceService.format(price?.min)} />
            <AuctionDetailInfoRow label="Max" value={priceService.format(price?.max)} />
            <AuctionDetailInfoRow label="Шаг" value={priceService.format(price?.step)} />
            <AuctionDetailInfoRow label="₽ / км" value={priceService.format(price?.price_per_km)} />
            <AuctionDetailInfoRow
              label="Моя ставка"
              value={
                your?.bet ? priceService.format(your.last_bet_with_vat ?? your.last_bet) : 'Нет'
              }
            />
            <AuctionDetailInfoRow label="Победа" value={your?.win ? 'Да' : 'Нет'} />
            {trading.settings?.prolong_after_bet != null && (
              <AuctionDetailInfoRow
                label="Продление"
                value={`${trading.settings.prolong_after_bet} мин`}
              />
            )}
          </AuctionDetailSection>
        </div>
      </div>

      {betFormSlot && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-border bg-raised/95 px-4 py-3 backdrop-blur md:px-6">
          <div className="mx-auto max-w-6xl">{betFormSlot}</div>
        </div>
      )}
    </div>
  );
};
