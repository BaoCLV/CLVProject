import { gql, DocumentNode } from '@apollo/client';

export const APPROVE_REQUEST: DocumentNode = gql`
  mutation ApproveRequest($id: String!) {
    approveRequest(id: $id)
  }
`;

export const REJECT_REQUEST: DocumentNode = gql`
  mutation RejectRequest($id: String!) {
    rejectRequest(id: $id)
  }
`;