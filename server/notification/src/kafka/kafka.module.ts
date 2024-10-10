// src/kafka/kafka.module.ts
import { Module } from '@nestjs/common';
import { KafkaConsumerService } from './kafka-consumer.service';
import { EmailService } from '../email/email.service';
import { ConfigModule } from '@nestjs/config';
import { KafkaRequestConsumerService } from './kafka-request-consumer.service';

@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
],
  providers: [KafkaConsumerService, KafkaRequestConsumerService],
})

export class KafkaModule {}
