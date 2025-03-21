import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SequestrationCalculator = ({ results }) => {
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-center">
        <div className="text-6xl text-muted-foreground mb-4">🌳</div>
        <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
        <p className="text-muted-foreground">
          Fill in the forestry form and click "Calculate Sequestration" to see your results here.
        </p>
      </div>
    );
  }

  const { 
    projectName, 
    location, 
    forestArea, 
    treeSpecies, 
    treeDensity,
    annualSequestration, 
    tenYearSequestration, 
    thirtyYearSequestration,
    carbonDensity,
    date 
  } = results;

  // Format tree species for display
  const formattedTreeSpecies = treeSpecies.charAt(0).toUpperCase() + treeSpecies.slice(1);

  // Format date
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Prepare data for bar chart
  const chartData = [
    { name: "Annual", sequestration: annualSequestration },
    { name: "10 Years", sequestration: tenYearSequestration },
    { name: "30 Years", sequestration: thirtyYearSequestration },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">{projectName}</h3>
          <p className="text-muted-foreground">{location}</p>
        </div>
        <div className="flex flex-col items-end">
          <Badge variant="outline" className="mb-1">
            {formattedTreeSpecies} Forest
          </Badge>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Annual Sequestration</p>
              <p className="text-3xl font-bold">
                {annualSequestration.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                <span className="text-base font-normal text-muted-foreground ml-1">tCO₂e</span>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Carbon Density</p>
              <p className="text-3xl font-bold">
                {carbonDensity.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                <span className="text-base font-normal text-muted-foreground ml-1">tCO₂e/ha</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="h-64">
        <p className="text-sm font-medium mb-2">Sequestration Projections</p>
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
              formatter={(value) => [
                `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} tCO₂e`, 
                "Sequestration"
              ]}
              contentStyle={{ 
                backgroundColor: "var(--background)", 
                borderColor: "var(--border)" 
              }}
            />
            <Legend />
            <Bar dataKey="sequestration" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium">Project Details</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Forest Area</span>
              <span className="text-sm font-medium">{forestArea} hectares</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Tree Species</span>
              <span className="text-sm font-medium">{formattedTreeSpecies}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Tree Density</span>
              <span className="text-sm font-medium">{treeDensity} trees/ha</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Trees</span>
              <span className="text-sm font-medium">{Math.round(forestArea * treeDensity).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequestrationCalculator;