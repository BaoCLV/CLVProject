import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: String!,
    $name: String!,
    $phone_number: String,
    $address: String,
    $roleId: String
  ) {
    updateUser(
      id: $id,
      updateUserDto: {
        name: $name,
        phone_number: $phone_number,
        address: $address,
        roleId: $roleId  
      }
    ) {
      message
      user {
        id
        name
        phone_number
        address
        roleId  
      }
    }
  }
`;
