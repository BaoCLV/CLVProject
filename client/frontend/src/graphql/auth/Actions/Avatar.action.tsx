import { gql } from '@apollo/client';

export const UPLOAD_AVATAR = gql`
mutation UploadAvatar($userId: String!, $imageDataBase64: String!) {
  uploadAvatar(userId: $userId, imageDataBase64: $imageDataBase64) {
    id
    imageDataBase64
    userId
  }
}
`;