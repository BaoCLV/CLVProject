import { gql, DocumentNode } from '@apollo/client';

export const UPDATE_TOKEN_FOR_GG_USER: DocumentNode = gql`
  mutation UpdateTokenForGGUser($email: String!) {
    updateTokenForGGUser(email: $email)
  }
`;
