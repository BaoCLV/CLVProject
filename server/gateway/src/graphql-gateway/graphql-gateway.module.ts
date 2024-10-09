import { Module } from '@nestjs/common';
import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig, ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        serviceList: [
          //{ name: 'authService', url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001/graphql' },
          { name: 'routeService', url: process.env.ROUTE_SERVICE_URL || 'http://localhost:4000/graphql' },
          { name: 'RoleService', url: process.env.ROLE_SERVICE_URL || 'http://localhost:3003/graphql' },
        ],
      },
      server: {
        context: ({ req }) => {
          return { headers: req.headers };
        },
        playground: true,
        introspection: true,
      },
    }),
  ],
})
export class GatewayModule {}
