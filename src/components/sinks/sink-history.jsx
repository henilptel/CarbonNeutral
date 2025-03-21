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
import { Trash2, Search } from "lucide-react";
import { sinkService } from "@/services/sinkService";
import { useToast } from "@/hooks/use-toast";

const SinkHistory = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchSinkHistory(storedUserId);
    } else {
      setLoading(false);
      toast({
        title: "Authentication required",
        description: "Please log in to view sink history",
        variant: "destructive",
      });
    }
  }, []);

  const fetchSinkHistory = async (userId) => {
    try {
      const data = await sinkService.getUserSinks(userId);
      setHistoryData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sink history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await sinkService.delete(id);
      if (userId) {
        fetchSinkHistory(userId);
      }
      toast({
        title: "Success",
        description: "Sink project deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete sink project",
        variant: "destructive",
      });
    }
  };
  
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
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Tree Species</TableHead>
              <TableHead className="text-right">Area (ha)</TableHead>
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
