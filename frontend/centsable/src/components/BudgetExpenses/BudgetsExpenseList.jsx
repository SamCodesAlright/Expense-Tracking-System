import { LuDownload } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";

const BudgetsExpenseList = ({ transactions = [], onDelete, onDownload }) => {
  // Extracting category from the first transaction (assuming all belong to the same budget)
  const category = transactions.length > 0 ? transactions[0].category : null;

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">
          {category ? `${category} Expenses` : "Budget Expenses"}
        </h5>
        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {transactions.length > 0 ? (
          transactions.map((expense) =>
            expense && expense._id ? (
              <TransactionInfoCard
                key={expense._id}
                title={expense.title}
                icon={expense.icon || "🧾"}
                category={expense.category}
                date={moment(expense.date).format("DD MM YYYY")}
                amount={expense.amount}
                type="expense"
                onDelete={() => onDelete(expense._id)}
              />
            ) : null
          )
        ) : (
          <p className="text-gray-400 text-sm">
            No expenses found for this budget category.
          </p>
        )}
      </div>
    </div>
  );
};

export default BudgetsExpenseList;
