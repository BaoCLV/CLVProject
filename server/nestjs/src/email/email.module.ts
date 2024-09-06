// import { Module } from '@nestjs/common';
// import { EmailService } from './email.service';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { join } from 'path';
// import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true, 
//     }),
//     MailerModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: async (config: ConfigService) => ({
//         transport: {
//           host: config.get<string>('SMTP_HOST'),
//           port: config.get<number>('SMTP_PORT'),
//           secure: false,
//           auth: {
//             user: config.get<string>('SMTP_MAIL'),
//             pass: config.get<string>('SMTP_PASS'),
//           },
//         },
//         defaults: {
//           from: `"CLV_BAOLAM" <${config.get<string>('SMTP_MAIL')}>`, // Use the configured email as the sender
//         },
//         template: {
//           dir: join(__dirname, '../../../email-templates/'),
//           adapter: new EjsAdapter(),
//           options: {
//             strict: false,
//           },
//         },
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   providers: [EmailService],
//   exports: [EmailService], // Export EmailService if it's used elsewhere in your app
// })
// export class EmailModule {}
