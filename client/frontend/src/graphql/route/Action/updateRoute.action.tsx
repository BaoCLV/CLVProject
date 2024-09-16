import { gql, DocumentNode } from "@apollo/client";

export const UPDATE_ROUTE_MUTATION = gql`
mutation UpdateRoute($name: String!, $data: UpdateRouteDto!) {
  updateRoute(name: $name, data: $data) {
    id
    name
    startLocation
    endLocation
    distance
  }
}
`;