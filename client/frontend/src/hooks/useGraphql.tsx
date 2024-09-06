import { useMemo } from "react";
import { authClient } from "../graphql/auth/auth.gql.setup";
import { routeClient } from "../graphql/route/route.gql.setup";

export const useGraphQLClient = (type: "auth" | "route") => {
  return useMemo(() => {
    if (type === "auth") {
      return authClient;
    }
    return routeClient;
  }, [type]);
};
