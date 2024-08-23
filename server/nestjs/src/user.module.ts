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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const url = configService.get<string>('DATABASE_URL');
        return {
          type: 'postgres',
          url: url,
          host: url ? undefined : configService.get<string>('DB_HOST'),
          port: url ? undefined : +configService.get<number>('DB_PORT'),
          username: url ? undefined : configService.get<string>('DB_USER'),
          password: url ? undefined : configService.get<string>('DB_PASSWORD'),
          database: url ? undefined : configService.get<string>('DB_NAME'),
          entities: [User],
          synchronize: true,
        };
      },
      inject: [ConfigService],
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
