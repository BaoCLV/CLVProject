import { DocumentNode, gql } from "@apollo/client";

// Define the GraphQL mutation
export const CREATE_ROUTE_MUTATION: DocumentNode = gql`
  mutation CreateRoute($data: CreateRouteDto!) {
    createRoute(data: $data) {
      id
      startLocation
      endLocation
      distance
      price
      userId
    }
  }
`;
