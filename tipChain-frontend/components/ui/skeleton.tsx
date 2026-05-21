export default function Skeleton({
  className = '',
  width,
  height,
}: {
  className?: string;
  width?: string | number;
  height?: string | number;
}) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: width || '100%',
        height: height || '1rem',
      }}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-[#111113] border-2 border-[#27272A] p-5">
      <div className="mb-3">
        <Skeleton width="60%" height="0.75rem" />
      </div>
      <Skeleton width="80%" height="1.75rem" />
    </div>
  );
}

export function CreatorCardSkeleton() {
  return (
    <div className="bg-[#111113] border-2 border-[#27272A] p-5">
      <div className="flex items-start gap-3 mb-4">
        <Skeleton width="3rem" height="3rem" />
        <div className="flex-1">
          <Skeleton width="70%" height="0.875rem" className="mb-2" />
          <Skeleton width="50%" height="0.75rem" />
        </div>
      </div>
      <div className="mb-4 pb-4 border-b-2 border-[#1E1E22]">
        <Skeleton width="40%" height="0.625rem" className="mb-1" />
        <Skeleton width="60%" height="1.5rem" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton width="70%" height="0.625rem" className="mb-1" />
            <Skeleton width="90%" height="0.875rem" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TransactionSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 border-b-2 border-[#1E1E22]">
      <Skeleton width="2rem" height="2rem" />
      <div className="flex-1">
        <Skeleton width="60%" height="0.875rem" className="mb-1" />
        <Skeleton width="40%" height="0.75rem" />
      </div>
      <Skeleton width="4rem" height="1rem" />
    </div>
  );
}
