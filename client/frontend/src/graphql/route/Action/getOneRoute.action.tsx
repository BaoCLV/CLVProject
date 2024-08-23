
import { gql, DocumentNode } from "@apollo/client";
export const GET_ROUTE = gql`
query GetRoute($name: String!) {
    route(name: $name) {
      id
      name
      start_location
      end_location
      distance
      createdAt
      updatedAt
    }
  }`