import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('gateway')
export class GatewayController {
  constructor(
    @Inject('auth-api') private readonly authApiClient: ClientProxy,
    @Inject('SERVICE_TWO') private readonly serviceTwoClient: ClientProxy,
  ) {}

  @Get('service-one')
  getServiceOneData() {
    return this.authApiClient.send({ cmd: 'get-data' }, {});
  }

  @Post('service-two')
  postServiceTwoData(@Body() data: any) {
    return this.serviceTwoClient.send({ cmd: 'post-data' }, data);
  }
}
