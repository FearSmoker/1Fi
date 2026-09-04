export default function VariantSelector({ variants, selectedVariant, onVariantChange }) {
  return (
    <div className="space-y-3">
      {/* Color selector */}
      <div>
        <p className="text-sm text-gray-500 mb-2">
          Available in {variants.length} finishes
        </p>
        <div className="flex items-center gap-3">
          {variants.map((variant) => {
            const isSelected = selectedVariant?.id === variant.id;
            return (
              <button
                key={variant.id}
                onClick={() => onVariantChange(variant)}
                className={`
                  relative w-9 h-9 rounded-full transition-all duration-200
                  ${isSelected
                    ? 'ring-2 ring-primary-600 ring-offset-2 scale-110'
                    : 'ring-1 ring-gray-200 hover:ring-gray-400 hover:scale-105'
                  }
                `}
                style={{ backgroundColor: variant.colorHex }}
                title={`${variant.color} - ${variant.storage}`}
                aria-label={`Select ${variant.color} ${variant.storage}`}
              >
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className={`w-4 h-4 ${
                        isLightColor(variant.colorHex) ? 'text-gray-800' : 'text-white'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Storage pills */}
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          return (
            <button
              key={variant.id}
              onClick={() => onVariantChange(variant)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
                ${isSelected
                  ? 'bg-primary-50 border-primary-600 text-primary-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                }
              `}
            >
              {variant.storage}
            </button>
          );
        })}
      </div>

      {/* Selected variant label */}
      <p className="text-sm text-gray-600">
        <span className="font-medium text-gray-900">{selectedVariant?.color}</span>
        {' · '}
        {selectedVariant?.storage}
      </p>
    </div>
  );
}

// check if a hex color is light (for the checkmark contrast)
function isLightColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
