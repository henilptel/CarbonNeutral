import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { navigateTo } from "@/lib/navigation";

const LoginForm = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Demo login - in production this would check credentials with backend
      if (email === "demo@example.com" && password === "password") {
        toast({
          title: "Login successful",
          description: "Welcome to CarbonNeutral Mines dashboard",
        });
        // Use our custom navigation utility
        navigateTo("/dashboard");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Try demo@example.com / password",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <div className="relative">
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      <div className="space-y-2 mb-6">
        <h2 className="text-2xl font-bold">Login</h2>
        <p className="text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          Don't have an account?{" "}
          <a href="#" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
        
        <div className="mt-4 p-3 bg-muted rounded-md">
          <p className="font-medium">Demo Credentials</p>
          <p className="text-muted-foreground">Email: demo@example.com</p>
          <p className="text-muted-foreground">Password: password</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;