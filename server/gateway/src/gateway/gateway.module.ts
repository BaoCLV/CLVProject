// import { Module } from '@nestjs/common';
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { GatewayController } from './gateway.controller';

// @Module({
//   imports: [
//     ClientsModule.register([
//       {
//         name: 'SERVICE_ONE',
//         transport: Transport.HTTP,
//         options: {
//           url: 'http://localhost:3001/graq', // URL of service one
//         },
//       },
//       {
//         name: 'SERVICE_TWO',
//         transport: Transport.HTTP,
//         options: {
//           url: 'http://localhost:3002', // URL of service two
//         },
//       },
//     ]),
//   ],
//   controllers: [GatewayController],
// })
// export class GatewayModule {}
