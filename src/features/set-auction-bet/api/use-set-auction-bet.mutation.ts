import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { auctionsQueryKeys } from '@/entities/auction/api/auctions.query-keys';
import { ApiError, auctionsApi } from '@/shared/api';

type SetBetVariables = {
  auctionUuid: string;
  price: number;
};

export const useSetAuctionBetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ auctionUuid, price }: SetBetVariables) =>
      auctionsApi.setBet(auctionUuid, { price }),
    onSuccess: async (_data, { auctionUuid }) => {
      toast.success('Ставка принята');

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: auctionsQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: auctionsQueryKeys.detail(auctionUuid) }),
        queryClient.invalidateQueries({
          queryKey: [...auctionsQueryKeys.all, 'bets', auctionUuid],
        }),
      ]);
    },
    onError: (error) => {
      const apiError = error instanceof ApiError ? error : null;
      toast.error(apiError?.message ?? 'Не удалось установить ставку');
    },
  });
};
