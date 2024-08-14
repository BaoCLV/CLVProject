"use client";

import { useState } from "react";
import { Input, Button } from "@nextui-org/react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <Input
        clearable
        underlined
        fullWidth
        placeholder="Search routes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search routes"
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
};

export default SearchBar;
