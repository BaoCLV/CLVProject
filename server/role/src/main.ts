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

  const protoPath = join(__dirname, '../../../src/protos/roles.proto');
  const grpcApp= await NestFactory.createMicroservice<MicroserviceOptions>(RolesModule, {
    transport: Transport.GRPC,
    options: {
      package: 'rolepermission',
      protoPath,
      url: '0.0.0.0:50053',
    },
  });
  await grpcApp.listen();
}


bootstrap();
