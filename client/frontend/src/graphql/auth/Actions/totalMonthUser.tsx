import { gql } from "@apollo/client";

export const GET_TOTAL_USERS_FOR_MONTH = gql`
  query totalUsersForMonth($year: Int!, $month: Int!) {
    totalUsersForMonth(year: $year, month: $month)
  }
`;