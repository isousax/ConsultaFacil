export const Skeleton = ({
  className = '',
  width,
  height,
}: {
  className?: string;
  width?: string;
  height?: string;
}) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      style={{ width, height }}
    />
  );
};

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton width="100px" height="20px" />
          <Skeleton width="120px" height="24px" />
          <Skeleton width="150px" height="20px" />
          <Skeleton width="80px" height="32px" />
        </div>
      ))}
    </div>
  );
};

export const CardListSkeleton = ({ rows = 3 }: { rows?: number }) => {
  return (
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton width="120px" height="16px" />
              <Skeleton width="180px" height="14px" />
            </div>
            <Skeleton width="80px" height="24px" className="rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton width="100%" height="12px" />
            <Skeleton width="100%" height="12px" />
          </div>
          <Skeleton width="100%" height="36px" className="rounded-lg" />
        </div>
      ))}
    </div>
  );
};
