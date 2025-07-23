import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const CustomLineChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { title, category, amount } = payload[0].payload;

      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-xs font-semibold text-lime-700 mb-1">{category}</p>
          <p className="text-sm text-gray-700 mb-1">
            Title: <span className="font-medium text-gray-900">{title}</span>
          </p>
          <p className="text-sm text-gray-600">
            Amount:{" "}
            <span className="text-sm font-medium text-gray-900">₹{amount}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7CCF00" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#7CCF00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="none" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="none"
          />
          <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
          <Tooltip content={CustomTooltip} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#7CCF00"
            fill="url(#expenseGradient)"
            strokeWidth={3}
            dot={{ r: 3, fill: "#A2FA8D" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
