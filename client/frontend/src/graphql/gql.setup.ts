import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import Cookies from "js-cookie";

// Create an HTTP link to the GraphQL server
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_SERVER_URI,
});

// Middleware to attach authentication tokens to each request
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      accesstoken: Cookies.get("access_token") || "", 
      refreshtoken: Cookies.get("refresh_token") || "", 
    },
  });

  // Call the next link in the middleware chain
  return forward(operation);
});

// Initialize the Apollo Client
export const graphqlClient = new ApolloClient({
  link: authMiddleware.concat(httpLink),
  cache: new InMemoryCache(),
});
