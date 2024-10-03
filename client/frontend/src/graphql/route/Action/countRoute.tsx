// /graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_TOTALS = gql`
  query totalRoutes {
    totalRoutes
  }
`;
