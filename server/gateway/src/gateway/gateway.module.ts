// src/app.module.ts
import { Module } from '@nestjs/common';
import { GraphqlGatewayModule } from '../graphql-gateway/graphql-gateway.module';

@Module({
  imports: [
    GraphqlGatewayModule, // Import the gateway module
  ],
})
export class GatewayModule {}
