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
