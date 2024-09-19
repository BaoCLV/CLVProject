// src/kafka/kafka.module.ts
import { Module } from '@nestjs/common';
import { KafkaConsumerService } from './kafka-consumer.service';
import { EmailService } from '../email/email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
],
  providers: [KafkaConsumerService],
})

export class KafkaModule {}
