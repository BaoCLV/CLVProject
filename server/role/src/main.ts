import { NestFactory } from '@nestjs/core';
import { RolesModule } from './service/roles.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(RolesModule);

  app.enableCors({
    origin: '*',
  });
  await app.listen(3003);

  const protoPath = join('./src/protos/roles.proto');
  const grpcApp= await NestFactory.createMicroservice<MicroserviceOptions>(RolesModule, {
    transport: Transport.GRPC,
    options: {
      package: 'role',
      protoPath,
      url: '0.0.0.0:5003',
    },
  });
  await grpcApp.listen();
}

bootstrap();
