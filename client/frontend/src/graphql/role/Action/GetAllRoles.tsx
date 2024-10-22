import { gql } from '@apollo/client';

export const GET_ALL_ROLES = gql`
query FindAllRoles {
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
