import { NestFactory } from '@nestjs/core';
import { createProxyMiddleware } from 'http-proxy-middleware';
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
    console.log('hello')
    next();
  });
  // Proxy middleware with error handling and response interception
  app.use('/api/v1/auth-api', createProxyMiddleware({
    target: configService.get<string>('AUTH_SERVICE_URL'),
    changeOrigin: true,
    selfHandleResponse: true,
    
  }));
  app.use('/api/v1/route-api', createProxyMiddleware({
    target: configService.get<string>('ROUTE_SERVICE_URL'),
    changeOrigin: true,
    selfHandleResponse: true,
  }));

  // Start the server
  await app.listen(5000);
}

bootstrap();
