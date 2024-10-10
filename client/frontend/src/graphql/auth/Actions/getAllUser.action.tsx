"use client";

import { gql, DocumentNode } from "@apollo/client";

export const GET_ALL_USER: DocumentNode = gql`
  query GetAllUsers($query: String, $limit: Float, $offset: Float) {
    getAllUsers(query: $query, limit: $limit, offset: $offset) {
      users {
        id
        name
        email
        address
        phone_number
        roleId
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
