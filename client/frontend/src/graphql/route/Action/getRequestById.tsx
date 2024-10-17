import { gql, DocumentNode } from '@apollo/client';

export const GET_ONE_REQUEST_BY_ID: DocumentNode = gql`
  query FindOneRequestById($id: String!) {
    findOneRequestById(id: $id) {
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
