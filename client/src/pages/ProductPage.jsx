import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProductBySlug } from '../services/api'
import EMIPlanList from '../components/EMIPlanList'
import ProceedModal from '../components/ProceedModal'
import { ProductDetailSkeleton } from '../components/LoadingSkeleton'
import { formatCurrency } from '../utils/formatCurrency'

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setSelectedPlan(null);
    setActiveImageIndex(0);

    fetchProductBySlug(slug)
      .then((data) => {
        setProduct(data);
        const first = data.variants[0];
        setSelectedVariant(first);
        setSelectedColor(first?.color);
        setSelectedStorage(first?.storage);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  // get unique colors + storages from all variants
  const { uniqueColors, uniqueStorages } = useMemo(() => {
    if (!product) return { uniqueColors: [], uniqueStorages: [] };

    const colorsMap = new Map();
    const storagesSet = new Set();

    for (const v of product.variants) {
      if (!colorsMap.has(v.color)) {
        colorsMap.set(v.color, { color: v.color, colorHex: v.colorHex });
      }
      storagesSet.add(v.storage);
    }

    return {
      uniqueColors: [...colorsMap.values()],
      uniqueStorages: [...storagesSet],
    };
  }, [product]);

  // whenever color or storage changes, find the matching variant
  useEffect(() => {
    if (!product || !selectedColor || !selectedStorage) return;

    const match = product.variants.find(
      v => v.color === selectedColor && v.storage === selectedStorage
    );

    if (match) {
      setSelectedVariant(match);
      setSelectedPlan(null);
    } else {
      // fallback to first variant with this color
      const fallback = product.variants.find(v => v.color === selectedColor);
      if (fallback) {
        setSelectedVariant(fallback);
        setSelectedStorage(fallback.storage);
        setSelectedPlan(null);
      }
    }
  }, [selectedColor, selectedStorage, product]);

  // images for the currently selected color
  const galleryImages = useMemo(() => {
    if (!product || !selectedColor) return [];
    const variant = product.variants.find(v => v.color === selectedColor);
    return variant?.images?.length > 0 ? variant.images : [variant?.imageUrl].filter(Boolean);
  }, [product, selectedColor]);

  // reset to first image when switching colors
  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedColor]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleStorageChange = (storage) => {
    setSelectedStorage(storage);
  };

  if (loading) return <ProductDetailSkeleton />;

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">{error || "The product you're looking for doesn't exist."}</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 border-b border-gray-100">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
            <Link to="/" className="hover:text-primary-600 transition-colors">Shop on EMI</Link>
            <span className="text-gray-300">›</span>
            <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-primary-600 transition-colors">{product.category}</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-400">{product.brand}</span>
            <span className="text-gray-300">›</span>
            <span className="text-gray-800 font-medium">
              {product.name} ({selectedVariant?.color}, {selectedVariant?.storage})
            </span>
          </nav>
        </div>

        {/* Main product section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* image gallery */}
            <div className="lg:col-span-7">
              <div className="flex gap-4">
                {/* thumbnails */}
                <div className="hidden md:flex flex-col gap-2 w-16 flex-shrink-0">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-14 h-14 rounded-lg border-2 p-1 transition-all ${
                        activeImageIndex === idx
                          ? 'border-primary-600 shadow-sm'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>

                {/* Main image */}
                <div className="flex-1 relative">
                  <div className="bg-gray-50 rounded-lg flex items-center justify-center aspect-square max-h-[500px] relative overflow-hidden">
                    <img
                      src={galleryImages[activeImageIndex] || selectedVariant?.imageUrl}
                      alt={`${product.name} - ${selectedVariant?.color}`}
                      className="max-h-[90%] max-w-[90%] object-contain transition-opacity duration-300"
                      key={`${selectedColor}-${activeImageIndex}`}
                    />
                    <span className="absolute bottom-4 left-4 bg-primary-600 text-white text-xs font-bold px-3 py-1.5 rounded">
                      ₹7,500 Cashback
                    </span>
                    <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white px-2 py-1 rounded shadow text-xs font-semibold text-gray-700">
                      4.2 <span className="text-yellow-400">★</span>
                    </div>
                  </div>

                  {/* colors */}
                  <div className="mt-5">
                    <label className="block text-sm font-bold text-gray-800 mb-2">Color</label>
                    <div className="flex items-center gap-3">
                      {uniqueColors.map(({ color, colorHex }) => {
                        const isActive = selectedColor === color;
                        return (
                          <button
                            key={color}
                            onClick={() => handleColorChange(color)}
                            className={`
                              relative w-10 h-10 rounded-full transition-all duration-200
                              ${isActive
                                ? 'ring-2 ring-primary-600 ring-offset-2 scale-110'
                                : 'ring-1 ring-gray-200 hover:ring-gray-400 hover:scale-105'
                              }
                            `}
                            style={{ backgroundColor: colorHex }}
                            title={color}
                            aria-label={`Select ${color}`}
                          >
                            {isActive && (
                              <span className="absolute inset-0 flex items-center justify-center">
                                <svg
                                  className={`w-4 h-4 ${isLightColor(colorHex) ? 'text-gray-800' : 'text-white'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                            )}
                          </button>
                        );
                      })}
                      <span className="text-sm text-gray-500 ml-2">{selectedColor}</span>
                    </div>
                  </div>

                  {/* storage options */}
                  {uniqueStorages.length > 1 && (
                    <div className="mt-4">
                      <label className="block text-sm font-bold text-gray-800 mb-2">Storage</label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueStorages.map((storage) => {
                          const isActive = selectedStorage === storage;
                          return (
                            <button
                              key={storage}
                              onClick={() => handleStorageChange(storage)}
                              className={`
                                px-5 py-2.5 rounded-lg text-sm font-medium border-2 transition-all duration-200
                                ${isActive
                                  ? 'bg-primary-50 border-primary-600 text-primary-700'
                                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                                }
                              `}
                            >
                              {storage}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* product details + emi */}
            <div className="lg:col-span-5">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {product.brand} {product.name} ({selectedVariant?.color}, {selectedVariant?.storage})
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                (Storage: {selectedVariant?.storage}, Color: {selectedVariant?.color})
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-sm">🔥</span>
                <span className="text-sm font-medium text-emerald-600">70+ sold</span>
              </div>

              {/* Price */}
              <div className="mt-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">{formatCurrency(selectedVariant?.price)}</span>
                  {selectedVariant?.mrp > selectedVariant?.price && (
                    <span className="text-base text-gray-400 line-through">{formatCurrency(selectedVariant?.mrp)}</span>
                  )}
                </div>
              </div>

              {/* EMI Section Card */}
              {selectedVariant && (
                <div className="mt-5 border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-primary-600 text-lg">💳</span>
                      <span className="font-bold text-gray-900 text-sm">
                        Pay only {formatCurrency(selectedVariant.emiPlans[0]?.monthlyAmount)} now
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <EMIPlanList
                      emiPlans={selectedVariant.emiPlans}
                      selectedPlan={selectedPlan}
                      onPlanSelect={setSelectedPlan}
                    />
                  </div>
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => setShowModal(true)}
                      disabled={!selectedPlan}
                      className={`w-full py-3.5 rounded-lg font-bold text-base transition-all duration-200
                        ${selectedPlan
                          ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md active:scale-[0.98]'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      {selectedPlan ? `Buy on ${selectedPlan.tenure} months EMI` : 'Select an EMI plan'}
                    </button>
                    {selectedPlan && (
                      <p className="text-center text-xs text-emerald-600 font-medium mt-2">
                        Earn {formatCurrency(selectedPlan.cashback)} cashback on this order
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Shipping */}
              <div className="mt-6">
                <h3 className="text-base font-bold text-gray-900 mb-2">Shipping Details:</h3>
                <p className="text-sm text-gray-600">Dispatch in less than 48 hours and delivery in 3-7 working days after dispatch</p>
              </div>

              {/* Confidence badges */}
              <div className="mt-6">
                <h3 className="text-base font-bold text-gray-900 mb-3">Shop with Confidence</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['🔄', '7 Days Replacement'],
                    ['⭐', 'Top Brand'],
                    ['🚚', 'Free Delivery'],
                    ['🔒', 'Secure Transaction'],
                  ].map(([icon, text]) => (
                    <div key={text} className="flex items-center gap-2">
                      <span className="text-primary-600">{icon}</span>
                      <span className="text-sm text-primary-700 font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="mt-6">
                <h3 className="text-base font-bold text-gray-900 mb-3">Product Details</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Storage: {selectedVariant?.storage}</li>
                  <li>• Color: {selectedVariant?.color}</li>
                  {product.description && <li>• {product.description}</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => setShowModal(true)}
          disabled={!selectedPlan}
          className={`w-full py-3.5 rounded-lg font-bold text-base transition-all
            ${selectedPlan
              ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          {selectedPlan ? `Buy on ${selectedPlan.tenure} months EMI` : 'Select an EMI plan'}
        </button>
      </div>

      <ProceedModal isOpen={showModal} onClose={() => setShowModal(false)} product={product} variant={selectedVariant} plan={selectedPlan} />
      <div className="lg:hidden h-20" />
    </>
  )
}

function isLightColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
}
