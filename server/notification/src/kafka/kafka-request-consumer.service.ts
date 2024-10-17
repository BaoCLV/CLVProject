import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, EachMessagePayload } from 'kafkajs';
import { Server } from 'socket.io';

@Injectable()
export class KafkaRequestConsumerService implements OnModuleInit {
  private readonly kafka = new Kafka({
    clientId: 'notification-service-consumer',
    brokers: ['localhost:9092'],
  });

  private readonly consumer = this.kafka.consumer({ groupId: 'notification-service-group' });
  private io: Server;

  constructor() {
    this.io = new Server(3005, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'UPDATE', 'DELETE'],
      },
    });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'request_created', fromBeginning: true });
    await this.consumer.subscribe({ topic: 'request_approved', fromBeginning: true });
    await this.consumer.subscribe({ topic: 'request_rejected', fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, message }: EachMessagePayload) => {
        const event = JSON.parse(message.value.toString());
        console.log(`Received event from ${topic}:`, event);

        // Broadcast event to the front-end
        try {
          this.io.emit(topic, event);
          console.log(`Emitted event to WebSocket: ${topic}`);
        } catch (error) {
          console.error(`Error processing event from ${topic}:`, error);
        }
      },
    });

    console.log('KafkaRequestConsumerService: Running');
  }
}
