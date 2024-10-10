'use client';

import React, { useState } from 'react';
import Navbar from './home/Navbar';

const Header = () => {



  return (
    <header className="z-10 py-4 bg-white">
      <div className=" flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        {/* Mobile hamburger */}
        <button
          className="p-1 mr-5 -ml-1  md:hidden focus:outline-none focus:shadow-outline-purple"
          aria-label="Menu"
        >
        </button>

        {/* Navigation Items */}
        <div className="flex items-center flex-1 space-x-6">
          <Navbar />
        </div>
      </div>
    </header>
  );
};

export default Header;
