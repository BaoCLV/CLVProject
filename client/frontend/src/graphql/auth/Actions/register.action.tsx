"use client";
import { gql, DocumentNode } from "@apollo/client";

export const REGISTER_USER: DocumentNode = gql`
  mutation register(
    $name: String!
    $password: String!
    $email: String!
    $phone_number: String!
    $address: String!
  ) {
    register(
      registerDto: {
        name: $name
        email: $email
        password: $password
        phone_number: $phone_number
        address: $address
      }
    ) {
      activation_token
    }
  }
`;
