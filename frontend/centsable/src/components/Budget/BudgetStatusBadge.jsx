import { LuCircleAlert, LuTrendingUp, LuTarget } from "react-icons/lu";

const BudgetStatusBadge = ({ currentSpending, amount }) => {
  const spending = Number(currentSpending) || 0;
  const total = Number(amount) || 0;
  const progress = total > 0 ? (spending / total) * 100 : 0;

  const isOverBudget = spending > total;
  const isNearLimit = progress >= 80 && !isOverBudget;

  const getStatus = () => {
    if (isOverBudget) {
      return {
        icon: <LuCircleAlert className="w-4 h-4" />,
        text: "Over Budget",
        color: "text-red-600 bg-red-50",
      };
    } else if (isNearLimit) {
      return {
        icon: <LuTrendingUp className="w-4 h-4" />,
        text: "Near Limit",
        color: "text-yellow-600 bg-yellow-50",
      };
    } else {
      return {
        icon: <LuTarget className="w-4 h-4" />,
        text: "On Track",
        color: "text-green-600 bg-green-50",
      };
    }
  };

  const status = getStatus();

  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${status.color}`}
    >
      {status.icon}
      <span>{status.text}</span>
    </div>
  );
};

export default BudgetStatusBadge;
