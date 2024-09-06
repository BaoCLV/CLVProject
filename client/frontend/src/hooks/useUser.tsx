import { useQuery } from "@apollo/client";
import { GET_USER } from "../graphql/auth/Actions/getUser.action";
import { useGraphQLClient } from "../hooks/useGraphql";

const useUser = () => {
  const authClient = useGraphQLClient('auth'); // Use the auth client
  const { loading, data } = useQuery(GET_USER, { client: authClient });

  return {
    loading,
    user: data?.getLoggedInUser?.user,
  };
};

export default useUser;
