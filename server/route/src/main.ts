import { NestFactory } from '@nestjs/core';
import { RouteModule } from './service/route.module';
import { ClientKafka, MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(RouteModule);
  app.enableCors({
    origin: '*',
  });
  await app.listen(4000); 
}
bootstrap();
