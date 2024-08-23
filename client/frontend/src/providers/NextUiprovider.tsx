'use client';

import { ApolloProvider } from '@apollo/client';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { authClient } from '../graphql/auth/auth.gql.setup';
import { routeClient } from '../graphql/route/route.gql.setup';
import { useContext, createContext, useMemo } from 'react';

const ClientContext = createContext(authClient);

export function useApolloClientProvider(clientType: 'auth' | 'route') {
  const client = useMemo(() => (clientType === 'auth' ? authClient : routeClient), [clientType]);
  return client;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <ClientContext.Provider value={authClient}>
            <ApolloProvider client={authClient}>
              {children}
            </ApolloProvider>
          </ClientContext.Provider>
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}


