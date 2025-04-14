import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

import './index.css'
// Remove default App import if no longer needed as main entry
// import App from './App.tsx'
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    // element: <App />, // Or a Layout component, or Dashboard for logged-in users
    element: <div><h1>Home (Protected Route Placeholder)</h1></div>, // Simple placeholder for now
    // Add errorElement: <ErrorPage /> later
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
