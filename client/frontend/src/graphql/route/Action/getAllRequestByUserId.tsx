import { gql, DocumentNode } from '@apollo/client';

export const GET_ALL_REQUESTS_BY_USER_ID: DocumentNode = gql`
  query GetAllRequestsByUserId($userId: String!, $query: String, $limit: Float, $offset: Float) {
    getAllRequestByUserId(userId: $userId, query: $query, limit: $limit, offset: $offset) {
      id
      requestType
      status
      startLocation
      endLocation
      distance
    }
  }
`;