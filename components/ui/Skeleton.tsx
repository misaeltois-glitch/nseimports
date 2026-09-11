export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-card bg-marfim/10 ${className}`} aria-hidden />
  );
}
