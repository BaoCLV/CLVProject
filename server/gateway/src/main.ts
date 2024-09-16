import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { GatewayModule } from './gateway/gateway.module';


async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const configService = app.get(ConfigService);
  // Enable CORS
  app.enableCors({ credentials: true });

  // Logging middleware
  app.use((req, _, next) => {
    console.log(`Got invoked: '${req.originalUrl}'`);
    
    next();
  });
  // Start the server
  await app.listen(5000);
}

bootstrap();
