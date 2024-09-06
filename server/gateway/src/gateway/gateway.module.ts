import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Register gRPC client for Auth service
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(__dirname, '../../src/protos/auth.proto'),
          url: 'localhost:50051',
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'ROUTE_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'route',
          protoPath: join(__dirname, '../../src/protos/route.proto'),
          url: 'localhost:50052',
        },
      },
    ]),
  ],
})
export class GatewayModule {}
