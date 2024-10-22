import { gql, DocumentNode } from '@apollo/client';

export const CHANGE_PASSWORD: DocumentNode = gql`
  mutation ChangePassword($changePasswordDto: ChangePasswordDto!) {
    changePassword(changePasswordDto: $changePasswordDto) {
      user {
        name
        email
      }
      updatedPassword
      message
      error {
        message
      }
    }
  }
`;
