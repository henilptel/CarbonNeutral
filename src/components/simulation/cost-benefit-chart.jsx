import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const CostBenefitChart = ({ results }) => {
  if (!results) return null;

  const { reductions } = results;

  // Prepare data for chart
  const chartData = Object.entries(reductions).map(([key, data]) => {
    const formattedKey = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
      
    return {
      name: formattedKey,
      reduction: data.reduction,
      cost: data.cost,
      costPerTon: data.costPerTon,
    };
  });

  // Sort by cost effectiveness (lowest cost per ton first)
  chartData.sort((a, b) => a.costPerTon - b.costPerTon);

  return (
    <div className="space-y-6">
      <div className="h-64">
        <p className="text-sm font-medium mb-2">Reduction by Strategy</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#22c55e" />
            <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
            <Tooltip 
              formatter={(value, name) => {
                if (name === "Reduction") return [`${value.toLocaleString()} tCO₂e`, name];
                if (name === "Cost") return [`$${value.toLocaleString()}`, name];
                return [value, name];
              }}
              contentStyle={{ 
                backgroundColor: "var(--background)", 
                borderColor: "var(--border)" 
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="reduction" name="Reduction" fill="#22c55e" />
            <Bar yAxisId="right" dataKey="cost" name="Cost" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-64">
        <p className="text-sm font-medium mb-2">Cost Effectiveness ($ per tCO₂e)</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
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
              formatter={(value) => [`$${value}/tCO₂e`, "Cost per Ton"]}
              contentStyle={{ 
                backgroundColor: "var(--background)", 
                borderColor: "var(--border)" 
              }}
            />
            <Legend />
            <Bar dataKey="costPerTon" name="Cost per Ton" fill="#3b82f6" />
            <ReferenceLine 
              y={chartData.reduce((sum, item) => sum + item.costPerTon, 0) / chartData.length} 
              stroke="#ef4444" 
              strokeDasharray="3 3" 
              label={{ 
                value: "Avg", 
                position: "insideBottomRight",
                fill: "#ef4444",
              }} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Cost-Benefit Analysis</p>
        <div className="rounded-md border">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Strategy</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Reduction (tCO₂e)</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Cost ($)</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">$/tCO₂e</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {chartData.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{item.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-right">{item.reduction.toLocaleString()}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-right">${item.cost.toLocaleString()}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-right">${item.costPerTon.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-muted/50">
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">Total</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-right">
                  {chartData.reduce((sum, item) => sum + item.reduction, 0).toLocaleString()}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-right">
                  ${chartData.reduce((sum, item) => sum + item.cost, 0).toLocaleString()}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-right">
                  ${(chartData.reduce((sum, item) => sum + item.cost, 0) / 
                     chartData.reduce((sum, item) => sum + item.reduction, 0)).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CostBenefitChart;