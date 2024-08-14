import { Controller,Query, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CreateRouteDto, UpdateRouteDto, RouteDto } from 'src/dto/route.dto';
import { RoutesService } from './route.service';

@Controller('routes')
export class RoutesController {constructor(private readonly routesService: RoutesService) {}

@Post()
create(@Body() createRouteDto: CreateRouteDto): RouteDto {
  return this.routesService.create(createRouteDto);
}

@Get()
findAll(
  @Query('query') query?: string,
  @Query('limit') limit?: number,
  @Query('offset') offset?: number
): RouteDto[] {
  return this.routesService.findAll(query, limit, offset);
}

@Get(':id')
findOne(@Param('id') id: number): RouteDto {
  return this.routesService.findOne(id);
}

@Patch(':id')
update(@Param('id') id: number, @Body() updateRouteDto: UpdateRouteDto): RouteDto {
  return this.routesService.update(id, updateRouteDto);
}

@Delete(':id')
remove(@Param('id') id: number): void {
  return this.routesService.remove(id);
}
}
