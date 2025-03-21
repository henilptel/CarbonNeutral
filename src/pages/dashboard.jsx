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
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import EmissionsChart from "@/components/dashboard/emissions-chart";
import RegionalMap from "@/components/dashboard/regional-map";
import SinkChart from "@/components/dashboard/sink-chart";
import ComparisonChart from "@/components/dashboard/comparison-chart";
import { navigateTo } from "@/lib/navigation";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleLogout = () => {
    // In a real app, this would clear auth tokens
    navigateTo("/");
  };

  const handleNavigation = (path) => {
    navigateTo(path);
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
                  variant={item.name === "Dashboard" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleNavigation(item.path)}
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
          <h1 className="ml-4 text-xl font-semibold">Dashboard Overview</h1>
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

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((card, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {card.trend}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Emissions Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <EmissionsChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Carbon Sink Growth</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <SinkChart />
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Emissions vs Sequestration</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ComparisonChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <RegionalMap />
              </CardContent>
            </Card>
          </div>
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

const summaryCards = [
  {
    title: "Total Emissions",
    value: "1.2M tons",
    trend: "+2.1% from last month",
    icon: BarChart3,
  },
  {
    title: "Carbon Sequestered",
    value: "450K tons",
    trend: "+5.3% from last month",
    icon: Leaf,
  },
  {
    title: "Net Balance",
    value: "750K tons",
    trend: "-1.2% from last month",
    icon: Settings,
  },
  {
    title: "Mines Monitored",
    value: "214",
    trend: "+3 new this month",
    icon: Users,
  },
];

export default Dashboard;