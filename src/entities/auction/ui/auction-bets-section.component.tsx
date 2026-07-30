import type { BetItem } from '@/shared/api/contracts/auctions';
import { dateService } from '@/shared/lib/date';
import { priceService } from '@/shared/lib/price';
import { Card } from '@/shared/ui/card';
import { Chip } from '@/shared/ui/chip';
import { PageLoader } from '@/shared/ui/page-loader';
import { AuctionDetailSection } from '@/entities/auction/ui/auction-detail-section.component';

type AuctionBetsSectionProps = {
  bets: BetItem[];
  isPending: boolean;
  isError: boolean;
  hideBetsHistory?: boolean;
};

export const AuctionBetsSection = ({
  bets,
  isPending,
  isError,
  hideBetsHistory = false,
}: AuctionBetsSectionProps) => {
  if (hideBetsHistory) {
    return (
      <AuctionDetailSection title="История ставок">
        <p className="text-sm text-muted">История ставок скрыта организатором.</p>
      </AuctionDetailSection>
    );
  }

  if (isPending) {
    return (
      <AuctionDetailSection title="История ставок">
        <PageLoader className="min-h-24" />
      </AuctionDetailSection>
    );
  }

  if (isError) {
    return (
      <AuctionDetailSection title="История ставок">
        <p className="text-sm text-danger">Не удалось загрузить ставки</p>
      </AuctionDetailSection>
    );
  }

  if (bets.length === 0) {
    return (
      <AuctionDetailSection title="История ставок">
        <p className="text-sm text-muted">Ставок пока нет</p>
      </AuctionDetailSection>
    );
  }

  const participants = new Set(bets.map((bet) => bet.organization_id ?? bet.organization_inn)).size;

  return (
    <AuctionDetailSection
      title="История ставок"
      action={<span className="text-sm text-muted">Участников: {participants}</span>}
    >
      <div className="space-y-3">
        {bets.map((bet) => {
          const cancelled = Boolean(bet.cancel_reason);

          return (
            <Card bordered={false} className="bg-chip" key={bet.id} as="article" padding="sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-text">
                    {bet.organization_name || bet.contact_name || 'Перевозчик'}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {dateService.formatDateTime(bet.created_at)}
                    {bet.place != null ? ` · Место ${bet.place}` : ''}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-text">{priceService.format(bet.price_with_vat)}</p>
                  <p className="text-xs text-muted">
                    без НДС {priceService.format(bet.price_no_vat)}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {bet.is_win && <Chip variant="success">Победитель</Chip>}
                {cancelled && <Chip variant="danger">Отменена</Chip>}
                {bet.is_counter && <Chip variant="link">Контрставка</Chip>}
              </div>

              {cancelled && (
                <p className="mt-2 text-sm text-danger">Причина: {bet.cancel_reason}</p>
              )}
            </Card>
          );
        })}
      </div>
    </AuctionDetailSection>
  );
};
