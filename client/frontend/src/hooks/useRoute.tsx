import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ROUTE_MUTATION } from "../graphql/route/Action/createRoute.action";
import { DELETE_ROUTE_MUTATION } from "../graphql/route/Action/deleteRoute.action";
import { UPDATE_ROUTE_MUTATION } from "../graphql/route/Action/updateRoute.action";
import { GET_ROUTE } from "../graphql/route/Action/getOneRoute.action";
import { GET_ROUTES_QUERY } from "../graphql/route/Action/getRoutes.action";
import { useGraphQLClient } from "../hooks/useGraphql";
import { useInfiniteQuery } from 'react-query';
import { number } from "zod";
import { GET_TOTALS } from "../graphql/route/Action/countRoute";
import { GET_TOTAL_ROUTES_FOR_MONTH } from "../graphql/route/Action/totalMonthRoute";


// Hook for creating a route
export const useCreateRoute = () => {
  const routeClient = useGraphQLClient('route');
  const [createRoute] = useMutation(CREATE_ROUTE_MUTATION, { client: routeClient });

  const handleCreateRoute = async (data: {
    userId: string;
    startLocation: string;
    endLocation: string;
    distance: number;
    price: number;
  }) => {
    try {
      const response = await createRoute({
        variables: { data },
      });
      return response.data.createRoute;
    } catch (error) {
      console.error("Error creating route:", error);
      throw error;
    }
  };

  return { handleCreateRoute };
};

// Hook for deleting a route
export const useDeleteRoute = () => {
  const routeClient = useGraphQLClient('route');
  const [deleteRoute] = useMutation(DELETE_ROUTE_MUTATION, { client: routeClient });

  const handleDeleteRoute = async (id: number) => {
    try {
      const response = await deleteRoute({
        variables: { id },
      });
      return response.data.deleteRoute;
    } catch (error) {
      console.error("Error deleting route:", error);
      throw error;
    }
  };

  return { handleDeleteRoute };
};

// Hook for updating a route
export const useUpdateRoute = () => {
  const routeClient = useGraphQLClient('route');
  const [updateRoute] = useMutation(UPDATE_ROUTE_MUTATION, { client: routeClient });

  const handleUpdateRoute = async (id: number, data: { 
    startLocation: string; 
    endLocation: string; 
    distance: number;
    price: number;
    status: string;
  }) => {
    try {
      const response = await updateRoute({
        variables: { id, data },
      });
      return response.data.updateRoute;
    } catch (error) {
      console.error("Error updating route:", error);
      throw error;
    }
  };

  return { handleUpdateRoute };
};

// Hook for getting a single route by name
export const useGetRoute = (id: number) => {
  const routeClient = useGraphQLClient('route');
  const { data, loading, error } = useQuery(GET_ROUTE, {
    variables: { id },
    client: routeClient,
  });

  return {
    loading,
    error,
    route: data?.route,
  };
};

// Hook for getting a list of routes with optional query, limit, and offset
export const useGetRoutes = (currentPage: number, itemsPerPage: number) => {
  const routeClient = useGraphQLClient('route');

  return useInfiniteQuery(
    ['routes', currentPage], 
    async ({ pageParam = currentPage }) => {
      const offset = (pageParam - 1) * itemsPerPage;

      const { data } = await routeClient.query({
        query: GET_ROUTES_QUERY,
        variables: {
          limit: itemsPerPage,
          offset: offset,
        },
      });

      if (!data?.routes) {
        throw new Error('Failed to fetch routes');
      }

      return data.routes;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < itemsPerPage) return undefined;
        return allPages.length + 1;
      },
      getPreviousPageParam: (firstPage, allPages) => {
        if (allPages.length === 1) return undefined;
        return allPages.length - 1;
      },
    }
  );
};
export const useTotalsRoute = () => {
  const routeClient = useGraphQLClient('route');
  const { data, loading, error } = useQuery(GET_TOTALS, { client: routeClient });

  return {
    totalRoutes: data?.totalRoutes || 0,
    loading,
    error,
  };
};

export const useTotalsRouteForMonth = (year: number, month: number) => {
  const routeClient = useGraphQLClient('route');
  
  const { data, loading, error } = useQuery(GET_TOTAL_ROUTES_FOR_MONTH, {
    client: routeClient,
    variables: { year, month },
  });

  return {
    totalRoutesMonth: data?.totalRoutesForMonth || 0,
    loading,
    error,
  };
};
