import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import LandingPage from "./Pages/LandingPage";
import DashboardPage from "./Pages/DashboardPage";
import Beneficiaries from "./Pages/Beneficiaries";
import TransactionPage from "./Pages/TransactionPage";
import Wallet from "./Pages/Wallet";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/beneficiaries", element: <Beneficiaries /> },
      { path: "/transactions", element: <TransactionPage /> },
      { path: "/wallet",  element: <Wallet />}

    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
