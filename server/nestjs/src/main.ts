import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UsersModule } from './service/user.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UsersModule);

  app.enableCors({
    origin: '*',
  });
  await app.listen(3001);
}


bootstrap();
