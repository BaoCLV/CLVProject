import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        serviceList: [
          { name: 'authService', url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001/graphql' },
          { name: 'routeService', url: process.env.ROUTE_SERVICE_URL || 'http://localhost:4000/graphql' },
        ],
      },
    }),
  ],
})
export class GatewayModule {}
