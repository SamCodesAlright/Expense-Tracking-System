import moment from "moment";
import React from "react";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expenses</h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.length ? (
          transactions
            ?.slice(0, 5)
            ?.map((expense) => (
              <TransactionInfoCard
                key={expense._id}
                title={expense.title}
                icon={expense.icon}
                category={expense.category}
                date={moment(expense.date).format("DD MM YYYY")}
                amount={expense.amount}
                type="expense"
                hideDeleteBtn
              />
            ))
        ) : (
          <p className="text-sm text-gray-500">No Expenses to show.</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseTransactions;
