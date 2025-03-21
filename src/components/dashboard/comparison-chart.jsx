import { useEffect, useState } from "react";
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

// Mock data - in a real app, this would come from an API
const generateData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((month) => {
    const emissions = Math.floor(Math.random() * 50000) + 80000;
    const sequestration = Math.floor(Math.random() * 30000) + 20000;
    
    return {
      name: month,
      "Emissions": emissions,
      "Sequestration": sequestration,
      "Net": emissions - sequestration,
    };
  });
};

const ComparisonChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(generateData());
      setLoading(false);
    }, 600);
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
      <BarChart
        data={data}
        margin={{
          top: 20,
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
        <Bar dataKey="Emissions" fill="#ef4444" />
        <Bar dataKey="Sequestration" fill="#22c55e" />
        <Bar dataKey="Net" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ComparisonChart;