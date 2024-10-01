import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (): Promise<GqlModuleOptions> => {
        const gateway = new ApolloGateway({
            serviceList: [
                { name: 'authService', url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001/graphql' },
                { name: 'RouteService', url: process.env.ROUTE_SERVICE_URL || 'http://localhost:4000/graphql' },
                { name: 'RoleService', url: process.env.ROLE_SERVICE_URL || 'http://localhost:6000/graphql' },
              ],
            });

        return {
          context: ({ req }) => ({ headers: req.headers }),  // Pass headers for authentication
        };
      },
    }),
  ],
})
export class GatewayModule {}
