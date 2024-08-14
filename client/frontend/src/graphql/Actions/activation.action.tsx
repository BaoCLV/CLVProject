"use client";
import { gql, DocumentNode } from "@apollo/client";

export const ACTIVATE_USER: DocumentNode = gql`
  mutation ActivateUser($ActivationToken: String!, $ActivationCode: String!) {
    activateUser(
      activationDto: {
        ActivationToken: $ActivationToken
        ActivationCode: $ActivationCode
      }
    ) {
      user {
        name
        email
        phone_number
        createdAt
      }
    }
  }
`;
