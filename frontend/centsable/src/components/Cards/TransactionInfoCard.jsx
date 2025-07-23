import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
  LuTrash2,
} from "react-icons/lu";

const TransactionInfoCard = ({
  title,
  icon,
  category,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete,
}) => {
  const isExpense = type === "expense";

  const getAmountStyles = () =>
    isExpense ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500";

  const finalIcon = icon || <LuUtensils size={20} />;

  return (
    <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60">
      {/* Icon Circle */}
      <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
        {typeof finalIcon === "string" ? (
          <span className="text-2xl">{finalIcon}</span>
        ) : (
          finalIcon
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500">{date}</p>
            {/* Enhanced category styling */}
            {category && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                {category}
              </span>
            )}
          </div>
        </div>

        {/* Amount & Delete */}
        <div className="flex items-center gap-2">
          {!hideDeleteBtn && (
            <button
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={onDelete}
            >
              <LuTrash2 size={18} />
            </button>
          )}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}
          >
            <h6 className="text-xs font-medium">
              {isExpense ? "-" : "+"} ₹{amount}
            </h6>
            {isExpense ? <LuTrendingDown /> : <LuTrendingUp />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionInfoCard;
