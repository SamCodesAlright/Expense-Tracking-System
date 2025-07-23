import React, { useEffect, useState } from "react";
import { prepareBudgetBarChartData } from "../../utils/helper";
import { LuPlus } from "react-icons/lu";
import CustomDoubleBarChart from "../Charts/CustomDoubleBarChart";

const BudgetOverview = ({ budgets, onAddBudget }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareBudgetBarChartData(budgets);
    setChartData(result);
  }, [budgets]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Budget Overview</h5>
        <p className="text-xs text-gray-400 mt-0.5">
          Track your budget and analyze your spending patterns.
        </p>
      </div>
      <button className="add-btn mt-2" onClick={onAddBudget}>
        <LuPlus className="text-lg" /> Add Budget
      </button>
      <div className="mt-10">
        <CustomDoubleBarChart data={chartData} />
      </div>
    </div>
  );
};

export default BudgetOverview;
