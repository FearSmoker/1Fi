export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="bg-gray-100 h-64 animate-shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-16 animate-shimmer" />
        <div className="h-5 bg-gray-200 rounded w-3/4 animate-shimmer" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-shimmer" />
        <div className="h-6 bg-gray-200 rounded w-2/3 animate-shimmer mt-4" />
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-shimmer" />
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image skeleton */}
        <div className="bg-gray-100 rounded-2xl h-96 lg:h-[500px] animate-shimmer" />

        {/* Details skeleton */}
        <div className="space-y-6">
          <div className="h-5 bg-gray-200 rounded w-20 animate-shimmer" />
          <div className="h-8 bg-gray-200 rounded w-2/3 animate-shimmer" />
          <div className="h-5 bg-gray-200 rounded w-24 animate-shimmer" />
          <div className="h-10 bg-gray-200 rounded w-1/2 animate-shimmer" />
          <div className="space-y-2 mt-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-shimmer" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-shimmer" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
