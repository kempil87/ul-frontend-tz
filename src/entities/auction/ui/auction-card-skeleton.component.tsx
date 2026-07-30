import { Card } from '@/shared/ui/card';
import { cn } from '@/shared/lib/cn';

type AuctionCardSkeletonProps = {
  className?: string;
};

export const AuctionCardSkeleton = ({ className }: AuctionCardSkeletonProps) => {
  return (
    <Card className={cn('animate-pulse', className)}>
      <div className="flex flex-col gap-5 md:flex-row md:justify-between md:gap-8">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-7 w-72 max-w-full rounded-lg bg-chip" />
          <div className="h-4 w-28 rounded bg-chip" />
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-lg bg-chip" />
            <div className="h-6 w-20 rounded-lg bg-chip" />
            <div className="h-6 w-24 rounded-lg bg-chip" />
          </div>
          <div className="h-4 w-56 max-w-full rounded bg-chip" />
          <div className="h-4 w-64 max-w-full rounded bg-chip" />
        </div>
        <div className="space-y-3 md:w-44">
          <div className="h-3 w-20 rounded bg-chip md:ml-auto" />
          <div className="h-8 w-36 rounded-lg bg-chip md:ml-auto" />
          <div className="h-4 w-24 rounded bg-chip md:ml-auto" />
          <div className="h-11 w-full rounded-xl bg-chip" />
        </div>
      </div>
    </Card>
  );
};
