import { zodResolver } from '@hookform/resolvers/zod';
import { getRouteApi } from '@tanstack/react-router';
import { useEffect, type SubmitEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';

import { RoutePaths } from '@/app/links';
import { useCitiesQuery } from '@/entities/city';
import { applyFilterToSearch } from '@/features/auctions-list-filters/model/apply-filter-to-search';
import {
  AUCTION_STATUS_OPTIONS,
  AUCTION_TYPE_OPTIONS,
  FILTER_DEBOUNCE_MS,
  toCityOptions,
  TRADING_STATUS_OPTIONS,
} from '@/features/auctions-list-filters/model/auctions-list-filters.constants';
import {
  auctionsListFiltersFormDefaults,
  auctionsListFiltersFormSchema,
  countActiveFilters,
  toFiltersFormValues,
  type AuctionsListFiltersFormValues,
} from '@/features/auctions-list-filters/model/auctions-list-filters-form.schema';
import type { AuctionsListSearch } from '@/features/auctions-list-filters/model/auctions-list-search.schema';
import { getActiveFilterChips } from '@/features/auctions-list-filters/model/get-active-filter-chips';
import { DrawerNames, drawerApi } from '@/shared/model';
import { Button } from '@/shared/ui/button';
import { Chip } from '@/shared/ui/chip';
import { Drawer } from '@/shared/ui/drawer';
import {
  ComboboxField,
  DatePickerField,
  Form,
  RangeInputField,
  TextField,
  TriStateField,
} from '@/shared/ui/form';
import { Icon } from '@/shared/ui/icon';
import { rememberAuctionsListSearch } from '../model/last-auctions-list-search';

const auctionsListRouteApi = getRouteApi(RoutePaths.home);

export const AuctionsListFilters = () => {
  const search = auctionsListRouteApi.useSearch();
  const navigate = auctionsListRouteApi.useNavigate();
  const { cities } = useCitiesQuery();

  const formValues = toFiltersFormValues(search);
  const activeCount = countActiveFilters(formValues);
  const drawerFilterCount = countActiveFilters({
    ...formValues,
    cargo_num: undefined,
  });
  const chips = getActiveFilterChips(formValues);

  const form = useForm<AuctionsListFiltersFormValues>({
    resolver: zodResolver(auctionsListFiltersFormSchema),
    defaultValues: auctionsListFiltersFormDefaults,
    values: formValues,
  });

  const onFilterChange = (name: string, value: unknown) => {
    void navigate({
      search: (prev) =>
        applyFilterToSearch({ page: 1, ...prev }, name as keyof AuctionsListSearch, value),
    });
  };

  const onRangeChange = (from: number | undefined, to: number | undefined) => {
    void navigate({
      search: (prev) => {
        const withFrom = applyFilterToSearch({ page: 1, ...prev }, 'current_price_from', from);
        return applyFilterToSearch(withFrom, 'current_price_to', to);
      },
    });
  };

  const onInputChange = useDebounceCallback(onFilterChange, FILTER_DEBOUNCE_MS);
  const onDebouncedRangeChange = useDebounceCallback(onRangeChange, FILTER_DEBOUNCE_MS);

  const resetFilters = () => {
    onInputChange.cancel();
    onDebouncedRangeChange.cancel();
    form.reset(auctionsListFiltersFormDefaults);
    void navigate({ search: { page: 1 } });
  };

  const applySearch = () => {
    onInputChange.flush();
    onDebouncedRangeChange.flush();
    const cargoNum = form.getValues('cargo_num')?.trim();
    onFilterChange('cargo_num', cargoNum || undefined);
  };

  const cityOptions = toCityOptions(cities);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    applySearch();
  };

  useEffect(() => {
    rememberAuctionsListSearch(search);
  }, [search]);

  return (
    <div className="space-y-3">
      <Form onSubmit={handleSubmit} form={form}>
        <div className="flex items-center gap-2">
          <TextField
            startContent={<Icon name="common:magnifier" className="size-5.5" />}
            className="w-full [&_#wrapper]:h-12"
            name="cargo_num"
            placeholder="Номер заявки, например CARGO-…"
            onChange={onInputChange}
          />

          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => drawerApi.open(DrawerNames.auctionsFilters)}
            >
              <Icon name="common:sliders" className="size-4" />
              Фильтры
              {drawerFilterCount > 0 && (
                <span className="rounded-md bg-accent px-1.5 py-1.5 text-xs text-white min-w-6">
                  {drawerFilterCount}
                </span>
              )}
            </Button>

            <Button type="button" variant="primary" onClick={applySearch}>
              Найти
            </Button>
          </div>
        </div>
      </Form>

      {(chips.length > 0 || activeCount > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <Chip
              key={chip.id}
              size="md"
              onRemove={() => {
                void navigate({ search: chip.clear });
              }}
            >
              {chip.label}
            </Chip>
          ))}

          {activeCount > 0 && (
            <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
              Сбросить всё
            </Button>
          )}
        </div>
      )}

      <Drawer
        name={DrawerNames.auctionsFilters}
        title="Фильтры"
        footer={
          <div className="flex items-center justify-between gap-20">
            <Button type="button" variant="ghost" onClick={resetFilters}>
              Сбросить
            </Button>

            <Button
              fullWidth
              type="button"
              variant="primary"
              onClick={() => drawerApi.close(DrawerNames.auctionsFilters)}
            >
              Готово
            </Button>
          </div>
        }
      >
        <Form form={form} className="space-y-3">
          <TextField
            name="cargo_num"
            label="Номер заявки"
            placeholder="CARGO-…"
            onChange={onInputChange}
          />

          <ComboboxField
            name="load_city"
            label="Город погрузки"
            options={cityOptions}
            placeholder="Любой"
            onChange={onFilterChange}
          />

          <ComboboxField
            name="unload_city"
            label="Город выгрузки"
            options={cityOptions}
            placeholder="Любой"
            onChange={onFilterChange}
          />

          <ComboboxField
            name="auc_type"
            label="Тип аукциона"
            options={AUCTION_TYPE_OPTIONS}
            multiple
            placeholder="Любой"
            onChange={onFilterChange}
          />

          <ComboboxField
            name="status"
            label="Торговый статус"
            options={TRADING_STATUS_OPTIONS}
            multiple
            placeholder="Любой"
            onChange={onFilterChange}
          />

          <ComboboxField
            name="statuses"
            label="Статус аукциона"
            options={AUCTION_STATUS_OPTIONS}
            multiple
            placeholder="Любой"
            onChange={onFilterChange}
          />

          <DatePickerField
            name="load_date_from"
            label="Дата погрузки от"
            onChange={onFilterChange}
          />

          <DatePickerField name="load_date_to" label="Дата погрузки до" onChange={onFilterChange} />

          <TriStateField
            name="is_available"
            label="Доступен для ставки"
            onChange={onFilterChange}
          />

          <TriStateField name="is_bidder" label="Участвую" onChange={onFilterChange} />

          <RangeInputField
            fromName="current_price_from"
            toName="current_price_to"
            label="Цена"
            min={0}
            max={500_000}
            step={1000}
            onRangeChange={onDebouncedRangeChange}
          />
        </Form>
      </Drawer>
    </div>
  );
};
