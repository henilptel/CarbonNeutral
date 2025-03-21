import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText } from "lucide-react";

const ReportGenerator = ({ onGenerate }) => {
  const [formData, setFormData] = useState({
    reportTitle: "",
    reportType: "emissions",
    dateRange: "last30days",
    startDate: "",
    endDate: "",
    mineId: "all",
    includeCharts: true,
    includeRawData: false,
    includeRecommendations: true,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulate report generation delay
    setTimeout(() => {
      // In a real app, this would call an API to generate the report
      
      // Get current date for the report
      const currentDate = new Date();
      
      // Generate mock report data based on the form inputs
      const reportData = {
        ...formData,
        generatedAt: currentDate.toISOString(),
        reportId: `REP-${Math.floor(Math.random() * 10000)}`,
        data: generateMockReportData(formData.reportType),
      };
      
      onGenerate(reportData);
      setIsGenerating(false);
    }, 1500);
  };

  // Generate mock data for the report based on type
  const generateMockReportData = (type) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    
    // Last 6 months
    const labels = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - 5 + i) % 12;
      return months[monthIndex < 0 ? monthIndex + 12 : monthIndex];
    });
    
    switch (type) {
      case "emissions":
        return {
          summary: {
            totalEmissions: 580000,
            averageMonthly: 96667,
            trend: -5.2,
            highestSource: "Coal Production",
          },
          chartData: {
            labels,
            datasets: [
              {
                label: "Coal Production",
                data: labels.map(() => Math.floor(Math.random() * 40000) + 60000),
              },
              {
                label: "Electricity Usage",
                data: labels.map(() => Math.floor(Math.random() * 20000) + 20000),
              },
              {
                label: "Fuel Consumption",
                data: labels.map(() => Math.floor(Math.random() * 15000) + 15000),
              },
            ],
          },
          recommendations: [
            "Implement energy efficiency measures to reduce electricity consumption",
            "Upgrade mining equipment to reduce fuel consumption",
            "Optimize coal extraction processes to minimize emissions",
          ],
        };
        
      case "sinks":
        return {
          summary: {
            totalSequestration: 180000,
            averageMonthly: 30000,
            trend: 12.5,
            mostEffectiveProject: "Eastern Afforestation Project",
          },
          chartData: {
            labels,
            datasets: [
              {
                label: "Afforestation",
                data: labels.map(() => Math.floor(Math.random() * 15000) + 25000),
              },
              {
                label: "Soil Carbon",
                data: labels.map(() => Math.floor(Math.random() * 5000) + 5000),
              },
            ],
          },
          recommendations: [
            "Expand afforestation efforts in the eastern region",
            "Implement soil carbon enhancement techniques",
            "Monitor and maintain existing forest areas",
          ],
        };
        
      case "neutrality":
        return {
          summary: {
            netEmissions: 400000,
            reductionNeeded: 400000,
            projectedYear: 2030,
            mostCostEffective: "Renewable Energy",
          },
          chartData: {
            labels: ["2023", "2024", "2025", "2026", "2027", "2028"],
            datasets: [
              {
                label: "Emissions",
                data: [580000, 550000, 500000, 450000, 420000, 400000],
              },
              {
                label: "Sequestration",
                data: [180000, 200000, 230000, 260000, 300000, 350000],
              },
              {
                label: "Net",
                data: [400000, 350000, 270000, 190000, 120000, 50000],
              },
            ],
          },
          recommendations: [
            "Invest in renewable energy sources for mining operations",
            "Scale up afforestation projects to increase carbon sequestration",
            "Implement methane capture technology to reduce emissions",
          ],
        };
        
      default:
        return {};
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reportTitle">Report Title</Label>
        <Input
          id="reportTitle"
          name="reportTitle"
          value={formData.reportTitle}
          onChange={handleChange}
          placeholder="Enter report title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reportType">Report Type</Label>
        <Select
          value={formData.reportType}
          onValueChange={(value) => handleSelectChange("reportType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="emissions">Emissions Report</SelectItem>
            <SelectItem value="sinks">Carbon Sinks Report</SelectItem>
            <SelectItem value="neutrality">Neutrality Pathway Report</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="dateRange">Date Range</Label>
        <Select
          value={formData.dateRange}
          onValueChange={(value) => handleSelectChange("dateRange", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last30days">Last 30 Days</SelectItem>
            <SelectItem value="last3months">Last 3 Months</SelectItem>
            <SelectItem value="last6months">Last 6 Months</SelectItem>
            <SelectItem value="lastyear">Last Year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {formData.dateRange === "custom" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required={formData.dateRange === "custom"}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              required={formData.dateRange === "custom"}
            />
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="mineId">Coal Mine</Label>
        <Select
          value={formData.mineId}
          onValueChange={(value) => handleSelectChange("mineId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select coal mine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Mines</SelectItem>
            <SelectItem value="1">Jharia Coal Mine</SelectItem>
            <SelectItem value="2">Singrauli Coal Mine</SelectItem>
            <SelectItem value="3">Talcher Coal Mine</SelectItem>
            <SelectItem value="4">Korba Coal Mine</SelectItem>
            <SelectItem value="5">Raniganj Coal Mine</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4 pt-2">
        <Label>Report Options</Label>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="includeCharts" 
            checked={formData.includeCharts}
            onCheckedChange={(checked) => handleCheckboxChange("includeCharts", checked)}
          />
          <Label htmlFor="includeCharts" className="text-sm font-normal">
            Include charts and visualizations
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="includeRawData" 
            checked={formData.includeRawData}
            onCheckedChange={(checked) => handleCheckboxChange("includeRawData", checked)}
          />
          <Label htmlFor="includeRawData" className="text-sm font-normal">
            Include raw data tables
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="includeRecommendations" 
            checked={formData.includeRecommendations}
            onCheckedChange={(checked) => handleCheckboxChange("includeRecommendations", checked)}
          />
          <Label htmlFor="includeRecommendations" className="text-sm font-normal">
            Include AI-driven recommendations
          </Label>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isGenerating}>
        {isGenerating ? (
          <>
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
            Generating Report...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </>
        )}
      </Button>
    </form>
  );
};

export default ReportGenerator;