import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from '../entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from "@nestjs/jwt";
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';
import { Role } from '../../../role/src/entities/role.entity';
import { Permission } from '../../../role/src/entities/permission.entity';
import { SeedService } from 'src/seeder/SeedService';
import { Avatar } from 'src/entities/avatar.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User, Avatar, Role, Permission]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2
      },
      context: ({ req }) => ({ req })
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
          entities: [User, Avatar, Role, Permission],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    UsersService,
    UsersResolver,
    ConfigService,
    JwtService,
    KafkaProducerService,
    SeedService
  ],
  exports: [UsersService]
})
export class UsersModule { }
