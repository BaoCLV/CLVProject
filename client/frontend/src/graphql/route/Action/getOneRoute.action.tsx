
import { gql, DocumentNode } from "@apollo/client";
export const GET_ROUTE = gql`
query GetRoute($name: String!) {
    route(name: $name) {
      id
      name
      startLocation
      endLocation
      distance
      createdAt
      updatedAt
    }
  }`