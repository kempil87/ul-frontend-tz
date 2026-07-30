export type PaginationItem = number | 'ellipsis';

type GetPaginationItemsParams = {
  page: number;
  lastPage: number;
  siblingCount?: number;
};

export const getPaginationItems = ({
  page,
  lastPage,
  siblingCount = 1,
}: GetPaginationItemsParams): PaginationItem[] => {
  if (lastPage <= 1) {
    return [1];
  }

  const current = Math.min(Math.max(page, 1), lastPage);
  const totalNumbers = siblingCount * 2 + 5;

  if (lastPage <= totalNumbers) {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, lastPage);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < lastPage - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + siblingCount * 2;
    const leftRange = Array.from({ length: leftItemCount }, (_, index) => index + 1);
    return [...leftRange, 'ellipsis', lastPage];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + siblingCount * 2;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, index) => lastPage - rightItemCount + 1 + index,
    );
    return [1, 'ellipsis', ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, index) => leftSibling + index,
  );

  return [1, 'ellipsis', ...middleRange, 'ellipsis', lastPage];
};
