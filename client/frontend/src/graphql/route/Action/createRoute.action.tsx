import { DocumentNode, gql, useMutation } from "@apollo/client";

// Define the GraphQL mutation
export const CREATE_ROUTE_MUTATION: DocumentNode = gql`
mutation CreateRoute($data: CreateRouteDto!) {
  createRoute(data: $data) {
    id
    name
    start_location
    end_location
    distance
  }
}
`;


export const useCreateRoute = () => {
  const [createRoute] = useMutation(CREATE_ROUTE_MUTATION);

  const handleCreateRoute = async (data: {
    name: string;
    start_location: string;
    end_location: string;
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
