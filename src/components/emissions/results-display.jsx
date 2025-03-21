import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ResultsDisplay = ({ results }) => {
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-center">
        <div className="text-6xl text-muted-foreground mb-4">📊</div>
        <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
        <p className="text-muted-foreground">
          Fill in the form and click "Calculate Emissions" to see your results here.
        </p>
      </div>
    );
  }

  const { totalEmissions, breakdown, emissionsPerEmployee, mineName, mineLocation, period, date } = results;

  // Prepare data for pie chart
  const chartData = [
    { name: "Coal Production", value: breakdown.coalProduction },
    { name: "Electricity Usage", value: breakdown.electricityUsage },
    { name: "Fuel Consumption", value: breakdown.fuelConsumption },
    { name: "Methane Emissions", value: breakdown.methaneEmissions },
  ];

  const COLORS = ["#ef4444", "#3b82f6", "#eab308", "#22c55e"];

  // Format date
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">{mineName}</h3>
          <p className="text-muted-foreground">{mineLocation}</p>
        </div>
        <div className="flex flex-col items-end">
          <Badge variant="outline" className="mb-1">
            {period.charAt(0).toUpperCase() + period.slice(1)} Report
          </Badge>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Emissions</p>
              <p className="text-3xl font-bold">
                {totalEmissions.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                <span className="text-base font-normal text-muted-foreground ml-1">tCO₂e</span>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Per Employee</p>
              <p className="text-3xl font-bold">
                {emissionsPerEmployee.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                <span className="text-base font-normal text-muted-foreground ml-1">tCO₂e</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="h-64">
        <p className="text-sm font-medium mb-2">Emissions Breakdown</p>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [
                `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} tCO₂e`, 
                "Emissions"
              ]}
              contentStyle={{ 
                backgroundColor: "var(--background)", 
                borderColor: "var(--border)" 
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Detailed Breakdown</p>
        <div className="space-y-2">
          {Object.entries(breakdown).map(([key, value]) => {
            const formattedKey = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase());
            
            return (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm">{formattedKey}</span>
                <span className="text-sm font-medium">
                  {value.toLocaleString(undefined, { maximumFractionDigits: 2 })} tCO₂e
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;