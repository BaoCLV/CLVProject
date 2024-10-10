import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  private readonly kafka = new Kafka({
    clientId: 'request-service-producer',
    brokers: ['localhost:9092'],
  });

  private readonly producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
  }

  async sendRequestCreateRouteEvent(data: any) {
    await this.producer.send({
      topic: 'request_created',
      messages: [{ value: JSON.stringify(data) }],
    });
  }
  async sendRequestApproveRouteEvent(data: any) {
    await this.producer.send({
      topic: 'request_approved',
      messages: [{ value: JSON.stringify(data) }],
    });
  }
  async sendRequestRejectRouteEvent(data: any) {
    await this.producer.send({
      topic: 'request_rejected',
      messages: [{ value: JSON.stringify(data) }],
    });
  }
}
