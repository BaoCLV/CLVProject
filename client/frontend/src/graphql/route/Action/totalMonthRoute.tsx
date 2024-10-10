import { gql } from '@apollo/client';

export const GET_TOTAL_ROUTES_FOR_MONTH = gql`
  query totalRoutesForMonth($year: Int!, $month: Int!) {
    totalRoutesForMonth(year: $year, month: $month)
  }
`;
