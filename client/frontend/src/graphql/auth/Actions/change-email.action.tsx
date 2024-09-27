'use client'

import { gql, useMutation } from '@apollo/client';

export const UPDATE_EMAIL = gql`
  mutation UpdateEmail($oldEmail: String!, $newEmail: String!) {
    updateEmail(changeEmailDto: { oldEmail: $oldEmail, newEmail: $newEmail }) {
      message
      activation_token
      error {
        message
        code
      }
    }
  }
`;