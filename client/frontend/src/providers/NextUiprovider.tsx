
'use client'

import { ApolloProvider } from '@apollo/client'
import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from 'next-themes'
import { graphqlClient } from '../graphql/gql.setup'
import { SessionProvider } from 'next-auth/react'

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={graphqlClient}>
    <SessionProvider>
    <NextUIProvider>
      <NextThemesProvider attribute='class' defaultTheme='dark'>
      {children}
      </NextThemesProvider>
    </NextUIProvider>
    </SessionProvider>
    </ApolloProvider>
  )
}