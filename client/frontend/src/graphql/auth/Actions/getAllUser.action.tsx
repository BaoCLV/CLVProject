"use client";

import { gql, DocumentNode } from "@apollo/client";

export const GET_ALL_USER: DocumentNode = gql`
query {
  getAllUsers {
    users {
      id
      name
      email
      role
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
