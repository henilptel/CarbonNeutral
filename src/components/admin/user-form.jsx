import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save, X, UserPlus } from "lucide-react";

const UserForm = ({ user, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "officer",
    status: "active",
    sendInvite: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // If editing an existing user, populate the form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        sendInvite: false,
      });
    } else {
      // Reset form for new user
      setFormData({
        name: "",
        email: "",
        role: "officer",
        status: "active",
        sendInvite: true,
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (user) {
        toast({
          title: "User Updated",
          description: `${formData.name}'s account has been updated successfully.`,
        });
      } else {
        toast({
          title: "User Created",
          description: `${formData.name}'s account has been created successfully.`,
        });
      }
      
      setIsSubmitting(false);
      
      if (onCancel) {
        onCancel();
      }
      
      // Reset form for new user
      if (!user) {
        setFormData({
          name: "",
          email: "",
          role: "officer",
          status: "active",
          sendInvite: true,
        });
      }
    }, 1000);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter full name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@company.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">User Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => handleSelectChange("role", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrator</SelectItem>
            <SelectItem value="analyst">Data Analyst</SelectItem>
            <SelectItem value="officer">Environmental Officer</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {formData.role === "admin" && "Full access to all features and settings"}
          {formData.role === "analyst" && "Can view and analyze data, but cannot modify system settings"}
          {formData.role === "officer" && "Limited access to view reports and submit data"}
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Account Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleSelectChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {!user && (
        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="sendInvite"
            checked={formData.sendInvite}
            onCheckedChange={(checked) => handleSwitchChange("sendInvite", checked)}
          />
          <Label htmlFor="sendInvite">Send invitation email</Label>
        </div>
      )}
      
      <div className="flex justify-end gap-2 pt-4">
        {user && (
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
              {user ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              {user ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update User
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create User
                </>
              )}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;