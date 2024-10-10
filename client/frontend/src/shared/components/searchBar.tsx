"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@nextui-org/react";
import { AiOutlineSearch } from "react-icons/ai"; // Import the search icon from react-icons
import { useLazyQuery } from "@apollo/client";
import { GET_ROUTES_QUERY } from "@/src/graphql/route/Action/getRoutes.action";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  getSearchResults: (results: any) => void;
}

export default function SearchBar({ getSearchResults }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");
  const [limit, setLimit] = useState<number>(10); // Default limit
  const [offset, setOffset] = useState<number>(0); // Default offset

  const router = useRouter();

  const [fetchRoutes, { loading, error }] = useLazyQuery(GET_ROUTES_QUERY, {
    onCompleted: (data) => {
      getSearchResults(data.findAll);
    },
  });

  const handleSearch = (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    fetchRoutes({
      variables: {
        query,
        limit,
        offset,
      },
    });
    router.push(`/search?query=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2 p-2">
      <div className="flex items-center w-full"> {/* Wrapper to hold icon and input */}
        <AiOutlineSearch className="text-blue-500 mr-2" size={20} /> {/* Purple search icon */}
        <Input
          isClearable
          variant="underlined"
          fullWidth
          placeholder="Search routes..."
          value={query}
          onChange={handleInputChange}
          aria-label="Search routes"
          className="h-8 bg-gray-300 text-black rounded" // Light green background and black text
        />
      </div>
      {error && <p className="text-red-500">Error: {error.message}</p>}
    </form>
  );
}
