import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../utils/formatCurrency'
import { createOrder } from '../services/api'

export default function ProceedModal({ isOpen, onClose, product, variant, plan }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = summary, 2 = customer form
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
  });

  if (!isOpen || !plan || !variant) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleNext = () => setStep(2);
  const handleBack = () => { setStep(1); setError(''); };

  const handlePlaceOrder = async () => {
    // Validate
    if (!form.customerName.trim() || !form.customerEmail.trim() || !form.customerPhone.trim() || !form.shippingAddress.trim()) {
      setError('Please fill all fields');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.customerEmail)) {
      setError('Please enter a valid email');
      return;
    }
    if (!/^\d{10}$/.test(form.customerPhone.replace(/\D/g, '').slice(-10))) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const order = await createOrder({
        variantId: variant.id,
        emiPlanId: plan.id,
        ...form,
      });

      // Reset and navigate to confirmation
      setStep(1);
      setForm({ customerName: '', customerEmail: '', customerPhone: '', shippingAddress: '' });
      onClose();
      navigate(`/orders/${order.orderNumber}`);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary-600 px-6 py-5 text-white">
          <h2 className="text-xl font-bold">{step === 1 ? 'Order Summary' : 'Shipping Details'}</h2>
          <p className="text-primary-100 text-sm mt-1">
            {step === 1 ? 'Review your selected EMI plan' : 'Enter your details to place order'}
          </p>
          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-3">
            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/30'}`} />
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`} />
          </div>
        </div>

        {/* Step 1: Order Summary */}
        {step === 1 && (
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-50 rounded-lg p-2 flex-shrink-0">
                <img src={variant.imageUrl} alt={product?.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{product?.brand} {product?.name}</h3>
                <p className="text-sm text-gray-500">{variant.color} · {variant.storage}</p>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-3">
              {[
                ['Product Price', formatCurrency(variant.price)],
                ['EMI Tenure', `${plan.tenure} months`],
                ['Monthly EMI', formatCurrency(plan.monthlyAmount)],
                ['Interest Rate', plan.interestRate === 0 ? '0% (No Cost)' : `${plan.interestRate}%`],
                ['Total Amount', formatCurrency(plan.totalAmount)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className={`font-semibold ${label === 'Interest Rate' && plan.isNoCost ? 'text-emerald-600' : 'text-gray-900'}`}>{value}</span>
                </div>
              ))}
              {plan.cashback > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Cashback</span>
                  <span className="font-semibold text-emerald-600">-{formatCurrency(plan.cashback)}</span>
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">Effective Total</span>
              <span className="text-xl font-extrabold text-primary-600">
                {formatCurrency(plan.totalAmount - (plan.cashback || 0))}
              </span>
            </div>
          </div>
        )}

        {/* Step 2: Customer Details Form */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            {/* Quick product recap */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <img src={variant.imageUrl} alt="" className="w-10 h-10 object-contain" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{product?.name}</p>
                <p className="text-xs text-gray-500">{formatCurrency(plan.monthlyAmount)}/mo × {plan.tenure} months</p>
              </div>
            </div>

            {/* Form fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text" name="customerName" value={form.customerName} onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel" name="customerPhone" value={form.customerPhone} onChange={handleChange}
                placeholder="10-digit mobile number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address *</label>
              <textarea
                name="shippingAddress" value={form.shippingAddress} onChange={handleChange}
                placeholder="Full address with pin code"
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={step === 1 ? handleClose : handleBack}
            className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            {step === 1 ? 'Cancel' : '← Back'}
          </button>
          <button
            onClick={step === 1 ? handleNext : handlePlaceOrder}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" /></svg>
                Processing...
              </span>
            ) : step === 1 ? 'Proceed to Checkout →' : '🛒 Place Order'}
          </button>
        </div>
      </div>
    </div>
  )
}
