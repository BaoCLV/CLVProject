import { gql, DocumentNode } from "@apollo/client";

export const UPDATE_ROUTE_MUTATION = gql`
mutation UpdateRoute($id: String!, $data: UpdateRouteDto!) {
  updateRoute(id: $id, data: $data) {
    id
    startLocation
    endLocation
    distance
    price
    status
    userId
  }
}
`;