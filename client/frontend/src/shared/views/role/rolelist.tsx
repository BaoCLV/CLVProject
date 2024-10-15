"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import { useRoles } from '@/src/hooks/useRole';
import ProfileSidebar from '../../components/pages/admin/ProfileSidebar';
import Footer from '../../components/Footer';
import SearchBar from "../../components/searchBar"; // Import SearchBar component
import { QueryClient, QueryClientProvider } from 'react-query';
import Modal from '../../components/Modal';  // Import Modal component
import CreateRole from './createRole'; // Import CreateRole form component

const queryClient = new QueryClient();

function RoleDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 20;

  // Use roles data from the hook
  const { loadingRoles, errorRoles, roles: allRoles } = useRoles();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination and search state
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push(`/?page=${newPage}`);
  };

  // Search Handler
  const handleSearch = (query: string) => {
    if (query) {
      const filteredRoles = allRoles.filter((role: any) => {
        return role.name.toLowerCase().includes(query.toLowerCase());
      });
      setSearchResults(filteredRoles);
    } else {
      setSearchResults(allRoles); // Reset search results if query is empty
    }
  };

  // Determine the roles to display based on search results
  const rolesToDisplay = searchResults.length > 0 ? searchResults : allRoles;

  if (loadingRoles) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <Spinner label="Loading Roles Data..." />
      </div>
    );
  }

  if (errorRoles) {
    return <p>Error: {errorRoles.message}</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main layout container */}
      <div className="flex flex-1">
        <ProfileSidebar />

        {/* Content */}
        <div className="flex flex-col flex-1 bg-gray-200 py-16 px-8 relative">
          {/* Header with Search Bar and Create Role Button */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-600">Role List</h1>

            {/* Search Bar */}
            <div className="flex items-center gap-4">
              <SearchBar onSearch={handleSearch} />
              {/* Create Role Button */}
              <button
                onClick={() => setIsModalOpen(true)}  // Open modal on click
                className="flex items-center gap-2 px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                <FaPlus className="text-white" />
                Create Role
              </button>
            </div>
          </div>

          {/* Roles Table */}
          <div className="w-full">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap table-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-blue-600 uppercase border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4">Role Name</th>
                    <th className="px-6 py-4">Permissions</th> {/* New column for permissions */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {rolesToDisplay.length > 0 ? (
                    rolesToDisplay.map((role: any) => (
                      <tr key={role.id} className="hover:bg-blue-50 text-black transition-colors">
                        <td className="px-6 py-4 text-sm">{role.name}</td>

                        {/* Display role permissions */}
                        <td className="px-6 py-4 text-sm">
                          {role.permissions && role.permissions.length > 0 ? (
                            <ul>
                              {role.permissions.map((permission: any) => (
                                <li key={permission.id}>{permission.name}</li>
                              ))}
                            </ul>
                          ) : (
                            <span>No permissions assigned</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-gray-600">
                        No roles available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center py-6 px-4 mt-4 border-t border-gray-200">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className={`px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50`}
              >
                Previous
              </button>

              <span className="text-gray-600">Page {currentPage}</span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className={`px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Modal for Create Role */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateRole onClose={() => setIsModalOpen(false)} />  {/* Pass onClose function to close modal */}
      </Modal>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RoleDashboard />
    </QueryClientProvider>
  );
}

export default App;
