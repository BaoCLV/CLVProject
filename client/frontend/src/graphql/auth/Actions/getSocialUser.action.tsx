"use client";

import { gql, DocumentNode } from "@apollo/client";

export const GET_SOCIAL_USER: DocumentNode = gql`
  query GetUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      user {
        id
        name
        email
        phone_number
        address
      }
      error {
        message
        code
      }
    }
  }
`;
