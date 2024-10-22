  "use client";

  import { gql, DocumentNode } from "@apollo/client";

  export const GET_USER_BY_ID: DocumentNode = gql`
    query GetUserById($id: String!) {
      getUserById(id: $id) {
        user {
          id
          name
          email
          phone_number
          address
          roleId
        }
        error {
          message
          code
        }
      }
    }
  `;
