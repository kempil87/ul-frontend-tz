import type { ReactNode } from 'react';

import { Card } from '@/shared/ui/card';

type AuctionDetailSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
};

export const AuctionDetailSection = ({
  title,
  children,
  className,
  action,
}: AuctionDetailSectionProps) => {
  return (
    <Card as="section" className={className}>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-bold text-text">{title}</h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </Card>
  );
};

type InfoRowProps = {
  label: string;
  value?: ReactNode;
};

export const AuctionDetailInfoRow = ({ label, value }: InfoRowProps) => {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-2.5 text-sm last:border-b-0">
      <span className="shrink-0 font-medium text-text">{label}</span>

      <span className="text-right font-medium text-muted">{value ?? '—'}</span>
    </div>
  );
};
