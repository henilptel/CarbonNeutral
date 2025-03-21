import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Download, Search } from "lucide-react";

// Mock data - in a real app, this would come from an API
const generateHistoryData = () => {
  const projects = [
    "Eastern Afforestation Project",
    "Jharkhand Green Belt",
    "Odisha Mangrove Restoration",
    "Western Ghats Reforestation",
    "Himalayan Forest Recovery",
  ];
  
  const locations = [
    "West Bengal",
    "Jharkhand",
    "Odisha",
    "Maharashtra",
    "Uttarakhand",
  ];
  
  const species = ["Mixed", "Eucalyptus", "Pine", "Oak", "Teak"];
  
  const results = [];
  
  for (let i = 0; i < 10; i++) {
    const projectIndex = Math.floor(Math.random() * projects.length);
    const date = new Date();
    date.setDate(date.getDate() - i * 45);
    const area = Math.floor(Math.random() * 500) + 50;
    
    results.push({
      id: i + 1,
      projectName: projects[projectIndex],
      location: locations[projectIndex],
      treeSpecies: species[Math.floor(Math.random() * species.length)],
      forestArea: area,
      annualSequestration: Math.floor(area * (Math.random() * 15 + 10)),
      date: date.toISOString(),
    });
  }
  
  return results;
};

const SinkHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setHistoryData(generateHistoryData());
      setLoading(false);
    }, 1000);
  }, []);
  
  const filteredData = historyData.filter(
    (item) =>
      item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading history...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by project name or location..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Tree Species</TableHead>
              <TableHead>Area (ha)</TableHead>
              <TableHead className="text-right">Annual Seq. (tCO₂e)</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.projectName}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.treeSpecies}</TableCell>
                  <TableCell>{item.forestArea}</TableCell>
                  <TableCell className="text-right">
                    {item.annualSequestration.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(item.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">No results found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SinkHistory;