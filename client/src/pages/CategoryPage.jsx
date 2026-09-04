import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../services/api'
import ProductCard from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/LoadingSkeleton'

export default function CategoryPage() {
  const { category: categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Step 1: Fetch all categories from API to resolve slug → name
    fetchCategories()
      .then((categories) => {
        const match = categories.find(c => c.slug === categorySlug);
        const resolvedName = match ? match.name : null;
        setCategoryName(resolvedName || formatSlug(categorySlug));

        // Step 2: Fetch products filtered by the resolved category name
        // If no matching category exists in DB, pass the slug anyway (will return empty)
        return fetchProducts(resolvedName || categorySlug);
      })
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categorySlug]);

  return (
    <div className="bg-white min-h-[60vh]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 border-b border-gray-100">
        <nav className="flex items-center gap-1.5 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600 transition-colors">Shop on EMI</Link>
          <span className="text-gray-300">›</span>
          <span className="text-gray-800 font-medium">{categoryName}</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{categoryName} on EMI</h1>
        {!loading && !error && (
          <p className="text-sm text-gray-500 mt-1">
            {products.length} {products.length === 1 ? 'product' : 'products'} available
          </p>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-1">Unable to load products</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}

        {/* Empty state — shows the category name dynamically */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-20 h-20 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No products in {categoryName}</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We don't have any products in the <strong>{categoryName}</strong> category right now.
              Check back soon or explore other categories!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              ← Browse All Products
            </Link>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </div>
    </div>
  )
}

// slug -> display name
function formatSlug(slug) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
