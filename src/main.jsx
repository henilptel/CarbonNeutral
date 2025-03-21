// start the app always with '/' route
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/layout/theme-provider";
import { setNavigateFunction } from "./lib/navigation";
import "./index.css";

// Import pages
import Index from "./pages/index";
import Dashboard from "./pages/dashboard";
import Emissions from "./pages/emissions";
import Sinks from "./pages/sinks";
import Simulation from "./pages/simulation";
import Reports from "./pages/reports";
import Admin from "./pages/admin";

const queryClient = new QueryClient();

// Component to initialize navigation
function NavigationInitializer() {
  const navigate = useNavigate();
  
  // Set the navigate function for our utility
  setNavigateFunction(navigate);
  
  return null; // This component doesn't render anything
}

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <BrowserRouter>
          <NavigationInitializer />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/emissions" element={<Emissions />} />
            <Route path="/sinks" element={<Sinks />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Sonner />
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);