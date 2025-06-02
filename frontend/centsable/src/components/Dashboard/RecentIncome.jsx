import React from "react";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";

const RecentIncome = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income</h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.length ? (
          transactions
            .slice(0, 5)
            .map((item) => (
              <TransactionInfoCard
                key={item._id}
                title={item.source}
                icon={item.icon}
                date={moment(item.date).format("DD MM YYYY")}
                amount={item.amount}
                type="income"
                hideDeleteBtn
              />
            ))
        ) : (
          <p className="text-gray-400 text-sm">No recent transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default RecentIncome;
