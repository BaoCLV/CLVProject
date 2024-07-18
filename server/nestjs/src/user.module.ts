import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // GraphQLModule.forRoot<ApolloFederationDriverConfig>({
    //   driver: ApolloFederationDriver,
    //   autoSchemaFile: {
    //     federation: 2,
    //   },
    // }),
  ],
  providers: [UsersService, ConfigService, JwtService],
  controllers: [UsersController],
})
export class UsersModule {}
