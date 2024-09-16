import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ROUTE_MUTATION } from "../graphql/route/Action/createRoute.action";
import { DELETE_ROUTE_MUTATION } from "../graphql/route/Action/deleteRoute.action";
import { UPDATE_ROUTE_MUTATION } from "../graphql/route/Action/updateRoute.action";
import { GET_ROUTE } from "../graphql/route/Action/getOneRoute.action";
import { GET_ROUTES_QUERY } from "../graphql/route/Action/getRoutes.action";
import { useGraphQLClient } from "../hooks/useGraphql";
import { useInfiniteQuery } from 'react-query';


// Hook for creating a route
export const useCreateRoute = () => {
  const routeClient = useGraphQLClient('route');
  const [createRoute] = useMutation(CREATE_ROUTE_MUTATION, { client: routeClient });

  const handleCreateRoute = async (data: {
    name: string;
    startLocation: string;
    endLocation: string;
    distance: number;
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

  const handleDeleteRoute = async (name: string) => {
    try {
      const response = await deleteRoute({
        variables: { name },
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

  const handleUpdateRoute = async (name: string, data: { 
    name: string;
    startLocation: string; 
    endLocation: string; 
    distance: number; 
  }) => {
    try {
      const response = await updateRoute({
        variables: { name, data },
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
export const useGetRoute = (name: string) => {
  const routeClient = useGraphQLClient('route');
  const { data, loading, error } = useQuery(GET_ROUTE, {
    variables: { name },
    client: routeClient,
  });

  return {
    loading,
    error,
    route: data?.route,
  };
};

// Hook for getting a list of routes with optional query, limit, and offset
export const useGetRoutes = (query = "") => {
  const routeClient = useGraphQLClient("route");

  return useInfiniteQuery(
    ["routes", query],
    async ({ pageParam = 0 }) => {
      const { data } = await routeClient.query({
        query: GET_ROUTES_QUERY,
        variables: {
          query,
          limit: 10.0,
          offset: pageParam * 1.0,
        },
      });

      if (!data?.routes) {
        throw new Error("Failed to fetch routes");
      }

      return data.routes;
    },
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length < 10) return undefined;
        return pages.length * 10;
      },
    }
  );
};
