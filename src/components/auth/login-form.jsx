import { useState } from "react";
import { userService } from "@/services/userService";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { navigateTo } from "@/lib/navigation";

const LoginForm = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegistering) {
        // Register new user
        const result = await userService.register(username, password);
        toast({
          title: "Registration successful",
          description: "Your account has been created. You can now log in.",
        });
        // Switch back to login mode
        setIsRegistering(false);
      } else {
        // Log in user
        const result = await userService.login(username, password);
        toast({
          title: "Login successful",
          description: "Welcome to CarbonNeutral Mines dashboard",
        });
        // Store user info in localStorage
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('username', result.username);
        // Navigate to dashboard
        navigateTo("/dashboard");
      }
    } catch (error) {
      toast({
        title: isRegistering ? "Registration failed" : "Login failed",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          {isLoading ? "Processing..." : isRegistering ? "Register" : "Login"}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
          <button 
            type="button"
            className="text-primary hover:underline"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Login" : "Sign up"}
          </button>
        </p>
        
      </div>
    </div>
  );
};

export default LoginForm;
