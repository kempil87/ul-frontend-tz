import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import { AppLinks, RoutePaths } from '@/app/links';
import { useAuctionsListQuery } from '@/entities/auction/api/use-auctions-list.query';
import { AuctionCard } from '@/entities/auction/ui/auction-card.component';
import { AuctionCardSkeleton } from '@/entities/auction/ui/auction-card-skeleton.component';
import { AuctionsListFilters, toAuctionsListRequest } from '@/features/auctions-list-filters';
import { ApiError } from '@/shared/api';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Pagination } from '@/shared/ui/pagination';

const auctionsListRouteApi = getRouteApi(RoutePaths.home);

export const AuctionsListPage = () => {
  const search = auctionsListRouteApi.useSearch();
  const navigate = auctionsListRouteApi.useNavigate();
  const openAuction = useNavigate();

  const {
    auctions,
    total,
    lastPage,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
    isPlaceholderData,
  } = useAuctionsListQuery(toAuctionsListRequest(search));

  const isInitialLoading = isPending && !isPlaceholderData;
  const isRefetching = isFetching && !isInitialLoading;

  useEffect(() => {
    if (isFetching || isPlaceholderData || isError) return;
    if (search.page <= lastPage) return;

    navigate({
      search: (prev) => ({ ...prev, page: Math.max(1, lastPage) }),
      replace: true,
    });
  }, [isFetching, isPlaceholderData, isError, search.page, lastPage, navigate]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-text">
          Аукционы {total > 0 && <span className="font-medium text-muted">({total})</span>}
        </h1>

        <AuctionsListFilters />
      </div>

      {isInitialLoading && (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <AuctionCardSkeleton key={index} />
          ))}
        </div>
      )}

      {isError && (
        <Card className="flex flex-col items-start gap-3">
          <div>
            <p className="text-sm font-medium text-text">Не удалось загрузить аукционы</p>

            <p className="mt-1 text-sm text-muted">
              {error instanceof ApiError ? error.message : 'Попробуйте обновить список'}
            </p>
          </div>

          <Button variant="secondary" onClick={() => void refetch()} disabled={isFetching}>
            Повторить
          </Button>
        </Card>
      )}

      {!isInitialLoading && !isError && auctions.length === 0 && (
        <Card padding="lg" className="text-sm text-muted">
          Аукционы не найдены
        </Card>
      )}

      {!isInitialLoading && !isError && auctions.length > 0 && (
        <>
          <div
            className={cn('flex flex-col gap-4 transition-opacity', isRefetching && 'opacity-60')}
          >
            {auctions.map((auction) => {
              const auctionUuid = auction.main?.order_uid ?? '';

              return (
                <AuctionCard
                  key={auctionUuid || auction.main?.cargo_num}
                  auction={auction}
                  onOpen={(uuid) => {
                    void openAuction({ to: AppLinks.auctionDetail(uuid) });
                  }}
                  onBet={(uuid) => {
                    void openAuction({ to: AppLinks.auctionBet(uuid) });
                  }}
                />
              );
            })}
          </div>

          <Pagination
            page={Math.min(search.page, lastPage)}
            lastPage={lastPage}
            disabled={isFetching}
            onPageChange={(page) => {
              void navigate({
                search: (prev) => ({ ...prev, page }),
              });
            }}
          />
        </>
      )}
    </div>
  );
};
