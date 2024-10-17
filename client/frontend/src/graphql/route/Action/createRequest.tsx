import { gql, DocumentNode } from '@apollo/client';

export const CREATE_REQUEST: DocumentNode = gql`
  mutation CreateRequest($userId: String!, $routeId: String!, $requestType: String!, $proposedChanges: JSON) {
    createRequest(createRequestDto: { userId: $userId, routeId: $routeId, requestType: $requestType, proposedChanges: $proposedChanges }) {
      id
      userId
      routeId
      requestType
      status
      createdAt
      updatedAt
      proposedChanges
    }
  }
`;
