import { useState, useEffect } from "react";
import { emissionService } from "@/services/emissionService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";

const EmissionForm = ({ onCalculate }) => {
  const { toast } = useToast();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get userId from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);
  const [formData, setFormData] = useState({
    mineName: "",
    mineLocation: "",
    period: "monthly",
    coalProduction: "",
    electricityUsage: "",
    fuelConsumption: "",
    methaneEmissions: "",
  });

  const [isCalculating, setIsCalculating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCalculating(true);

    try {
      // Calculate emissions using updated emission factors
      // Coal: 2.42 tCO₂/ton (based on combustion emissions)
      // Electricity: 0.82 tCO₂/MWh (based on coal-based power generation)
      // Diesel: 2.68 tCO₂/kL (unchanged)
      // Methane: 28 times CO₂ warming potential
      const coalEmissions = parseFloat(formData.coalProduction) * 2.42;
      const electricityEmissions = parseFloat(formData.electricityUsage) * 0.82;
      const fuelEmissions = parseFloat(formData.fuelConsumption) * 2.68;
      const methaneEmissions = parseFloat(formData.methaneEmissions) * 28;
      
      const totalEmissions = coalEmissions + electricityEmissions + fuelEmissions + methaneEmissions;
      
      const results = {
        mineName: formData.mineName,
        mineLocation: formData.mineLocation,
        period: formData.period,
        totalEmissions,
        breakdown: {
          coalProduction: coalEmissions,
          electricityUsage: electricityEmissions,
          fuelConsumption: fuelEmissions,
          methaneEmissions: methaneEmissions,
        },
        date: new Date().toISOString(),
      };

      // Save to backend
      if (userId) {
        await emissionService.create({
          userId,
          mineName: formData.mineName,
          mineLocation: formData.mineLocation,
          period: formData.period,
          coalProduction: parseFloat(formData.coalProduction),
          electricityUsage: parseFloat(formData.electricityUsage),
          fuelConsumption: parseFloat(formData.fuelConsumption),
          methaneEmissions: parseFloat(formData.methaneEmissions),
          totalEmissions
        });
        
        toast({
          title: "Emission record saved",
          description: "Your emission data has been recorded successfully.",
        });
      } else {
        toast({
          title: "Warning",
          description: "Please log in to save emission records.",
          variant: "destructive",
        });
      }
      
      onCalculate(results);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to save emission record",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mineName">Mine Name</Label>
          <Input
            id="mineName"
            name="mineName"
            value={formData.mineName}
            onChange={handleChange}
            placeholder="Enter mine name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mineLocation">Location</Label>
          <Input
            id="mineLocation"
            name="mineLocation"
            value={formData.mineLocation}
            onChange={handleChange}
            placeholder="State/Region"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="period">Reporting Period</Label>
        <Select
          value={formData.period}
          onValueChange={(value) => handleSelectChange("period", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="coalProduction">Coal Production (tons)</Label>
        <Input
          id="coalProduction"
          name="coalProduction"
          type="number"
          min="0"
          step="0.01"
          value={formData.coalProduction}
          onChange={handleChange}
          placeholder="0.00"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="electricityUsage">Electricity Usage (MWh)</Label>
        <Input
          id="electricityUsage"
          name="electricityUsage"
          type="number"
          min="0"
          step="0.01"
          value={formData.electricityUsage}
          onChange={handleChange}
          placeholder="0.00"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="fuelConsumption">Fuel Consumption (kiloliters)</Label>
        <Input
          id="fuelConsumption"
          name="fuelConsumption"
          type="number"
          min="0"
          step="0.01"
          value={formData.fuelConsumption}
          onChange={handleChange}
          placeholder="0.00"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="methaneEmissions">Methane Emissions (tons)</Label>
        <Input
          id="methaneEmissions"
          name="methaneEmissions"
          type="number"
          min="0"
          step="0.01"
          value={formData.methaneEmissions}
          onChange={handleChange}
          placeholder="0.00"
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isCalculating}>
        {isCalculating ? (
          <>
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
            Calculating...
          </>
        ) : (
          <>
            <Calculator className="mr-2 h-4 w-4" />
            Calculate Emissions
          </>
        )}
      </Button>
    </form>
  );
};

export default EmissionForm;
