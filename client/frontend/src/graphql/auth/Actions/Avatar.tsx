import { gql } from '@apollo/client';

export const GET_AVATAR = gql`
query GetAvatar($userId: String!) {
  getAvatar(userId: $userId) {
    id
    imageDataBase64
    userId
  }
}
`;
