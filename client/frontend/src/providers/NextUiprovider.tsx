'use client'

import { ApolloProvider } from '@apollo/client'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useGraphQLClient } from '../hooks/useGraphql'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  const client = useGraphQLClient('route'); // Change 'auth' to 'route' as needed

  return (
    <SessionProvider>
      <ApolloProvider client={client}>
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            {children}
          </NextThemesProvider>
        </NextUIProvider>
      </ApolloProvider>
    </SessionProvider>
  )
}
