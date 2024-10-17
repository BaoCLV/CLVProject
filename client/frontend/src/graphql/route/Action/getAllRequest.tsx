import { gql, DocumentNode } from '@apollo/client';

export const GET_ALL_REQUESTS: DocumentNode = gql`
  query GetAllRequests($query: String, $limit: Float, $offset: Float) {
    requests(query: $query, limit: $limit, offset: $offset) {
      id
      routeId
      requestType
      status
      createdAt
      updatedAt
      userId
      routeId
      proposedChanges
    }
  }
`;