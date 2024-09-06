import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UsersModule } from './service/user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UsersModule);

  app.enableCors({
    origin: '*',
  });
  await app.listen(3001);
  const grpcApp= await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, {
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(__dirname, '../src/protos/auth.proto'),
      url: '0.0.0.0:50051',
    },
  });
  await grpcApp.listen();
}


bootstrap();
