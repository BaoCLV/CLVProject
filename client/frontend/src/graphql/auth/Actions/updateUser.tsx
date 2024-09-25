import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: String!,
    $name: String!,
    $email: String!,
    $phone_number: String,
    $address: String,

  ) {
    updateUser(
      id: $id,
      updateUserDto: {
        name: $name,
        email: $email,
        phone_number: $phone_number,
        address: $address,

      }
    ) {
      message
      user {
        id
        name
        email
        phone_number
        address
      }
    }
  }
`;
