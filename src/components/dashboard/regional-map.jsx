import { useEffect, useState } from "react";

// In a real app, this would be an actual map component using libraries like Leaflet or MapBox
const RegionalMap = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-muted/30 rounded-md relative overflow-hidden">
      {/* This is a placeholder for an actual map */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            Map of India showing coal mine emissions
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {regions.map((region, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 text-sm"
              >
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: getColorForValue(region.emissions) }}
                ></div>
                <span>{region.name}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="h-2 w-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get color based on emission value
const getColorForValue = (value) => {
  if (value < 50000) return "#4ade80"; // green
  if (value < 100000) return "#facc15"; // yellow
  return "#ef4444"; // red
};

// Mock data
const regions = [
  { name: "Jharkhand", emissions: 120000 },
  { name: "Chhattisgarh", emissions: 95000 },
  { name: "Odisha", emissions: 85000 },
  { name: "West Bengal", emissions: 45000 },
  { name: "Madhya Pradesh", emissions: 65000 },
  { name: "Telangana", emissions: 35000 },
];

export default RegionalMap;