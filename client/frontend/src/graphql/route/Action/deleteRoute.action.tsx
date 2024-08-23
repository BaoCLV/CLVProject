import { gql, DocumentNode } from "@apollo/client";


export const DELETE_ROUTE_MUTATION = gql`
  mutation DeleteRoute($name: String!) {
    deleteRoute(name: $name)
  }
`;