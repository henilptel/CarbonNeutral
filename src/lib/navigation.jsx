// A simple navigation utility to avoid using useNavigate directly in components
// that might be rendered outside the Router context

// This is a placeholder function that will be replaced with actual navigation
// when the app is running within a Router context
let navigate = (path) => {
  console.warn("Navigation attempted outside Router context:", path);
  // Fallback to window.location for navigation outside Router context
  window.location.href = path;
};

// Function to set the navigate function when Router is available
export const setNavigateFunction = (navigateFunc) => {
  navigate = navigateFunc;
};

// Function to use for navigation throughout the app
export const navigateTo = (path) => {
  navigate(path);
};