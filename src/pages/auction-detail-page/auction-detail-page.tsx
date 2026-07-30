import { getRouteApi, Link } from '@tanstack/react-router';

import { AppLinks, RoutePaths } from '@/app/links';
import { useAuctionBetsQuery } from '@/entities/auction/api/auction-bets.query';
import { useAuctionDetailQuery } from '@/entities/auction/api/auction-detail.query';
import { canOfferBet } from '@/entities/auction/model/auction.permissions';
import { AuctionBetsSection } from '@/entities/auction/ui/auction-bets-section.component';
import { AuctionDetailView } from '@/entities/auction/ui/auction-detail-view.component';
import { auctionsListSearchDefaults } from '@/features/auctions-list-filters';
import { SetAuctionBetForm } from '@/features/set-auction-bet';
import { ApiError } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { PageLoader } from '@/shared/ui/page-loader';

const auctionDetailRouteApi = getRouteApi(RoutePaths.auctionDetail);

export const AuctionDetailPage = () => {
  const { auctionUuid } = auctionDetailRouteApi.useParams();
  const { auction, isPending, isError, error, refetch, isFetching } =
    useAuctionDetailQuery(auctionUuid);
  const hideBetsHistory = Boolean(auction?.hide_bets_history || auction?.trading.hide_bets_history);

  const betsQuery = useAuctionBetsQuery(auctionUuid, {
    enabled: Boolean(auctionUuid) && !hideBetsHistory,
  });

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
            <Link to={AppLinks.home()} search={auctionsListSearchDefaults}>
              К списку
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  const price = auction.trading.price;

  return (
    <AuctionDetailView
      auction={auction}
      betsSlot={
        <AuctionBetsSection
          bets={betsQuery.bets}
          isPending={betsQuery.isPending}
          isError={betsQuery.isError}
          hideBetsHistory={hideBetsHistory}
        />
      }
      betFormSlot={
        canOfferBet(auction.trading) ? (
          <SetAuctionBetForm
            auctionUuid={auctionUuid}
            available={price?.available}
            min={price?.min}
            max={price?.max}
            step={price?.step}
          />
        ) : undefined
      }
    />
  );
};
