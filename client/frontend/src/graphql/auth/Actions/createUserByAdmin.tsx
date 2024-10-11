"use client";
import { gql, DocumentNode } from "@apollo/client";

export const CREATE_USER: DocumentNode = gql`
  mutation CreateUser(
    $name: String!, 
    $email: String!, 
    $password: String!, 
    $phone_number: String!, 
    $address: String!
  ) {
    createUser(data: {
      name: $name,
      email: $email,
      password: $password,
      phone_number: $phone_number,
      address: $address

    }) {
      id
      name
      email
      phone_number
      address

    }
  }
`;
