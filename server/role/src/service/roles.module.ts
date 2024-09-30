import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Role } from '../entities/role.entity';
import { User } from '../../../nestjs/src/entities/user.entity';
import { Permission } from 'src/entities/permission.entity';
// import { RoleController } from './roles.controller';
import { RoleService } from './roles.service';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { RoleResolver } from './roles.resolver';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User, Role, Permission]),
    // GraphQLModule.forRoot<ApolloFederationDriverConfig>({
    //   driver: ApolloFederationDriver,
    //   autoSchemaFile: {
    //     federation: 2
    //   },
    //   context: ({ req }) => ({ req })
    // }),
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
          entities: [User, Role, Permission],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    RoleService,
    RoleResolver
  ],
  exports: [RoleService]
})
export class RolesModule { }
