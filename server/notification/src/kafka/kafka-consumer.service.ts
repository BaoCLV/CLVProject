// src/kafka/kafka-consumer.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, EachMessagePayload } from 'kafkajs';
import { EmailService } from '../email/email.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private readonly kafka = new Kafka({
    clientId: 'email-service-consumer',
    brokers: ['localhost:9092'],
  });

  private readonly consumer = this.kafka.consumer({ groupId: 'email-service-group' });

  constructor(private readonly emailService: EmailService) {}

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'user-registered', fromBeginning: true });
    await this.consumer.subscribe({ topic: 'user-forgot-password', fromBeginning: true });
    await this.consumer.subscribe({ topic: 'user-email-change', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        const event = JSON.parse(message.value.toString());
        console.log(`Received event from ${topic}:`, event);

        try {
          if (topic === 'user-registered') {
            // Handle user registration event
            await this.emailService.sendActivationEmail({
              subject: 'Activate your account!',
              email: event.email,
              name: event.name,
              ActivationCode: event.activationCode,
              template: 'activation-mail',
            });
            console.log(`Activation email sent successfully to ${event.email}`);
          } else if (topic === 'user-forgot-password') {
            // Handle forgot password event
            await this.emailService.sendActivationEmail({
              subject: 'Reset Your Password',
              email: event.email,
              name: event.name,
              ActivationCode: event.activation_code,
              template: 'forgot-password', 
            });
            console.log(`Password reset email sent successfully to ${event.email}`);
          } else if (topic === 'user-change-password') {
            // Handle forgot password event
            await this.emailService.sendActivationEmail({
              subject: 'Reset Your Password',
              email: event.email,
              name: event.name,
              ActivationCode: event.activation_code,
              template: 'change-password-mail', 
            });
            console.log(`Password change email sent successfully to ${event.email}`);
          }
        } catch (error) {
          console.error(`Error processing event from ${topic}:`, error);
        }
      },
    });
  }
}
