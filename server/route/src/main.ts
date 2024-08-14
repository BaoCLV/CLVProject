import { NestFactory } from '@nestjs/core';
import { RouteModule } from './service/route.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(RouteModule, {
    transport: Transport.GRPC,
    options: {
      package: 'route',
      protoPath: join(__dirname, '../protos/route.proto'),
    },
  });
  await app.listen();
}
bootstrap();
