import { Module } from '@nestjs/common';
import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig, ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloGateway } from '@apollo/gateway';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true, // Makes ConfigModule globally available
    // }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      // inject: [ConfigService],
      useFactory: async (): Promise<GqlModuleOptions> => {
        const gateway = new ApolloGateway({
            serviceList: [
                { name: 'authService', url: 'http://localhost:3001/graphql' },
                { name: 'RouteService', url: 'http://localhost:4000/graphql' },
                // { name: 'RoleService', url: process.env.ROLE_SERVICE_URL || 'http://localhost:6000/graphql' },
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
