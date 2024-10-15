import { gql } from '@apollo/client';

export const CREATE_ROLE= gql`
mutation CreateRole($name: String!, $permissionIds: [String!]!) {
  createRole(name: $name, permissionIds: $permissionIds) {
    id
    name
    permissions {
      id
      name
    }
  }
}
`;
