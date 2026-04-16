export function ProductCardSkeleton() {
  return (
    <div className="luxury-panel rounded-[2rem] p-6 animate-pulse">
      <div className="aspect-square w-full rounded-2xl bg-brand-muted/50 mb-6" />
      <div className="h-4 bg-brand-muted/50 rounded w-3/4 mb-3" />
      <div className="h-3 bg-brand-muted/50 rounded w-1/2 mb-4" />
      <div className="h-6 bg-brand-muted/50 rounded w-2/3" />
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
