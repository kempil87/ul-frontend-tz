type TradingOfferState =
  | {
      can_set_bet?: boolean | null;
      status_mobile?: string | null;
    }
  | null
  | undefined;

/** Ставку можно предлагать, только если API разрешает и мы ещё не лидируем. */
export const canOfferBet = (trading: TradingOfferState) =>
  Boolean(trading?.can_set_bet) && trading?.status_mobile !== 'Leading';

export const isLeading = (trading: TradingOfferState) => trading?.status_mobile === 'Leading';
