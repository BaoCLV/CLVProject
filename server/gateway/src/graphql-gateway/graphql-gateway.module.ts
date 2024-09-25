import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloGateway } from '@apollo/gateway';
import { GqlModuleOptions } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (): Promise<GqlModuleOptions> => {
        const gateway = new ApolloGateway({
            serviceList: [
                { name: 'authService', url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001/graphql' },
                { name: 'RouteService', url: process.env.ROUTE_SERVICE_URL || 'http://localhost:4000/graphql' },
              ],
            });

        return {
          context: ({ req }) => ({ headers: req.headers }),  // Pass headers for authentication
        };
      },
    }),
  ],
})
export class GraphqlGatewayModule {}

