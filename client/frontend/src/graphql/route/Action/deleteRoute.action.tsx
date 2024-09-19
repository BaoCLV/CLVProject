import { gql, DocumentNode } from "@apollo/client";


export const DELETE_ROUTE_MUTATION = gql`
  mutation DeleteRoute($id: String!) {
    deleteRoute(id: $id)
  }
`;