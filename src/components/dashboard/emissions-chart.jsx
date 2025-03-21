import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Mock data - in a real app, this would come from an API
const generateData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((month, index) => {
    const base = 100000 - index * 2000 + Math.random() * 5000;
    return {
      name: month,
      "Coal Production": base,
      "Electricity Usage": base * 0.4 + Math.random() * 3000,
      "Fuel Consumption": base * 0.3 + Math.random() * 2000,
      "Methane Emissions": base * 0.2 + Math.random() * 1000,
    };
  });
};

const EmissionsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(generateData());
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "var(--background)", 
            borderColor: "var(--border)" 
          }} 
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="Coal Production"
          stroke="#ff6b6b"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="Electricity Usage"
          stroke="#48dbfb"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="Fuel Consumption"
          stroke="#feca57"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="Methane Emissions"
          stroke="#1dd1a1"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EmissionsChart;