// start the app always with '/' route
import { Toaster as Sonner } from "@/components/ui/sonner";

import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { TooltipProvider } from "./components/ui/tooltip";

import { ThemeProvider } from "./components/layout/theme-provider";
import "./index.css";
import Index from "./pages";
import Dashboard from "./pages/dashboard";
import Emissions from "./pages/emissions";
import Sinks from "./pages/sinks";
import Simulation from "./pages/simulation";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Index />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/emissions' element={<Emissions />} />
            <Route path='/sinks' element={<Sinks />} />
            <Route path='/simulation' element={<Simulation />} />
          </Routes>
        </BrowserRouter>
        <Sonner />
        <Toaster />
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
