import { create } from "zustand";

// Mock user data - in a real app, this would come from an API
const mockUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "demo@example.com",
    role: "admin",
    avatar: "A",
  },
  {
    id: 2,
    name: "Analyst User",
    email: "analyst@example.com",
    role: "analyst",
    avatar: "B",
  },
  {
    id: 3,
    name: "Environmental Officer",
    email: "officer@example.com",
    role: "officer",
    avatar: "C",
  },
];

// Mock mines data
const mockMines = [
  {
    id: 1,
    name: "Jharia Coal Mine",
    location: "Jharkhand",
    area: 450,
    production_capacity: 25000,
    owner: "Coal India Limited",
    coordinates: { lat: 23.7957, lng: 86.4304 },
  },
  {
    id: 2,
    name: "Singrauli Coal Mine",
    location: "Madhya Pradesh",
    area: 380,
    production_capacity: 20000,
    owner: "Northern Coalfields Limited",
    coordinates: { lat: 24.1997, lng: 82.6747 },
  },
  {
    id: 3,
    name: "Talcher Coal Mine",
    location: "Odisha",
    area: 500,
    production_capacity: 30000,
    owner: "Mahanadi Coalfields Limited",
    coordinates: { lat: 20.9490, lng: 85.2175 },
  },
];

// Create store
export const useStore = create((set) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  
  // Data
  mines: mockMines,
  selectedMine: null,
  
  // UI state
  sidebarOpen: false,
  darkMode: false,
  
  // Auth actions
  login: (email, password) => {
    const user = mockUsers.find(u => u.email === email && password === "password");
    if (user) {
      set({ user, isAuthenticated: true });
      return true;
    }
    return false;
  },
  
  logout: () => set({ user: null, isAuthenticated: false }),
  
  // Data actions
  selectMine: (mineId) => {
    set(state => ({
      selectedMine: state.mines.find(m => m.id === mineId) || null
    }));
  },
  
  // UI actions
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),
  setDarkMode: (dark) => set({ darkMode: dark }),
}));