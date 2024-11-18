
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import Cookies from "js-cookie";
import { store } from './app/store';
import App from "./App";
import LandingPage from "./Pages/LandingPage";
import DashboardPage from "./Pages/Dashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Transactions from "./components/Admin/Transactions";
import Reports from "./components/Admin/Reports";
import Settings from "./components/Admin/Settings";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = Cookies.get("username");
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        )
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: "/admin/transactions",
        element: (
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        )
      },
      {
        path: "/admin/reports",
        element: (
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        )
      },
      {
        path: "/admin/settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        )
      },
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);