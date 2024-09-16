// components/SearchBar.tsx
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Input, Button } from "@nextui-org/react";
import { useLazyQuery } from '@apollo/client';
import { GET_ROUTES_QUERY } from "@/src/graphql/route/Action/getRoutes.action";
interface SearchBarProps {
  getSearchResults: (results: any) => void;
}

export default function SearchBar({ getSearchResults }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");
  const [limit, setLimit] = useState<number>(10); // Default limit
  const [offset, setOffset] = useState<number>(0); // Default offset

  const [fetchRoutes, { loading, data, error }] = useLazyQuery(GET_ROUTES_QUERY, {
    onCompleted: (data) => {
      getSearchResults(data.findAll);
    },
  });

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    fetchRoutes({
      variables: {
        query,
        limit,
        offset,
      },
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <Input
        isClearable
        variant="underlined"
        fullWidth
        placeholder="Search routes..."
        value={query}
        onChange={handleInputChange}
        aria-label="Search routes"
      />
      <Button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </Button>
      {error && <p className="text-red-500">Error: {error.message}</p>}
    </div>
  );
}
