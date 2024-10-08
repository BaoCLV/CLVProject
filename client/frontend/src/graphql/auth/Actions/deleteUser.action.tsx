import { gql, DocumentNode } from "@apollo/client";

const DELETE_USER: DocumentNode = gql`
  mutation deleteUser($id: String!) {
    deleteUser(id: $id)
  }
`;

export default DELETE_USER;
