'use client';

import { useRef, useCallback, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Spacer, Spinner } from '@nextui-org/react';
import SearchBar from '../../components/searchBar'; // Adjust the import path
import { useGetRoutes } from '../../../hooks/useRoute'; // Adjust the path to where your hooks are located

const queryClient = new QueryClient();

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Use the useGetRoutes hook that integrates GraphQL with useInfiniteQuery
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetRoutes(searchQuery); // Pass the search query to your hook

  // Use IntersectionObserver to implement infinite scrolling
  const observer = useRef<IntersectionObserver | null>(null);
  const lastRouteElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  // Handler to update search query based on input from SearchBar
  const handleSearchResults = (query: string) => {
    setSearchQuery(query);
  };

  // Render an error message if the query fails
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div className="dark min-h-screen h-screen p-0 bg-gray-100">
      <div className="h-full p-8">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          Dashboard
        </h1>
        <SearchBar getSearchResults={handleSearchResults} />
        <div className="flex flex-wrap gap-4 justify-start">
          {data?.pages.map((page, pageIndex) =>
            page.map((route: any, index: number) => {
              const isLastElement =
                pageIndex === data.pages.length - 1 && index === page.length - 1;
              return (
                <div
                  key={route.id}
                  ref={isLastElement ? lastRouteElementRef : null}
                  style={{
                    flex: '1 1 calc(33.333% - 1rem)',
                    minWidth: '300px',
                  }}
                >
                  <Card>
                    <CardHeader>
                      <h4 style={{ margin: 0 }}>{route.name}</h4>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <p>Start Location: {route.start_location}</p>
                      <p>End Location: {route.end_location}</p>
                      <p>Distance: {route.distance} km</p>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                      <Link href={`/api/route/${route.name}`}>View Details</Link>
                    </CardFooter>
                  </Card>
                </div>
              );
            })
          )}
        </div>
        <Spacer y={2} />
        <div className="text-center">
          {isFetchingNextPage && <Spinner label="Loading more..." />}
          {!hasNextPage && <p>No more data to load</p>}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}
