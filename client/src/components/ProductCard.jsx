import { Link } from 'react-router-dom'
import { formatCurrency, getDiscount } from '../utils/formatCurrency'

export default function ProductCard({ product }) {
  const variant = product.defaultVariant;
  if (!variant) return null;

  const discount = getDiscount(variant.price, variant.mrp);

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      <div className="relative bg-gray-50 p-6 flex items-center justify-center h-64 overflow-hidden">
        <img
          src={variant.imageUrl}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {discount && (
          <span className="absolute top-3 left-3 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          {product.brand}
        </p>

        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 mb-3">
          {variant.storage} • {variant.color}
        </p>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(variant.price)}
            </span>
            {variant.mrp > variant.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(variant.mrp)}
              </span>
            )}
          </div>

          {variant.startingEMI && (
            <p className="text-sm font-medium text-emerald-600">
              Starting at {formatCurrency(variant.startingEMI.monthlyAmount)}/mo
            </p>
          )}

          {product.variantCount > 1 && (
            <p className="text-xs text-gray-400 mt-2">
              Available in {product.variantCount} variants
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
