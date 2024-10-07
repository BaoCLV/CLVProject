// app/dashboard/loading.tsx
'use client'

import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="text-gray-800 text-lg font-semibold mb-4">
        Loading...
      </div>

      {/* Truck Animation */}
      <div className="relative w-20 h-20 text-blue">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          className="w-full h-full animate-bounce text-blue"
        >
          <path
            fill="currentColor"
            d="M624 368h-16V256a64.07 64.07 0 00-64-64h-48v-64a32.09 32.09 0 00-32-32H416V32a32.09 32.09 0 00-32-32H32A32.09 32.09 0 000 32v352a64.07 64.07 0 0064 64 64 64 0 00128 0h192a64 64 0 00128 0h112a64.07 64.07 0 0064-64 16 16 0 00-16-16zM64 416a32 32 0 1132-32 32.09 32.09 0 01-32 32zm320-64H192v-96h192zm0-128H192v-96h192zm16-96h64v224h-64zm112 256a32 32 0 1132-32 32.09 32.09 0 01-32 32zm80-64h-48V256h48z"
          />
        </svg>

        {/* Road Animation */}
        <div className="absolute bottom-0 w-full h-2 bg-gray-300 animate-pulse">
          <div className="road-stripes absolute top-1/2 w-full h-0.5 bg-gray-500"></div>
        </div>
      </div>

      {/* Styling for the road */}
      <style jsx>{`
        .road-stripes {
          animation: move-stripes 1s linear infinite;
        }

        @keyframes move-stripes {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
