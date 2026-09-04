import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchCategories } from '../services/api'

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  return (
    <footer className="mt-auto">
      {/* Category links — from API */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Browse by Category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="px-4 py-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
              >
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="bg-gray-800 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-0.5 mb-3">
                <span className="text-xl font-extrabold text-primary-400">1</span>
                <span className="text-xl font-extrabold text-white">Fi</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                1Fi Technologies Pvt. Ltd.<br />
                EMI plans backed by mutual funds<br />
                0% interest on purchases
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Home</Link></li>
                {categories.map(cat => (
                  <li key={cat.slug}>
                    <Link to={`/category/${cat.slug}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Support</h4>
              <ul className="space-y-2">
                {['Return Policy', 'Contact Us', 'Terms & Conditions', 'Privacy Policy'].map(link => (
                  <li key={link}><span className="text-sm text-gray-400">{link}</span></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Connect with Us</h4>
              <div className="flex items-center gap-3 mt-2">
                {[{ letter: 'f', label: 'Facebook' }, { letter: 'in', label: 'Instagram' }, { letter: 'X', label: 'Twitter' }, { letter: '▶', label: 'YouTube' }].map(s => (
                  <span key={s.label} className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-gray-400" title={s.label}>
                    <span className="text-xs font-bold">{s.letter}</span>
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">Proudly made in India 🇮🇳</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} 1Fi Technologies Pvt. Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
