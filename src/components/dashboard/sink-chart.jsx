import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
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
  let cumulativeArea = 5000;
  let cumulativeTrees = 10000;
  
  return months.map((month) => {
    const newArea = Math.floor(Math.random() * 500) + 200;
    const newTrees = Math.floor(Math.random() * 1000) + 500;
    
    cumulativeArea += newArea;
    cumulativeTrees += newTrees;
    
    return {
      name: month,
      "Forest Area (ha)": cumulativeArea,
      "Trees Planted": cumulativeTrees,
      "CO₂ Sequestered": Math.floor(cumulativeArea * 3.7 + cumulativeTrees * 0.02),
    };
  });
};

const SinkChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(generateData());
      setLoading(false);
    }, 700);
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
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2}/>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "var(--background)", 
            borderColor: "var(--border)" 
          }} 
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="Forest Area (ha)"
          stackId="1"
          stroke="#4ade80"
          fill="#4ade80"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="Trees Planted"
          stackId="2"
          stroke="#22c55e"
          fill="#22c55e"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="CO₂ Sequestered"
          stackId="3"
          stroke="#16a34a"
          fill="#16a34a"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SinkChart;