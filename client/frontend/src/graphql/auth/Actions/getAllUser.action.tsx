"use client";

import { gql, DocumentNode } from "@apollo/client";

export const GET_ALL_USER: DocumentNode = gql`
query {
  getAllUsers {
    users {
      id
      name
      email
      roles
      address
      phone_number
      refreshToken
      createdAt
      updatedAt
    }
    error {
      message
    }
  }
}
`;
