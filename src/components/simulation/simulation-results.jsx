import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const SimulationResults = ({ results }) => {
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-center">
        <div className="text-6xl text-muted-foreground mb-4">📊</div>
        <h3 className="text-lg font-medium mb-2">No Simulation Results</h3>
        <p className="text-muted-foreground">
          Configure your neutrality strategies and run the simulation to see results here.
        </p>
      </div>
    );
  }

  const {
    baselineEmissions,
    targetYear,
    currentYear,
    totalReduction,
    totalCost,
    finalNetEmissions,
    neutralityAchieved,
    neutralityPercentage,
    yearsToNeutrality,
    yearlyData,
  } = results;

  // Prepare data for line chart
  const chartData = yearlyData.years.map((year, index) => ({
    year,
    "Net Emissions": yearlyData.netEmissions[index],
    "Cumulative Reduction": yearlyData.reductions[index],
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Neutrality Projection</h3>
          <p className="text-muted-foreground">Target Year: {targetYear}</p>
        </div>
        <Badge variant={neutralityAchieved ? "default" : "outline"} className="bg-green-600">
          {neutralityAchieved 
            ? `Carbon Neutrality Achieved by ${currentYear + yearsToNeutrality}` 
            : `${neutralityPercentage.toFixed(1)}% Towards Neutrality`}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">Progress to Neutrality</span>
          <span className="text-sm font-medium">{neutralityPercentage.toFixed(1)}%</span>
        </div>
        <Progress value={neutralityPercentage} className="h-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Baseline Emissions</p>
          <p className="text-xl font-bold">
            {baselineEmissions.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">tCO₂e</span>
          </p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Final Net Emissions</p>
          <p className="text-xl font-bold">
            {finalNetEmissions.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">tCO₂e</span>
          </p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Reduction</p>
          <p className="text-xl font-bold">
            {totalReduction.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">tCO₂e</span>
          </p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Cost</p>
          <p className="text-xl font-bold">
            ${totalCost.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">USD</span>
          </p>
        </div>
      </div>

      <div className="h-64">
        <p className="text-sm font-medium mb-2">Emissions Reduction Pathway</p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [
                `${value.toLocaleString()} tCO₂e`, 
                ""
              ]}
              contentStyle={{ 
                backgroundColor: "var(--background)", 
                borderColor: "var(--border)" 
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Net Emissions" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="Cumulative Reduction" 
              stroke="#22c55e" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Key Insights</p>
        <ul className="space-y-2 text-sm">
          {neutralityAchieved ? (
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Carbon neutrality will be achieved by {currentYear + yearsToNeutrality}, which is {yearsToNeutrality} years from now.</span>
            </li>
          ) : (
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              <span>Selected strategies will reduce emissions by {neutralityPercentage.toFixed(1)}%, but won't achieve full neutrality by {targetYear}.</span>
            </li>
          )}
          
          <li className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span>Average cost of reduction: ${(totalCost / totalReduction).toFixed(2)} per tCO₂e.</span>
          </li>
          
          <li className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            <span>Most significant reductions will occur in the first {Math.min(5, targetYear - currentYear)} years of implementation.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SimulationResults;