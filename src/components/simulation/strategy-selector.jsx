import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Play } from "lucide-react";

const StrategySelector = ({ onSimulate }) => {
  const [baselineEmissions, setBaselineEmissions] = useState(100000);
  const [targetYear, setTargetYear] = useState(2030);
  const [selectedStrategies, setSelectedStrategies] = useState({
    renewableEnergy: {
      selected: true,
      implementation: 50, // percentage
      costPerTon: 40,
      maxReduction: 40, // percentage of total emissions
    },
    energyEfficiency: {
      selected: true,
      implementation: 60,
      costPerTon: 25,
      maxReduction: 20,
    },
    methaneCapture: {
      selected: false,
      implementation: 30,
      costPerTon: 35,
      maxReduction: 15,
    },
    afforestation: {
      selected: true,
      implementation: 70,
      costPerTon: 15,
      maxReduction: 25,
    },
    carbonCapture: {
      selected: false,
      implementation: 20,
      costPerTon: 80,
      maxReduction: 30,
    },
  });

  const [isSimulating, setIsSimulating] = useState(false);

  const handleStrategyToggle = (strategy) => {
    setSelectedStrategies((prev) => ({
      ...prev,
      [strategy]: {
        ...prev[strategy],
        selected: !prev[strategy].selected,
      },
    }));
  };

  const handleImplementationChange = (strategy, value) => {
    setSelectedStrategies((prev) => ({
      ...prev,
      [strategy]: {
        ...prev[strategy],
        implementation: value[0],
      },
    }));
  };

  const handleBaselineChange = (e) => {
    setBaselineEmissions(parseFloat(e.target.value) || 0);
  };

  const handleTargetYearChange = (e) => {
    setTargetYear(parseInt(e.target.value) || 2030);
  };

  const handleSimulate = () => {
    setIsSimulating(true);

    // Simulate calculation delay
    setTimeout(() => {
      // Calculate total potential reduction
      const currentYear = new Date().getFullYear();
      const yearsToTarget = targetYear - currentYear;
      
      // Calculate reduction from each selected strategy
      const reductions = {};
      let totalReduction = 0;
      let totalCost = 0;
      const yearlyReductions = [];
      const yearlyCosts = [];
      const yearlyNetEmissions = [];
      
      // Initialize yearly data arrays
      for (let i = 0; i <= yearsToTarget; i++) {
        yearlyReductions.push(0);
        yearlyCosts.push(0);
        yearlyNetEmissions.push(baselineEmissions);
      }
      
      Object.entries(selectedStrategies).forEach(([key, strategy]) => {
        if (strategy.selected) {
          // Calculate max potential reduction for this strategy
          const maxReduction = baselineEmissions * (strategy.maxReduction / 100);
          
          // Calculate actual reduction based on implementation percentage
          const actualReduction = maxReduction * (strategy.implementation / 100);
          
          // Calculate cost
          const cost = actualReduction * strategy.costPerTon;
          
          reductions[key] = {
            reduction: actualReduction,
            cost: cost,
            costPerTon: strategy.costPerTon,
          };
          
          totalReduction += actualReduction;
          totalCost += cost;
          
          // Calculate yearly progression (simplified linear model)
          for (let i = 1; i <= yearsToTarget; i++) {
            // Strategies take effect gradually
            const yearFactor = Math.min(1, i / Math.min(5, yearsToTarget));
            const yearReduction = actualReduction * yearFactor;
            yearlyReductions[i] += yearReduction;
            yearlyCosts[i] += (cost / yearsToTarget) * yearFactor;
            yearlyNetEmissions[i] -= yearReduction;
          }
        }
      });
      
      // Calculate final net emissions for each year
      for (let i = 0; i <= yearsToTarget; i++) {
        yearlyNetEmissions[i] = baselineEmissions - yearlyReductions[i];
      }
      
      // Calculate neutrality achievement
      const finalNetEmissions = baselineEmissions - totalReduction;
      const neutralityAchieved = finalNetEmissions <= 0;
      const neutralityPercentage = Math.min(100, (totalReduction / baselineEmissions) * 100);
      
      // Calculate years to neutrality
      let yearsToNeutrality = null;
      for (let i = 0; i <= yearsToTarget; i++) {
        if (yearlyNetEmissions[i] <= 0) {
          yearsToNeutrality = i;
          break;
        }
      }
      
      const results = {
        baselineEmissions,
        targetYear,
        currentYear,
        yearsToTarget,
        totalReduction,
        totalCost,
        finalNetEmissions,
        neutralityAchieved,
        neutralityPercentage,
        yearsToNeutrality,
        reductions,
        yearlyData: {
          years: Array.from({ length: yearsToTarget + 1 }, (_, i) => currentYear + i),
          reductions: yearlyReductions,
          costs: yearlyCosts,
          netEmissions: yearlyNetEmissions,
        },
      };
      
      onSimulate(results);
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="baselineEmissions">Baseline Emissions (tCO₂e/year)</Label>
          <Input
            id="baselineEmissions"
            type="number"
            min="1000"
            step="1000"
            value={baselineEmissions}
            onChange={handleBaselineChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="targetYear">Target Year for Neutrality</Label>
          <Input
            id="targetYear"
            type="number"
            min={new Date().getFullYear() + 1}
            max={new Date().getFullYear() + 30}
            value={targetYear}
            onChange={handleTargetYearChange}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Select Neutrality Strategies</h3>
        
        {Object.entries(selectedStrategies).map(([key, strategy]) => {
          const formattedKey = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
            
          return (
            <div key={key} className="space-y-4 border-b border-border pb-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={key} 
                  checked={strategy.selected}
                  onCheckedChange={() => handleStrategyToggle(key)}
                />
                <div className="grid gap-1.5">
                  <Label htmlFor={key} className="font-medium">
                    {formattedKey}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Cost: ${strategy.costPerTon}/tCO₂e | Max Reduction: {strategy.maxReduction}%
                  </p>
                </div>
              </div>
              
              {strategy.selected && (
                <div className="pl-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Implementation Level</Label>
                    <span className="text-sm font-medium">{strategy.implementation}%</span>
                  </div>
                  <Slider
                    min={10}
                    max={100}
                    step={5}
                    value={[strategy.implementation]}
                    onValueChange={(value) => handleImplementationChange(key, value)}
                    disabled={!strategy.selected}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>10%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <Button 
        onClick={handleSimulate} 
        className="w-full" 
        disabled={isSimulating || !Object.values(selectedStrategies).some(s => s.selected)}
      >
        {isSimulating ? (
          <>
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
            Simulating...
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Run Simulation
          </>
        )}
      </Button>
    </div>
  );
};

export default StrategySelector;