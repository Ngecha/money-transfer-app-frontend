import React from 'react';
import { NavLink } from 'react-router-dom';

export default function LeftNav() {
  return (
    <nav className="w-48 text-black h-screen bg-gray-90 shadow-lg p-4 space-y-6">
      <ul className="space-y-6">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block py-3 px-4 rounded-lg transition-transform transform duration-300 ease-in-out
               ${isActive ? 'bg-blue-700 text-white' : 'bg-white hover:bg-blue-100'} 
               shadow-md hover:scale-105`
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/beneficiaries"
            className={({ isActive }) =>
              `block py-3 px-4 rounded-lg transition-transform transform duration-300 ease-in-out
               ${isActive ? 'bg-blue-700 text-white' : 'bg-white hover:bg-blue-100'} 
               shadow-md hover:scale-105`
            }
          >
            Beneficiaries
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/wallet"
            className={({ isActive }) =>
              `block py-3 px-4 rounded-lg transition-transform transform duration-300 ease-in-out
               ${isActive ? 'bg-blue-700 text-white' : 'bg-white hover:bg-blue-100'} 
               shadow-md hover:scale-105`
            }
          >
            Wallet
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
