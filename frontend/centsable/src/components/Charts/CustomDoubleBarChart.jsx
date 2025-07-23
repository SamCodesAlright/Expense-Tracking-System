import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomDoubleBarChart = ({ data }) => {
  if (!data?.length) {
    return <p className="text-gray-500 text-sm">No budget data available</p>;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const used = payload.find((item) => item.dataKey === "used")?.value || 0;
      const remaining =
        payload.find((item) => item.dataKey === "remaining")?.value || 0;
      const total = used + remaining;

      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-sm text-gray-800 font-semibold">
            Total: ₹{total.toLocaleString()}
          </p>
          <p className="text-sm text-red-600">Used: ₹{used.toLocaleString()}</p>
          <p className="text-sm text-lime-600">
            Remaining: ₹{remaining.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white mt-6 p-4 rounded-md shadow">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {/* X Axis: Categories */}
          <XAxis dataKey="category" tick={{ fontSize: 12, fill: "#555" }} />
          {/* Y Axis: Money */}
          <YAxis tick={{ fontSize: 12, fill: "#555" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Stacked Bars */}
          <Bar
            dataKey="used"
            name="Used"
            stackId="a"
            fill="#FF8080"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="remaining"
            name="Remaining"
            stackId="a"
            fill="#B2F699"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomDoubleBarChart;
