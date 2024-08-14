import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // Enable CORS
  app.enableCors({ credentials: true });

  // Logging middleware
  app.use((req, _, next) => {
    console.log(`Got invoked: '${req.originalUrl}'`);
    next();
  });
  // Proxy middleware with error handling and response interception
  app.use('/api/v1/auth-api', createProxyMiddleware({
    target: configService.get<string>('AUTH_SERVICE_URL'),
    changeOrigin: true,
    selfHandleResponse: true,
  }));
  app.use('/api/v1/notification-api', createProxyMiddleware({
    target: configService.get<string>('NOTIFICATION_SERVICE_URL'),
    changeOrigin: true,
    selfHandleResponse: true,
  }));

  // Start the server
  await app.listen(4000);
}

bootstrap();
