import { Controller } from '@nestjs/common';

import { RoutesService } from './route.service';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

}
