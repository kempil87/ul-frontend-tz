import { getRouteApi, Link, Navigate } from '@tanstack/react-router';

import { AppLinks, RoutePaths } from '@/app/links';
import { useAuctionDetailQuery } from '@/entities/auction/api/auction-detail.query';
import {
  AUCTION_TYPE_LABEL,
  getTradingStatusChipVariant,
  TRADING_STATUS_LABEL,
} from '@/entities/auction/model/auction.labels';
import { canOfferBet } from '@/entities/auction/model/auction.permissions';
import { getLastAuctionsListSearch } from '@/features/auctions-list-filters';
import { SetAuctionBetForm } from '@/features/set-auction-bet';
import { ApiError } from '@/shared/api';
import { dateService } from '@/shared/lib/date';
import { priceService } from '@/shared/lib/price';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Chip } from '@/shared/ui/chip';
import { PageLoader } from '@/shared/ui/page-loader';

const auctionBetRouteApi = getRouteApi(RoutePaths.auctionBet);

export const AuctionSetBetPage = () => {
  const { auctionUuid } = auctionBetRouteApi.useParams();
  const listSearch = getLastAuctionsListSearch();
  const { auction, isPending, isError, error, refetch, isFetching } =
    useAuctionDetailQuery(auctionUuid);

  if (isPending) {
    return <PageLoader />;
  }

  if (isError || !auction) {
    return (
      <Card className="mx-auto max-w-lg space-y-4" padding="lg">
        <div>
          <p className="text-base font-semibold text-text">Не удалось загрузить аукцион</p>
          <p className="mt-1 text-sm text-muted">
            {error instanceof ApiError
              ? error.message
              : 'Аукцион не найден или временно недоступен'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => void refetch()} disabled={isFetching}>
            Повторить
          </Button>

          <Button asChild variant="ghost">
            <Link to={AppLinks.home()} search={listSearch}>
              К списку
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  if (!canOfferBet(auction.trading)) {
    return <Navigate to={AppLinks.auctionDetail(auctionUuid)} replace />;
  }

  const { main, routes, trading } = auction;
  const price = trading.price;
  const hasMyBet = Boolean(trading.your?.bet);
  const aucType = main.auc_type ?? 'Unknown';
  const tradingStatus = trading.status_mobile ?? 'Unknown';
  const loadPoint = routes[0];
  const unloadPoint = routes[routes.length - 1];

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to={AppLinks.auctionDetail(auctionUuid)}>← К аукциону</Link>
      </Button>

      <Card padding="none" bordered={false} className="space-y-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text">
            {hasMyBet ? 'Изменить ставку' : 'Сделать ставку'}
          </h1>
          <p className="mt-1 text-sm text-muted">{main.cargo_num}</p>
        </div>

        <div>
          <p className="text-lg font-semibold text-text">
            {loadPoint?.location?.city_name ?? '—'}
            <span className="mx-2 font-medium text-muted">→</span>
            {unloadPoint?.location?.city_name ?? '—'}
          </p>
          <p className="mt-1 text-sm text-muted">
            Погрузка {dateService.format(loadPoint?.start_date ?? loadPoint?.end_date)}
            <span className="mx-2 text-border">·</span>
            Разгрузка {dateService.format(unloadPoint?.start_date ?? unloadPoint?.end_date)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip>{AUCTION_TYPE_LABEL[aucType]}</Chip>

          <Chip variant={getTradingStatusChipVariant(tradingStatus)}>
            {TRADING_STATUS_LABEL[tradingStatus] ?? tradingStatus}
          </Chip>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted">Текущая</dt>
            <dd className="mt-0.5 font-semibold text-text">
              {priceService.format(price?.current)}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Доступная</dt>
            <dd className="mt-0.5 font-semibold text-text">
              {priceService.format(price?.available)}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Шаг</dt>
            <dd className="mt-0.5 font-semibold text-text">{priceService.format(price?.step)}</dd>
          </div>
          <div>
            <dt className="text-muted">Моя ставка</dt>
            <dd className="mt-0.5 font-semibold text-text">
              {trading.your?.bet
                ? priceService.format(trading.your.last_bet_with_vat ?? trading.your.last_bet)
                : 'Нет'}
            </dd>
          </div>
        </dl>

        <SetAuctionBetForm
          className="w-full sm:flex-col *:w-full"
          auctionUuid={auctionUuid}
          available={price?.available}
          min={price?.min}
          max={price?.max}
          step={price?.step}
        />
      </Card>
    </div>
  );
};
