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
import { GET_ALL_REQUESTS } from "../graphql/route/Action/getAllRequest";
import { GET_ALL_ROUTES } from "../graphql/route/Action/getAllRoutes";
import { APPROVE_REQUEST, REJECT_REQUEST } from "../graphql/route/Action/updateRequestStatus";
import { CREATE_REQUEST } from "../graphql/route/Action/createRequest";
import { GET_ALL_REQUESTS_BY_USER_ID } from "../graphql/route/Action/getAllRequestByUserId";
import { GET_ONE_REQUEST_BY_ID } from "../graphql/route/Action/getRequestById";


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

  const handleDeleteRoute = async (id: string) => {
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

  const handleUpdateRoute = async (id: string, data: { 
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
export const useGetRoute = (id: string) => {
  const routeClient = useGraphQLClient('route');
  const { data, loading, error } = useQuery(GET_ROUTE, {
    variables: { id },
    client: routeClient,
    skip: !id
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

// Hook for getting a list of routes without page
export const useGetAllRoute = () => {
  const routeClient = useGraphQLClient('route');
  const { loading: loadingRoutes, error: errorRoutes, data: routesData } = useQuery(GET_ALL_ROUTES, { client: routeClient });

  return {
    loadingRoutes,
    errorRoutes,
    routes: routesData?.getAllRoutes || []
  };
  // return useInfiniteQuery(
  //   ['routes'], 
  //   async () => {
  //     const { data } = await routeClient.query({
  //       query: GET_ALL_ROUTES
  //     });

  //     if (!data?.routes) {
  //       throw new Error('Failed to fetch all routes');
  //     }
  //     return data.routes;
  //   }
  // );
};


// Hook for getting a list of requests with optional query, limit, and offset
export const useGetRequests = (currentPage: number, itemsPerPage: number) => {
  const requestClient = useGraphQLClient('route');

  return useInfiniteQuery(
    ['requests', currentPage],
    async ({ pageParam = currentPage }) => {
      const offset = (pageParam - 1) * itemsPerPage;

      const { data } = await requestClient.query({
        query: GET_ALL_REQUESTS,
        variables: {
          limit: itemsPerPage,
          offset: offset,
        },
      });

      if (!data?.requests) {
        throw new Error('Failed to fetch requests');
      }

      return data.requests;
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

// Hook for updating a status
export const useApproveRequestStatus = () => {
  const routeClient = useGraphQLClient('route');
  const [approveStatus] = useMutation(APPROVE_REQUEST, { client: routeClient });

  const approveRequestStatus = async (id: string, status: string) => {
    try {
      const response = await approveStatus({
        variables: { id, status },
      });
      console.log("response.data", response.data)
      return response.data;
    } catch (error) {
      console.error("Error updating status:", error);
      throw error;
    }
  }
  return approveRequestStatus;
}

export const useRejectRequestStatus = () => {
  const routeClient = useGraphQLClient('route');
  const [rejectStatus] = useMutation(REJECT_REQUEST, { client: routeClient });

  const rejectRequestStatus = async (id: string, status: string) => {
    try {
      const response = await rejectStatus({
        variables: { id, status },
      });
      console.log("response.data", response.data)
      return response.data;
    } catch (error) {
      console.error("Error updating status:", error);
      throw error;
    }
  }
  return rejectRequestStatus;
}

export const useCreateRequest = () => {
  const routeClient = useGraphQLClient('route');
  const [createRequest] = useMutation(CREATE_REQUEST, { client: routeClient });

  const handleCreateRequest = async (userId: string, routeId: string, requestType: string, proposedChanges: Object) => {
    try {
      const response = await createRequest({
        variables: { userId, routeId, requestType, proposedChanges }
      });
      console.log(response)
      return response;
    } catch (error) {
      console.error("Error creating request:", error);
      throw error;
    }
  };

  return handleCreateRequest;
};

// Hook for getting a list of requests with optional query, limit, and offset
export const useGetRequestsByUserId = (currentPage: number, itemsPerPage: number) => {
  const requestClient = useGraphQLClient('route');

  return useInfiniteQuery(
    ['requests', currentPage],
    async ({ pageParam = currentPage }) => {
      const offset = (pageParam - 1) * itemsPerPage;

      const { data } = await requestClient.query({
        query: GET_ALL_REQUESTS_BY_USER_ID,
        variables: {
          limit: itemsPerPage,
          offset: offset,
        },
      });

      if (!data?.allRequestByUserId) {
        throw new Error('Failed to fetch requests');
      }

      return data.allRequestByUserId;
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

// Hook for getting a single route by name
export const useGetRequestById = (id: string) => {
  const routeClient = useGraphQLClient('route');
  const { loading: loadingRequest, error: errorRequest, data: dataRequest} = useQuery(GET_ONE_REQUEST_BY_ID, {
    variables: { id },
    client: routeClient,
  });

  return {
    loadingRequest,
    errorRequest,
    request: dataRequest?.findOneRequestById,
  };
};

