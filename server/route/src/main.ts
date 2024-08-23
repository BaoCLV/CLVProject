import { NestFactory } from '@nestjs/core';
import { RouteModule } from './service/route.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(RouteModule);
  app.enableCors({
    origin: '*',
  });
  await app.listen(4000); 


  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(RouteModule, {
    transport: Transport.GRPC,
    options: {
      package: 'route',
      protoPath: join(__dirname, '../protos/route.proto'),
      url: '0.0.0.0:5000',
    },
  });

  await grpcApp.listen();
}
bootstrap();
