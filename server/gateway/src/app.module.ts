import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';

@Module({
  imports: [    ConfigModule.forRoot({
      isGlobal: true, // This makes the ConfigService available globally
    }),],
  providers: [AppService],
})
export class AppModule {}
