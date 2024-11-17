// src/pages/LandingPage.js

import React from 'react';

export default function LandingPage() {

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="mt-60 text-center mt-10 p-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to Money Transfer App</h1>
        {/* Rotating Phone Icon */}
        {/* <div className="flex justify-center">
          <i className="fas fa-phone-alt text-blue-500 text-5xl animate-spin-slow"></i>
        </div> */}
        <p className="text-lg text-gray-700 mb-6">
          Experience the best platform for managing your transactions.
        </p>
                
      </div>
    </div>
  );
}