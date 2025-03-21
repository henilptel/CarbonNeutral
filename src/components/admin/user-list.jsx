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
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Search, UserX } from "lucide-react";

// Mock data - in a real app, this would come from an API
const generateUsersData = () => {
  const roles = ["admin", "analyst", "officer"];
  const names = [
    "John Smith",
    "Maria Garcia",
    "David Johnson",
    "Sarah Lee",
    "Michael Brown",
    "Jennifer Wilson",
    "Robert Taylor",
    "Lisa Anderson",
    "James Thomas",
    "Patricia Martinez",
  ];
  
  return names.map((name, index) => {
    const email = name.toLowerCase().replace(" ", ".") + "@example.com";
    const role = roles[Math.floor(Math.random() * roles.length)];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    
    return {
      id: index + 1,
      name,
      email,
      role,
      status: Math.random() > 0.2 ? "active" : "inactive",
      lastLogin: date.toISOString(),
      avatar: name.charAt(0),
    };
  });
};

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(generateUsersData());
      setLoading(false);
    }, 1000);
  }, []);
  
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "admin": return "default";
      case "analyst": return "secondary";
      case "officer": return "outline";
      default: return "outline";
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredUsers.length > 0 ? (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        user.status === "active" ? "bg-green-500" : "bg-gray-300"
                      }`}></div>
                      <span className="text-sm">
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(user.lastLogin).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onSelectUser(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <UserX className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <UserX className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Users Found</h3>
          <p className="text-muted-foreground">
            No users match your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserList;