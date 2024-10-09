// /graphql/queries.ts
import { gql } from '@apollo/client';

export const UPDATE_ROLE = gql`
mutation UpdateRole($roleId: String!, $updateRoleInput: UpdateRoleDto!) {
  updateRole(roleId: $roleId, updateRoleInput: $updateRoleInput) {
    id
    name
    permissions {
      id
      name
    }
  }
}
`
