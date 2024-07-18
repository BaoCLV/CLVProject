import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { AppService } from './app.service';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { User } from './entities/user.entity';
import { IntrospectAndCompose } from '@apollo/gateway';
import { UsersModule } from './user.module';

@Module({
  imports: [
    // GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
    //   driver: ApolloGatewayDriver,
    //   gateway: {
    //     supergraphSdl: new IntrospectAndCompose({
    //       subgraphs: [],
    //     }),
    //   },
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'db', 
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'CLVproject',
      entities: [User],
      synchronize: false,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
