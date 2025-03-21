import { useState } from "react";
import { Leaf, BarChart3, Users, Settings, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import LoginForm from "@/components/auth/login-form";

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const isMobile = useIsMobile();

  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <header className="w-full bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8" />
            <h1 className="text-2xl font-bold">CarbonNeutral Mines</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="outline" 
              onClick={() => setShowLogin(!showLogin)}
              className="border-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Carbon Neutrality for Indian Coal Mines
            </h2>
            <p className="text-xl text-muted-foreground">
              Track, visualize, and reduce your carbon footprint with AI-driven insights and recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setShowLogin(true)}
              >
                Get Started
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>

          {showLogin ? (
            <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
              <LoginForm onClose={() => setShowLogin(false)} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-card p-6 rounded-lg shadow-md border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics Section */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-card p-6 rounded-lg shadow-md border border-border text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4 text-primary-foreground text-2xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-24 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-6 w-6" />
                <h3 className="text-xl font-bold">CarbonNeutral Mines</h3>
              </div>
              <p className="text-primary-foreground/80">
                Helping coal mines transition towards sustainable operations and carbon neutrality.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Features</h4>
              <ul className="space-y-2">
                <li>Emission Estimation</li>
                <li>Carbon Sink Calculation</li>
                <li>Neutrality Pathways</li>
                <li>Interactive Dashboards</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Case Studies</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>info@carbonneutralmines.com</li>
                <li>+91 123 456 7890</li>
                <li>New Delhi, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>© 2023 CarbonNeutral Mines. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

// Data
const features = [
  {
    title: "Emission Tracking",
    description: "Calculate and monitor carbon emissions from coal mining activities using real-time data.",
    icon: BarChart3
  },
  {
    title: "Carbon Sink Estimation",
    description: "Measure the impact of afforestation and other carbon sequestration initiatives.",
    icon: Leaf
  },
  {
    title: "Neutrality Pathways",
    description: "Simulate different strategies to achieve carbon neutrality with cost-benefit analysis.",
    icon: Settings
  },
  {
    title: "Role-Based Access",
    description: "Secure authentication for different user roles with customized permissions.",
    icon: Users
  }
];

const stats = [
  { value: "200+", label: "Coal Mines" },
  { value: "15M+", label: "Tons of CO₂ Tracked" },
  { value: "50K+", label: "Hectares of Forest" },
  { value: "30%", label: "Average Emission Reduction" }
];

const steps = [
  {
    title: "Input Your Data",
    description: "Enter coal production, electricity usage, fuel consumption, and other relevant data."
  },
  {
    title: "Analyze & Visualize",
    description: "Get instant insights through interactive dashboards and detailed reports."
  },
  {
    title: "Implement Strategies",
    description: "Follow AI-driven recommendations to reduce emissions and achieve carbon neutrality."
  }
];

export default Index;