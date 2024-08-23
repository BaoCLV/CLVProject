"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Input, Button } from "@nextui-org/react";

interface SearchBarProps {
  getSearchResults: (results: any) => void;
}

export default function SearchBar({ getSearchResults }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");
  const [limit, setLimit] = useState<number>(10); // Default limit
  const [offset, setOffset] = useState<number>(0); // Default offset

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();

    const response = await fetch(
      `/api/routes/search?query=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
    );
    const searchResults = await response.json();

    getSearchResults(searchResults);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <Input
        clearable
        underlined
        fullWidth
        placeholder="Search routes..."
        value={query}
        onChange={handleInputChange}
        aria-label="Search routes"
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}
