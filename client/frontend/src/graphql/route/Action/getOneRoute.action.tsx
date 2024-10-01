
import { gql, DocumentNode } from "@apollo/client";
export const GET_ROUTE = gql`
query GetRoute($id: String!) {
    route(id: $id) {
      id
      startLocation
      endLocation
      distance
      createdAt
      updatedAt
    }
  }`