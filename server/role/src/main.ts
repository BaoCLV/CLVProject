import { NestFactory } from '@nestjs/core';
import { RolesModule } from './service/roles.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(RolesModule, {
    transport: Transport.GRPC,
    options: {
      package: 'roles',
      protoPath: join(__dirname, '../src/proto/roles.proto'),
      url: 'localhost:50053',
    },
  });
  await app.listen();
  console.log('RoleService is running...');
}
bootstrap();
