import React from 'react';
import { NavLink } from 'react-router-dom';

export default function LeftNav() {
  return (
    <nav className="w-60 h-screen bg-gray-100 shadow-lg p-6 flex flex-col">
      <ul className="space-y-6 w-full">
        {/* Dashboard */}
        <li className="w-full">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block py-4 px-6 text-center rounded-lg transition-all duration-300 
               transform hover:scale-105 
               ${isActive ? 'bg-blue-700 text-white shadow-lg' : 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-blue-100 hover:text-blue-700'}`
            }
          >
            Dashboard
          </NavLink>
        </li>

        {/* Beneficiaries */}
        <li className="w-full">
          <NavLink
            to="/beneficiaries"
            className={({ isActive }) =>
              `block py-4 px-6 text-center rounded-lg transition-all duration-300 
               transform hover:scale-105 
               ${isActive ? 'bg-blue-700 text-white shadow-lg' : 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-blue-100 hover:text-blue-700'}`
            }
          >
            Beneficiaries
          </NavLink>
        </li>

        {/* Wallet */}
        <li className="w-full">
          <NavLink
            to="/wallet"
            className={({ isActive }) =>
              `block py-4 px-6 text-center rounded-lg transition-all duration-300 
               transform hover:scale-105 
               ${isActive ? 'bg-blue-700 text-white shadow-lg' : 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-blue-100 hover:text-blue-700'}`
            }
          >
            Wallet
          </NavLink>
        </li>

        {/* Transactions */}
        <li className="w-full">
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `block py-4 px-6 text-center rounded-lg transition-all duration-300 
               transform hover:scale-105 
               ${isActive ? 'bg-blue-700 text-white shadow-lg' : 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-blue-100 hover:text-blue-700'}`
            }
          >
            Transactions
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}