import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE', // gRPC client for auth service
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('AUTH_SERVICE_URL'),
            package: 'user', 
            protoPath: 'src/protos/user.proto',
          },
        }),
      },
      {
        name: 'ROUTE_SERVICE', // gRPC client for route service
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('ROUTE_SERVICE_URL'), 
            package: 'route', 
            protoPath: 'src/protos/route.proto', 
          },
        }),
      },
    ]),
  ],
  controllers: [GatewayController],
})
export class GatewayModule {}
