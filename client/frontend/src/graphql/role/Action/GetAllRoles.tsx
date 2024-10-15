import { gql } from '@apollo/client';

export const GET_ALL_ROLES = gql`
query GetAllRoles {
  findAllRoles {
    id
    name
    permissions {
      id
      name
    }
  }
}
`;
