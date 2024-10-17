// /graphql/queries.ts
import { gql } from '@apollo/client';

export const UPDATE_ROLE = gql`
mutation UpdateRole($roleId: String!, $data: data!) {
  updateRole(roleId: $roleId, data: $data) {
    id
    name
    permissions {
      id
      name
    }
  }
}
`
