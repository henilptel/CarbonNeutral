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
  UserPlus,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserList from "@/components/admin/user-list";
import UserForm from "@/components/admin/user-form";
import RolePermissions from "@/components/admin/role-permissions";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, this would clear auth tokens
    navigate("/");
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleClearSelection = () => {
    setSelectedUser(null);
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
                  variant={item.name === "User Management" ? "secondary" : "ghost"}
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
          <h1 className="ml-4 text-xl font-semibold">User Management</h1>
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

        {/* Admin Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">User Administration</h2>
            <p className="text-muted-foreground">
              Manage users, roles, and permissions for the CarbonNeutral Mines platform
            </p>
          </div>

          <Tabs defaultValue="users" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>User List</CardTitle>
                      <CardDescription>
                        Manage existing users
                      </CardDescription>
                    </div>
                    <Button size="sm">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <UserList onSelectUser={handleSelectUser} />
                  </CardContent>
                </Card>
                
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>{selectedUser ? "Edit User" : "Add New User"}</CardTitle>
                    <CardDescription>
                      {selectedUser ? "Modify user details and permissions" : "Create a new user account"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserForm user={selectedUser} onCancel={handleClearSelection} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="roles">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Role-Based Access Control</CardTitle>
                    <CardDescription>
                      Configure permissions for each user role
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <Shield className="mr-2 h-4 w-4" />
                    Add Role
                  </Button>
                </CardHeader>
                <CardContent>
                  <RolePermissions />
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

export default Admin;