'use client';

import React, { useState } from 'react';
import SearchBar from './searchBar'; // Ensure this path is correct based on your project structure
import NavItems from '../NavItems'; // Ensure this path is correct based on your project structure
import UserDropDown from '../UserDropdown'; // Ensure this path is correct based on your project structure

const Header = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearchResults = (results: any) => {
    setSearchResults(results);
    console.log('Search Results:', results);
  };

  return (
    <header className="z-10 py-4 shadow-md bg-white">
      <div className=" flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        {/* Mobile hamburger */}
        <button
          className="p-1 mr-5 -ml-1  md:hidden focus:outline-none focus:shadow-outline-purple"
          aria-label="Menu"
        >
        </button>

        {/* Navigation Items */}
        <div className="flex items-center flex-1 space-x-6">
          <NavItems />

          {/* Search Bar Component */}
          <div className="flex-1 max-w-xs">
            <SearchBar getSearchResults={handleSearchResults} />
          </div>
        </div>

        <ul className="flex items-center flex-shrink-0 space-x-6">

          {/* User Dropdown */}
          <li>
            <UserDropDown />
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
