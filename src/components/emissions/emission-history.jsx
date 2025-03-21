import { useState, useEffect } from "react";
import { emissionService } from "@/services/emissionService";
import { useToast } from "@/hooks/use-toast";
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
import { Trash2, Download, Search } from "lucide-react";

const EmissionHistory = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ field: 'date', order: 'DESC' });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchEmissions(storedUserId);
    } else {
      setLoading(false);
      toast({
        title: "Authentication required",
        description: "Please log in to view emission history",
        variant: "destructive",
      });
    }
  }, []);

  const fetchEmissions = async (userId) => {
    try {
      const queryParams = new URLSearchParams({
        sortBy: sortConfig.field,
        sortOrder: sortConfig.order
      });
      
      if (startDate && endDate) {
        queryParams.append('startDate', startDate);
        queryParams.append('endDate', endDate);
      }
      
      const emissions = await emissionService.getUserEmissions(userId, queryParams);
      setHistoryData(emissions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch emission history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await emissionService.delete(id);
      // Refresh the list
      if (userId) {
        fetchEmissions(userId);
      }
      toast({
        title: "Success",
        description: "Emission record deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete emission record",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    try {
      // Convert data to CSV format
      const headers = ["Mine Name", "Location", "Period", "Coal Production", "Total Emissions (tCO₂e)"];
      const csvData = [
        headers.join(","),
        ...historyData.map(item => [
          item.mineName,
          item.mineLocation,
          item.period,
          item.coalProduction,
          item.totalEmissions
        ].join(","))
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "emission-history.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Export completed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };
  
  const filteredData = historyData.filter(
    (item) =>
      item.mineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mineLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.totalEmissions?.toString().includes(searchTerm)
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
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by mine name or location..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {/* <input
            type="date"
            className="px-3 py-1 border rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="px-3 py-1 border rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          /> */}
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  setSortConfig(prev => ({
                    field: 'mine_name',
                    order: prev.field === 'mine_name' && prev.order === 'ASC' ? 'DESC' : 'ASC'
                  }));
                  if (userId) fetchEmissions(userId);
                }}
              >
                Mine Name {sortConfig.field === 'mine_name' && (sortConfig.order === 'ASC' ? '↑' : '↓')}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  setSortConfig(prev => ({
                    field: 'mine_location',
                    order: prev.field === 'mine_location' && prev.order === 'ASC' ? 'DESC' : 'ASC'
                  }));
                  if (userId) fetchEmissions(userId);
                }}
              >
                Location {sortConfig.field === 'mine_location' && (sortConfig.order === 'ASC' ? '↑' : '↓')}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  setSortConfig(prev => ({
                    field: 'period',
                    order: prev.field === 'period' && prev.order === 'ASC' ? 'DESC' : 'ASC'
                  }));
                  if (userId) fetchEmissions(userId);
                }}
              >
                Period {sortConfig.field === 'period' && (sortConfig.order === 'ASC' ? '↑' : '↓')}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 text-right"
                onClick={() => {
                  setSortConfig(prev => ({
                    field: 'coal_production',
                    order: prev.field === 'coal_production' && prev.order === 'ASC' ? 'DESC' : 'ASC'
                  }));
                  if (userId) fetchEmissions(userId);
                }}
              >
                Coal Production(tons) {sortConfig.field === 'coal_production' && (sortConfig.order === 'ASC' ? '↑' : '↓')}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 text-right"
                onClick={() => {
                  setSortConfig(prev => ({
                    field: 'total_emissions',
                    order: prev.field === 'total_emissions' && prev.order === 'ASC' ? 'DESC' : 'ASC'
                  }));
                  if (userId) fetchEmissions(userId);
                }}
              >
                Total Emissions (tCO₂e) {sortConfig.field === 'total_emissions' && (sortConfig.order === 'ASC' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.mineName}</TableCell>
                  <TableCell>{item.mineLocation}</TableCell>
                  <TableCell>{item.period}</TableCell>
                  <TableCell className="text-right">
                    {item.coalProduction?.toLocaleString() ?? 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.totalEmissions?.toLocaleString() ?? 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <span className="sr-only">Delete</span>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
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

export default EmissionHistory;
