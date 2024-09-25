'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Input, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { Key } from 'react'; // Import Key type

interface FilterButtonProps {
  onFilter: (filterType: string, minQuery: string, maxQuery: string) => void;
}

const FilterButton = ({ onFilter }: FilterButtonProps) => {
  const [filterType, setFilterType] = useState('distance');
  const [minQuery, setMinQuery] = useState<string>('');  // For minimum value
  const [maxQuery, setMaxQuery] = useState<string>('');  // For maximum value

  // Adjust the key parameter type to be `Key`
  const handleFilterChange = (key: Key) => {
    setFilterType(String(key)); // Ensure it's converted to a string if needed
  };

  // Handle input change for min and max queries
  const handleMinInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMinQuery(e.target.value);
  };

  const handleMaxInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMaxQuery(e.target.value);
  };

  // Form submission for distance range
  const handleFilterSubmit = (e: FormEvent) => {
    e.preventDefault();
    onFilter(filterType, minQuery, maxQuery); // Pass both min and max queries
  };

  return (
    <div className="flex items-center space-x-4">
      <Dropdown>
        <DropdownTrigger>
          <Button>{filterType.charAt(0).toUpperCase() + filterType.slice(1)}</Button>
        </DropdownTrigger>
        
        <DropdownMenu
          aria-label="Filter By"
          onAction={handleFilterChange}
        >
          {filterType === 'distance' ? (
            // Show range inputs if filter type is 'distance'
            <form onSubmit={handleFilterSubmit} className="flex flex-col space-y-2">
              <Input
                type="number"
                placeholder="Min distance"
                value={minQuery}
                onChange={handleMinInputChange}
                aria-label="Min distance"
                min="0"
                className="mb-2"
              />
              <Input
                type="number"
                placeholder="Max distance"
                value={maxQuery}
                onChange={handleMaxInputChange}
                aria-label="Max distance"
                min="0"
                className="mb-2"
              />
              <Button type="submit">Filter</Button>
            </form>
          ) : (
            // For non-distance filters, single input for query
            <form onSubmit={handleFilterSubmit} className="flex flex-col space-y-2">
              <Input
                type="text"
                placeholder={`Filter by ${filterType}`}
                value={minQuery} // Use minQuery for non-range filters
                onChange={handleMinInputChange}
                aria-label={`Filter by ${filterType}`}
                className="mb-2"
              />
              <Button type="submit">Filter</Button>
            </form>
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default FilterButton;
