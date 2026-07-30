import type { AuctionListItem } from '@/shared/api/contracts/auctions';
import { dateService } from '@/shared/lib/date';
import { priceService } from '@/shared/lib/price';
import { getPrefetchIntentProps, useDebouncedPrefetchQuery } from '@/shared/lib/query';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Chip } from '@/shared/ui/chip';
import { auctionDetailQueryOptions } from '../api/auction-detail.query';
import {
  AUCTION_STATUS_LABEL,
  AUCTION_TYPE_LABEL,
  getTradingStatusChipVariant,
  TRADING_STATUS_LABEL,
} from '../model/auction.labels';
import { canOfferBet, isLeading } from '../model/auction.permissions';

type PrimaryActionIntent = 'bet' | 'detail' | 'none';

const getPrimaryAction = (auction: AuctionListItem) => {
  const offerBet = canOfferBet(auction.trading);
  const hasMyBet = Boolean(auction.trading?.your?.bet);

  if (offerBet && hasMyBet) {
    return {
      label: 'Изменить ставку',
      disabled: false,
      variant: 'primary' as const,
      intent: 'bet' as const satisfies PrimaryActionIntent,
    };
  }

  if (offerBet) {
    return {
      label: 'Сделать ставку',
      disabled: false,
      variant: 'primary' as const,
      intent: 'bet' as const satisfies PrimaryActionIntent,
    };
  }

  if (isLeading(auction.trading)) {
    return {
      label: 'Вы лидируете',
      disabled: false,
      variant: 'secondary' as const,
      intent: 'detail' as const satisfies PrimaryActionIntent,
    };
  }

  if (auction.trading?.status !== 'Finished' && auction.trading?.status !== 'Canceled') {
    return {
      label: 'Смотреть ставки',
      disabled: false,
      variant: 'secondary' as const,
      intent: 'detail' as const satisfies PrimaryActionIntent,
    };
  }

  return {
    label: 'Ставки недоступны',
    disabled: true,
    variant: 'soft' as const,
    intent: 'none' as const satisfies PrimaryActionIntent,
  };
};

type AuctionCardProps = {
  auction: AuctionListItem;
  className?: string;
  onOpen?: (auctionUuid: string) => void;
  onBet?: (auctionUuid: string) => void;
};

export const AuctionCard = ({ auction, className, onOpen, onBet }: AuctionCardProps) => {
  const primaryAction = getPrimaryAction(auction);
  const auctionUuid = auction.main?.order_uid ?? '';
  const aucType = auction.main?.auc_type ?? 'Unknown';
  const status = auction.trading?.status ?? 'Unknown';
  const tradingStatus = auction.trading?.status_mobile ?? 'Unknown';
  const hasMyBet = Boolean(auction.trading?.your?.bet);

  const openAuction = () => {
    if (auctionUuid) onOpen?.(auctionUuid);
  };

  const handlePrimaryAction = () => {
    if (!auctionUuid || primaryAction.disabled) return;

    if (primaryAction.intent === 'bet') {
      onBet?.(auctionUuid);
      return;
    }

    if (primaryAction.intent === 'detail') {
      onOpen?.(auctionUuid);
    }
  };

  const { onPrefetchIntent, onPrefetchCancel } =
    useDebouncedPrefetchQuery(auctionDetailQueryOptions);

  const prefetchIntentProps = getPrefetchIntentProps(auctionUuid, {
    onPrefetchIntent,
    onPrefetchCancel,
  });

  return (
    <Card as="article" hoverable className={className} {...prefetchIntentProps}>
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-8">
        <button type="button" className="min-w-0 flex-1 text-left" onClick={openAuction}>
          <p className="text-xl font-bold tracking-tight text-text md:text-2xl">
            {auction.route?.load?.city ?? '—'}
            <span className="mx-2 font-medium text-muted">→</span>
            {auction.route?.unload?.city ?? '—'}
          </p>

          <p className="mt-1 text-sm text-muted">{auction.main?.cargo_num ?? '—'}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Chip>{AUCTION_TYPE_LABEL[aucType]}</Chip>
            <Chip>{AUCTION_STATUS_LABEL[status]}</Chip>
            <Chip variant={getTradingStatusChipVariant(tradingStatus)}>
              {TRADING_STATUS_LABEL[tradingStatus] ?? tradingStatus}
            </Chip>
            {hasMyBet ? (
              <Chip variant="accent">Моя ставка есть</Chip>
            ) : (
              <Chip variant="muted">Моей ставки нет</Chip>
            )}
          </div>

          <p className="mt-4 text-sm text-muted">
            Погрузка {dateService.format(auction.route?.load?.date)}
            <span className="mx-2 text-border">·</span>
            Разгрузка {dateService.format(auction.route?.unload?.date)}
          </p>

          <p className="mt-2 text-sm text-text">
            {auction.cargo?.name ?? '—'}
            <span className="text-muted">
              {' '}
              · {auction.cargo?.weight ?? '—'} т · {auction.cargo?.volume ?? '—'} м³ ·{' '}
              {auction.cargo?.body_type ?? '—'}
            </span>
          </p>
        </button>

        <div className="flex shrink-0 flex-col gap-4 md:items-end md:text-right">
          <div>
            <p className="text-xs text-muted">Текущая цена</p>
            <p className="mt-0.5 text-2xl font-bold tracking-tight text-text">
              {priceService.format(auction.trading?.price?.current)}
            </p>
            <p className="mt-1 text-xs text-muted">
              {priceService.format(auction.main?.price_per_km)} / км
            </p>
          </div>

          <Button
            variant={primaryAction.variant}
            disabled={primaryAction.disabled}
            className="min-w-44"
            onClick={handlePrimaryAction}
          >
            {primaryAction.label}
          </Button>
        </div>
      </div>
    </Card>
  );
};
