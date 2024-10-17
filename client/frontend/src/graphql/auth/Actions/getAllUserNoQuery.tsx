import { gql, DocumentNode } from '@apollo/client';

export const GET_ALL_USER_NO_QUERY: DocumentNode = gql`
  query GetAllUsers {
    findAllUser {
      users {
        id
        name
        email
        address
        phone_number
        roleId
        createdAt
        updatedAt
      }
      error {
        message
      }
    }
  }
`;
