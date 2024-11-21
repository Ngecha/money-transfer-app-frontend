import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import LandingPage from "./Pages/LandingPage";
import DashboardPage from "./Pages/DashboardPage";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Transactions from "./components/Admin/Transactions";
import Reports from "./components/Admin/Reports";
import Settings from "./components/Admin/Settings";
import Beneficiaries from "./Pages/Beneficiaries";
import TransactionPage from "./Pages/TransactionPage";
import Wallet from "./Pages/Wallet";
import UserDetails from "./AdminPage/UserDetails";

// Router Configuration
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
        element: <DashboardPage />,
      },
      {
        path: "/admin",
        element: <AdminDashboard />,
        children: [
          { path: "transactions", element: <Transactions /> },
          { path: "reports", element: <Reports /> },
          { path: "settings", element: <Settings /> },
        ],
      },
      { 
        path: "/beneficiaries", 
        element: <Beneficiaries /> 
      },
      { 
        path: "/transactions", 
        element: <TransactionPage /> 
      },
      { 
        path: "/wallet", 
        element: <Wallet /> 
      },
      { 
        path: "*", 
        element: <Navigate to="/" replace /> 
      },
      { path: "/userDetails", element: <UserDetails />},
    ],
  },
]);

// Render the application
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
