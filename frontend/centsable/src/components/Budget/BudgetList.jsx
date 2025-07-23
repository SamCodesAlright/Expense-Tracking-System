import BudgetCard from "./BudgetCard";
import { LuDownload } from "react-icons/lu";

const BudgetList = ({ budgets, onDelete, onAddExpense, onDownload }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h5 className="text-lg">Track Your Budget</h5>
        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets?.length ? (
          budgets.map((budget) => (
            <BudgetCard
              key={budget._id}
              budget={budget}
              onDelete={() => onDelete(budget._id)}
              onAddExpense={() => onAddExpense(budget)}
            />
          ))
        ) : (
          <p className="text-gray-400 text-sm col-span-full">
            No budget records found.
          </p>
        )}
      </div>
    </div>
  );
};

export default BudgetList;
