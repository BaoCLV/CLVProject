import { gql } from "@apollo/client";

export const GET_ROUTES_QUERY = gql`
  query GetRoutes($query: String, $limit: Int, $offset: Int) {
    routes(query: $query, limit: $limit, offset: $offset) {
      id
      startLocation
      endLocation
      distance
      price
      status
      userId
      createdAt
    }
  }
`;
