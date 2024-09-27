import { NestFactory } from '@nestjs/core';
import { GatewayModule } from '../src/graphql-gateway/graphql-gateway.module'; // Adjust path as needed
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 5000; 

  app.enableCors({ credentials: true });

  await app.listen(port);
  console.log(`API Gateway is running on: http://localhost:${port}`);
}

bootstrap();
