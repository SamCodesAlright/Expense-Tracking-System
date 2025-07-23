import React, { useEffect, useState } from "react";
import { prepareExpenseLineChartData } from "../../utils/helper";
import CustomLineChart from "../Charts/CustomLineChart";

const BudgetsExpenseOverview = ({ transactions }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (transactions?.length > 0) {
      console.log("transactions", transactions);
      const result = prepareExpenseLineChartData(transactions);
      setChartData(result);
      console.log(result);
    } else {
      setChartData([]);
    }
  }, [transactions]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-semibold">Expense Overview</h5>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Track your spending trends over time and gain insights into where your
        money goes.
      </p>

      <div className="mt-6">
        {chartData.length > 0 ? (
          <CustomLineChart data={chartData} />
        ) : (
          <p className="text-sm text-gray-500">
            No data available to display chart.
          </p>
        )}
      </div>
    </div>
  );
};

export default BudgetsExpenseOverview;
