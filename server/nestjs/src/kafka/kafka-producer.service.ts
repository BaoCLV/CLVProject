import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  private readonly kafka = new Kafka({
    clientId: 'auth-service-producer',
    brokers: ['localhost:9092'],
  });

  private readonly producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
  }

  async sendUserRegisteredEvent(data: any) {
    await this.producer.send({
      topic: 'user-registered',
      messages: [{ value: JSON.stringify(data) }],
    });
  }
}
