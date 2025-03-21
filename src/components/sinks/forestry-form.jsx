import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Leaf } from "lucide-react";

const ForestryForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    location: "",
    forestArea: "",
    treeSpecies: "mixed",
    treeDensity: 1000,
    forestAge: 0,
    soilType: "loamy",
    maintenanceLevel: "medium",
  });

  const [isCalculating, setIsCalculating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsCalculating(true);

    // Simulate calculation delay
    setTimeout(() => {
      // In a real app, this would be a more complex calculation based on scientific models
      // These are simplified calculations for demonstration
      
      // Base sequestration rate per hectare per year (tons of CO2)
      let baseRate;
      switch (formData.treeSpecies) {
        case "eucalyptus":
          baseRate = 25;
          break;
        case "pine":
          baseRate = 20;
          break;
        case "oak":
          baseRate = 15;
          break;
        case "teak":
          baseRate = 18;
          break;
        case "mixed":
        default:
          baseRate = 22;
      }
      
      // Adjust for tree density (trees per hectare)
      const densityFactor = formData.treeDensity / 1000;
      
      // Adjust for forest age (younger forests sequester more rapidly)
      const ageFactor = Math.max(0.5, 1 - formData.forestAge / 50);
      
      // Soil type factor
      let soilFactor;
      switch (formData.soilType) {
        case "sandy":
          soilFactor = 0.8;
          break;
        case "clayey":
          soilFactor = 0.9;
          break;
        case "loamy":
          soilFactor = 1.1;
          break;
        case "silty":
          soilFactor = 1.0;
          break;
        default:
          soilFactor = 1.0;
      }
      
      // Maintenance level factor
      let maintenanceFactor;
      switch (formData.maintenanceLevel) {
        case "low":
          maintenanceFactor = 0.8;
          break;
        case "medium":
          maintenanceFactor = 1.0;
          break;
        case "high":
          maintenanceFactor = 1.2;
          break;
        default:
          maintenanceFactor = 1.0;
      }
      
      // Calculate annual sequestration
      const annualSequestration = parseFloat(formData.forestArea) * baseRate * densityFactor * ageFactor * soilFactor * maintenanceFactor;
      
      // Calculate 10-year and 30-year projections
      const tenYearSequestration = annualSequestration * 10;
      const thirtyYearSequestration = annualSequestration * 30;
      
      // Calculate carbon density
      const carbonDensity = annualSequestration / parseFloat(formData.forestArea);
      
      const results = {
        projectName: formData.projectName,
        location: formData.location,
        forestArea: parseFloat(formData.forestArea),
        treeSpecies: formData.treeSpecies,
        treeDensity: formData.treeDensity,
        forestAge: formData.forestAge,
        annualSequestration,
        tenYearSequestration,
        thirtyYearSequestration,
        carbonDensity,
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
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            placeholder="Enter project name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="State/Region"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="forestArea">Forest Area (hectares)</Label>
        <Input
          id="forestArea"
          name="forestArea"
          type="number"
          min="0.1"
          step="0.1"
          value={formData.forestArea}
          onChange={handleChange}
          placeholder="0.0"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="treeSpecies">Predominant Tree Species</Label>
        <Select
          value={formData.treeSpecies}
          onValueChange={(value) => handleSelectChange("treeSpecies", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select tree species" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eucalyptus">Eucalyptus</SelectItem>
            <SelectItem value="pine">Pine</SelectItem>
            <SelectItem value="oak">Oak</SelectItem>
            <SelectItem value="teak">Teak</SelectItem>
            <SelectItem value="mixed">Mixed Forest</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="treeDensity">Tree Density (trees/hectare)</Label>
          <span className="text-sm font-medium">{formData.treeDensity}</span>
        </div>
        <Slider
          id="treeDensity"
          min={500}
          max={2000}
          step={50}
          value={[formData.treeDensity]}
          onValueChange={(value) => handleSliderChange("treeDensity", value)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>500</span>
          <span>1250</span>
          <span>2000</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="forestAge">Forest Age (years)</Label>
          <span className="text-sm font-medium">{formData.forestAge}</span>
        </div>
        <Slider
          id="forestAge"
          min={0}
          max={50}
          step={1}
          value={[formData.forestAge]}
          onValueChange={(value) => handleSliderChange("forestAge", value)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0 (New)</span>
          <span>25</span>
          <span>50</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="soilType">Soil Type</Label>
        <Select
          value={formData.soilType}
          onValueChange={(value) => handleSelectChange("soilType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select soil type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sandy">Sandy</SelectItem>
            <SelectItem value="clayey">Clayey</SelectItem>
            <SelectItem value="loamy">Loamy</SelectItem>
            <SelectItem value="silty">Silty</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="maintenanceLevel">Maintenance Level</Label>
        <Select
          value={formData.maintenanceLevel}
          onValueChange={(value) => handleSelectChange("maintenanceLevel", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select maintenance level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" className="w-full" disabled={isCalculating}>
        {isCalculating ? (
          <>
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
            Calculating...
          </>
        ) : (
          <>
            <Leaf className="mr-2 h-4 w-4" />
            Calculate Sequestration
          </>
        )}
      </Button>
    </form>
  );
};

export default ForestryForm;