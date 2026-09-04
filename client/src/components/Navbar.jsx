import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchCategories } from '../services/api'

export default function Navbar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-14">
          <Link to="/" className="flex items-center gap-0.5 flex-shrink-0 group">
            <span className="text-2xl font-extrabold text-primary-600 group-hover:text-primary-700 transition-colors">1</span>
            <span className="text-2xl font-extrabold text-gray-900 group-hover:text-gray-700 transition-colors">Fi</span>
          </Link>

          <div className="flex-1 max-w-xl hidden sm:block">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search for products"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <Link to="/orders" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              My Orders
            </Link>
            <Link to="/" className="bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Category nav — fetched from API, not hardcoded */}
      <div className="border-t border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 overflow-x-auto py-2.5 scrollbar-hide">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary-600 whitespace-nowrap transition-colors">
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="text-sm font-medium text-gray-600 hover:text-primary-600 whitespace-nowrap transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
