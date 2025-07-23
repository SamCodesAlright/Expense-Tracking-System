import { LuCalendar } from "react-icons/lu";
import BudgetStatusBadge from "./BudgetStatusBadge";
import { useNavigate } from "react-router-dom";

const BudgetCard = ({ budget, onDelete, onAddExpense }) => {
  const spent = Number(budget.spent ?? 0);
  const amount = Number(budget.amount ?? 0);
  const remaining = amount - spent;
  const expenseCount = Number(budget.expenseCount ?? 0);

  const progressPercentage =
    amount > 0 ? Math.min((spent / amount) * 100, 100) : 0;

  const isOverBudget = spent > amount;
  const isNearLimit = progressPercentage >= 80 && !isOverBudget;

  const navigate = useNavigate();

  const handleViewExpenses = () => {
    navigate(`/budget/${budget._id}/expense`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getProgressColor = () => {
    if (isOverBudget) return "bg-red-500";
    if (isNearLimit) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <span>{budget.icon || "📁"}</span> {budget.category}
          </h3>
        </div>
        <BudgetStatusBadge currentSpending={spent} amount={amount} />
      </div>

      {/* Date Range */}
      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
          {budget.period}
        </span>
        <div className="flex items-center gap-2">
          <LuCalendar className="w-4 h-4" />
          <span>
            {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-semibold text-gray-900">
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Spent</p>
          <p className="text-sm font-semibold text-gray-900">
            ₹{spent.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">
            {remaining < 0 ? "Overspent" : "Remaining"}
          </p>
          <p
            className={`text-sm font-semibold ${
              remaining < 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            ₹{Math.abs(remaining).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Budget</p>
          <p className="text-sm font-semibold text-gray-900">
            ₹{amount.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Items</p>
          <p className="text-sm font-semibold text-gray-900">{expenseCount}</p>
        </div>
      </div>

      {/* Action Buttons */}
      {(onAddExpense || onDelete) && (
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100 group-hover:opacity-100 transition-opacity opacity-100">
          {onAddExpense && (
            <button
              onClick={() => onAddExpense(budget)}
              className="flex-1 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
            >
              Add Expense
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(budget)}
              className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
            >
              Delete
            </button>
          )}
        </div>
      )}

      {/* View Expenses Button */}
      <button
        onClick={handleViewExpenses}
        className="w-full mt-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
      >
        View Expenses
      </button>
    </div>
  );
};

export default BudgetCard;
