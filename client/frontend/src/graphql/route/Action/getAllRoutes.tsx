import { gql, DocumentNode } from '@apollo/client';

export const GET_ALL_ROUTES: DocumentNode = gql`
  query GetAllRoutes {
    getAllRoutes {
      id
      startLocation
      endLocation
      distance
      userId
      createdAt
      updatedAt
    }
  }
`;
