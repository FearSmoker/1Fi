import { formatCurrency, getDiscount } from '../utils/formatCurrency'

export default function PriceDisplay({ price, mrp }) {
  const discount = getDiscount(price, mrp);

  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-extrabold text-gray-900">
          {formatCurrency(price)}
        </span>
        {mrp > price && (
          <span className="text-lg text-gray-400 line-through">
            {formatCurrency(mrp)}
          </span>
        )}
        {discount && (
          <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            {discount}% off
          </span>
        )}
      </div>
      <p className="text-xs text-gray-400">Inclusive of all taxes</p>
    </div>
  )
}
