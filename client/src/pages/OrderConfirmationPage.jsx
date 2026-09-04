import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchOrderByNumber } from '../services/api'
import { formatCurrency } from '../utils/formatCurrency'

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderByNumber(orderNumber)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  // Generate EMI schedule
  const emiSchedule = useMemo(() => {
    if (!order) return [];
    const schedule = [];
    const startDate = new Date(order.createdAt);
    for (let i = 0; i < order.emiTenure; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i + 1);
      schedule.push({
        month: i + 1,
        dueDate: dueDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric', day: 'numeric' }),
        amount: order.emiMonthlyAmount,
        status: i === 0 ? 'upcoming' : 'scheduled',
      });
    }
    return schedule;
  }, [order]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 mt-4">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-6">{error || 'This order does not exist.'}</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Success banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-emerald-800">Order Confirmed! 🎉</h1>
          <p className="text-emerald-600 mt-1">Your EMI plan has been successfully set up</p>
          <p className="text-sm text-emerald-500 mt-2">
            Order Number: <span className="font-bold text-emerald-700">{order.orderNumber}</span>
          </p>
        </div>

        {/* Order details card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
          </div>

          <div className="p-6">
            {/* Product info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gray-50 rounded-xl p-2 flex-shrink-0 border border-gray-100">
                <img src={order.variantImageUrl} alt={order.productName} className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{order.productName}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{order.variantColor} · {order.variantStorage}</p>
                <span className={`inline-block mt-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  order.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Price & EMI breakdown */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              {[
                ['Product Price', formatCurrency(order.productPrice)],
                ['EMI Plan', `${formatCurrency(order.emiMonthlyAmount)} × ${order.emiTenure} months`],
                ['Interest Rate', order.emiIsNoCost ? '0% (No Cost EMI)' : `${order.emiInterestRate}%`],
                ['Total Payable', formatCurrency(order.emiTotalAmount)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className={`font-semibold ${label === 'Interest Rate' && order.emiIsNoCost ? 'text-emerald-600' : 'text-gray-900'}`}>{value}</span>
                </div>
              ))}
              {order.emiCashback > 0 && (
                <>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600 font-medium">Cashback Reward</span>
                    <span className="font-bold text-emerald-600">-{formatCurrency(order.emiCashback)}</span>
                  </div>
                  <div className="flex justify-between text-base pt-1">
                    <span className="font-bold text-gray-900">Effective Total</span>
                    <span className="font-extrabold text-primary-600">{formatCurrency(order.emiTotalAmount - order.emiCashback)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* EMI Schedule */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">EMI Payment Schedule</h2>
            <p className="text-sm text-gray-500 mt-0.5">{order.emiTenure} monthly installments of {formatCurrency(order.emiMonthlyAmount)}</p>
          </div>

          <div className="divide-y divide-gray-50">
            {emiSchedule.map((emi) => (
              <div key={emi.month} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    emi.status === 'upcoming'
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {emi.month}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">EMI {emi.month} of {order.emiTenure}</p>
                    <p className="text-xs text-gray-400">Due: {emi.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(emi.amount)}</p>
                  <p className={`text-xs font-medium ${
                    emi.status === 'upcoming' ? 'text-primary-600' : 'text-gray-400'
                  }`}>
                    {emi.status === 'upcoming' ? 'Next payment' : 'Scheduled'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Shipping Information</h2>
          </div>
          <div className="p-6 space-y-3 text-sm">
            <div className="flex gap-2">
              <span className="text-gray-500 w-24 flex-shrink-0">Name:</span>
              <span className="font-medium text-gray-900">{order.customerName}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 w-24 flex-shrink-0">Email:</span>
              <span className="font-medium text-gray-900">{order.customerEmail}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 w-24 flex-shrink-0">Phone:</span>
              <span className="font-medium text-gray-900">{order.customerPhone}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 w-24 flex-shrink-0">Address:</span>
              <span className="font-medium text-gray-900">{order.shippingAddress}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 w-24 flex-shrink-0">Delivery:</span>
              <span className="font-medium text-gray-900">3-7 working days after dispatch</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Link
            to="/"
            className="flex-1 py-3 px-6 bg-primary-600 text-white text-center rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="flex-1 py-3 px-6 border-2 border-gray-200 text-gray-700 text-center rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  )
}
