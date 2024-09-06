import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from '../entities/route.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoutesService } from './route.service';
import { RouteController } from './route.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { RouteResolver } from './route.resolver';

@Module({
  imports: [    
    ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forFeature([Route]),
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
        entities: [Route],
        synchronize: true,
      };
    },
    inject: [ConfigService],
  }),],
  controllers: [RouteController],
  providers: [ RoutesService,
    RouteResolver
  ],
})
export class RouteModule {}
