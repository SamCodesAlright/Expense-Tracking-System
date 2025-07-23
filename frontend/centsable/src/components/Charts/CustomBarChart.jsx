import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomBarChart = ({ data }) => {
  // Function to alternate the colors
  const getBarColor = (index) => {
    return index % 2 === 0 ? "#7CCF00" : "#CFFF88";
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-200">
          <p className="text-xs font-medium text-lime-700 mb-1">
            {payload[0].payload.category}
          </p>
          {payload[0]?.payload?.title && (
            <p className="text-sm text-gray-700 mb-1">
              Title:{" "}
              <span className="font-medium text-gray-900">
                {payload[0].payload.title}
              </span>
            </p>
          )}
          <p className="text-sm text-gray-600">
            Amount:{" "}
            <span className="text-sm font-semibold text-emerald-700">
              ₹{payload[0].payload.amount}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="none"
          />
          <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="amount"
            radius={[10, 10, 0, 0]}
            activeDot={{ r: 8, fill: "yellow" }}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
