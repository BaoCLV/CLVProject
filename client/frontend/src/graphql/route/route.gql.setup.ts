import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from "@apollo/client";
import Cookies from "js-cookie";

const httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL });

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      "Content-Type": "application/json",
      "X-CSRF-Token": Cookies.get("csrf_token") || "",
      "X-Apollo-Operation-Name": operation.operationName || "",
    },
  }));

  return forward(operation);
});

export const routeClient = new ApolloClient({
  link: authMiddleware.concat(httpLink),
  cache: new InMemoryCache(),
});