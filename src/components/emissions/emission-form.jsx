import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";

const EmissionForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    mineName: "",
    mineLocation: "",
    period: "monthly",
    coalProduction: "",
    electricityUsage: "",
    fuelConsumption: "",
    methaneEmissions: "",
    employeeCount: "",
  });

  const [isCalculating, setIsCalculating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsCalculating(true);

    // Simulate calculation delay
    setTimeout(() => {
      // In a real app, this would be a more complex calculation based on emission factors
      const coalEmissions = parseFloat(formData.coalProduction) * 2.42; // tCO2e per ton of coal
      const electricityEmissions = parseFloat(formData.electricityUsage) * 0.82; // tCO2e per MWh
      const fuelEmissions = parseFloat(formData.fuelConsumption) * 2.68; // tCO2e per kiloliter
      const methaneEmissions = parseFloat(formData.methaneEmissions) * 25; // tCO2e (methane has 25x GWP of CO2)
      
      const totalEmissions = coalEmissions + electricityEmissions + fuelEmissions + methaneEmissions;
      const emissionsPerEmployee = totalEmissions / parseFloat(formData.employeeCount || 1);
      
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
        emissionsPerEmployee,
        date: new Date().toISOString(),
      };
      
      onCalculate(results);
      setIsCalculating(false);
    }, 1500);
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
      
      <div className="space-y-2">
        <Label htmlFor="employeeCount">Number of Employees</Label>
        <Input
          id="employeeCount"
          name="employeeCount"
          type="number"
          min="1"
          step="1"
          value={formData.employeeCount}
          onChange={handleChange}
          placeholder="0"
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