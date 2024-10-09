// /graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_ALL_PERMISSIONS = gql`
query GetAllPermissions {
  findAllPermissions {
    id
    name
  }
}
`;
