type PaginationInfoProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  itemName?: string;
  className?: string;
};

export function PaginationInfo({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  itemName = 'items',
  className = ''
}: PaginationInfoProps) {
  if (totalItems === 0) {
    return (
      <p className={`text-sm text-muted-foreground ${className}`}>
        No {itemName} found
      </p>
    );
  }

  if (totalPages <= 1) {
    return (
      <p className={`text-sm text-muted-foreground ${className}`}>
        Showing {totalItems}{' '}
        {totalItems === 1 ? itemName.slice(0, -1) : itemName}
      </p>
    );
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      Showing {startItem}-{endItem} of {totalItems} {itemName} (Page{' '}
      {currentPage} of {totalPages})
    </p>
  );
}
