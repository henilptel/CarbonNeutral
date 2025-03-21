import { useState } from "react";
import { 
  BarChart3, 
  Leaf, 
  Settings, 
  Users, 
  FileText, 
  Home, 
  LogOut, 
  Menu, 
  X,
  Download,
  Printer,
  Mail
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportGenerator from "@/components/reports/report-generator";
import ReportPreview from "@/components/reports/report-preview";
import ReportHistory from "@/components/reports/report-history";

const Reports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, this would clear auth tokens
    navigate("/");
  };

  const handleGenerateReport = (data) => {
    setReportData(data);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 flex w-64 flex-col bg-card border-r border-border transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Leaf className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold">CarbonNeutral</h1>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto" 
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Dashboard
            </h2>
            <div className="space-y-1">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  variant={item.name === "Reports" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                    }
                  }}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
        </nav>
        <div className="border-t border-border p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center border-b border-border px-6">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="ml-4 text-xl font-semibold">Reports</h1>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                A
              </div>
              <span className="hidden md:inline">Admin User</span>
            </div>
          </div>
        </header>

        {/* Reports Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Report Generation</h2>
            <p className="text-muted-foreground">
              Generate customized reports for emissions, carbon sinks, and neutrality pathways
            </p>
          </div>

          <Tabs defaultValue="generator" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="generator">Report Generator</TabsTrigger>
              <TabsTrigger value="history">Report History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generator">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Report Configuration</CardTitle>
                    <CardDescription>
                      Select report type and parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReportGenerator onGenerate={handleGenerateReport} />
                  </CardContent>
                </Card>
                
                <Card className="col-span-1">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Report Preview</CardTitle>
                      <CardDescription>
                        Preview and export your report
                      </CardDescription>
                    </div>
                    {reportData && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          PDF
                        </Button>
                        <Button variant="outline" size="sm">
                          <Printer className="mr-2 h-4 w-4" />
                          Print
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="mr-2 h-4 w-4" />
                          Email
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ReportPreview data={reportData} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Report History</CardTitle>
                  <CardDescription>
                    View and download previously generated reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReportHistory />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

// Data
const navItems = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Emissions", icon: BarChart3, path: "/emissions" },
  { name: "Carbon Sinks", icon: Leaf, path: "/sinks" },
  { name: "Simulation", icon: Settings, path: "/simulation" },
  { name: "Reports", icon: FileText, path: "/reports" },
  { name: "User Management", icon: Users, path: "/admin" },
];

export default Reports;