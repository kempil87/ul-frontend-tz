import { useQuery } from '@tanstack/react-query';

import { citiesQueryKeys } from '@/entities/city/api/cities.query-keys';
import { citiesApi } from '@/shared/api';

export const useCitiesQuery = () => {
  const { data, ...query } = useQuery({
    queryKey: citiesQueryKeys.list(),
    queryFn: () => citiesApi.list(),
    staleTime: 5 * 60_000,
  });

  return {
    cities: data?.items ?? [],
    ...query,
  };
};
