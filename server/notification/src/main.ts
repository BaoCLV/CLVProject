import { NestFactory } from '@nestjs/core';
import { KafkaModule } from './kafka/kafka.module';

import { EmailModule } from './email/email.module';

async function bootstrap() {
  const app = await NestFactory.create(EmailModule);
  await app.listen(6000);
}
bootstrap();
