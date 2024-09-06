import { gql } from "@apollo/client";

export const GET_ROUTES_QUERY = gql`
  query GetRoutes($query: String, $limit: Float, $offset: Float) {
    routes(query: $query, limit: $limit, offset: $offset) {
      id
      name
      start_location
      end_location
      distance
    }
  }
`;