import { formatCurrency } from '../utils/formatCurrency'

export default function EMIPlanList({ emiPlans, selectedPlan, onPlanSelect }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900">Choose EMI Tenure</h3>
        <span className="text-xs text-gray-400">EMIs starting next month</span>
      </div>

      <div className="space-y-3">
        {emiPlans.map((plan) => (
          <EMIPlanRow
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan?.id === plan.id}
            onSelect={() => onPlanSelect(plan)}
          />
        ))}
      </div>

      <p className="mt-3 text-xs text-gray-400">
        *Total extra payment per month/order value
      </p>
    </div>
  )
}

function EMIPlanRow({ plan, isSelected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`
        w-full flex items-center gap-3 py-2.5 px-1 text-left transition-colors rounded-lg
        ${isSelected ? 'bg-primary-50' : 'hover:bg-gray-50'}
      `}
    >
      <div className={`
        w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
        ${isSelected
          ? 'border-primary-600'
          : 'border-gray-300'
        }
      `}>
        {isSelected && (
          <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <span className="text-sm text-gray-900">
          <span className="font-bold">{formatCurrency(plan.monthlyAmount)}</span>
          <span className="text-gray-500"> x {plan.tenure} months</span>
        </span>
      </div>

      <span className={`
        text-xs font-bold px-2.5 py-1 rounded flex-shrink-0
        ${plan.isNoCost
          ? 'bg-primary-600 text-white'
          : 'bg-gray-200 text-gray-600'
        }
      `}>
        {plan.interestRate === 0 ? '0% EMI' : `${plan.interestRate}%`}
      </span>
    </button>
  )
}
