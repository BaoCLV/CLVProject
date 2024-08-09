import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from "@nestjs/jwt";
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { EmailService } from './email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation:2
      }
    }),
    EmailModule,
  ],
  providers: [
    UsersService, 
    UsersResolver, 
    ConfigService,
    JwtService,
    EmailService
  ],
exports: [UsersService]
})
export class UsersModule {}
