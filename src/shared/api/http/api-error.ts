import { type AxiosError, isAxiosError } from 'axios';

import type { ProblemDetail, ValidationProblem } from '@/shared/api/contracts/auctions';

export type ApiErrorBody = Partial<ProblemDetail> &
  Partial<ValidationProblem> & {
    detail?: Array<{
      loc?: Array<string | number>;
      msg?: string;
      type?: string;
    }>;
  };

export class ApiError extends Error {
  readonly status: number | null;
  readonly data: ApiErrorBody | null;
  readonly code: string | null;
  readonly isValidationError: boolean;

  constructor(params: { message: string; status?: number | null; data?: ApiErrorBody | null }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status ?? null;
    this.data = params.data ?? null;
    this.code = params.data?.code ?? null;
    this.isValidationError = this.status === 422 || this.code === 'validation_failed';
  }
}

export const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (isAxiosError<ApiErrorBody>(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;
    const status = axiosError.response?.status ?? null;
    const data = axiosError.response?.data ?? null;

    const fieldMessages =
      data?.errors
        ?.map((item) => item.message?.trim())
        .filter((message): message is string => Boolean(message)) ?? [];

    const detailMessages =
      data?.detail
        ?.map((item) => item.msg?.trim())
        .filter((message): message is string => Boolean(message)) ?? [];

    const message =
      (fieldMessages.length > 0 ? fieldMessages.join(', ') : undefined) ??
      (detailMessages.length > 0 ? detailMessages.join(', ') : undefined) ??
      data?.message ??
      data?.title ??
      axiosError.message ??
      'Request failed';

    return new ApiError({ message, status, data });
  }

  if (error instanceof Error) {
    return new ApiError({ message: error.message });
  }

  return new ApiError({ message: 'Unknown request error' });
};
