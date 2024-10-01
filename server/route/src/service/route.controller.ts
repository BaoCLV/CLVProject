// // src/routes/route.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RoutesService } from './route.service';
import { CreateRouteDto, UpdateRouteDto } from '../dto/route.dto';

@Controller()
export class RouteController {
  constructor(private readonly routesService: RoutesService) {}

  @GrpcMethod('RouteService', 'CreateRoute')
  async createRoute(data: CreateRouteDto) {
    console.log('Data received in gRPC:', data); // Log the data received in the gRPC method
    if (!data.startLocation || !data.endLocation) {
      return { error: 'Start location and end location are required' };
    }
    const newRoute = await this.routesService.create(data);
    return { id: newRoute.id, message: 'Route created successfully!' };
  }

  @GrpcMethod('RouteService', 'FindAllRoutes')
  async findAllRoutes() {
    try {
      const routes = await this.routesService.findAll({});
      return { routes };
    } catch (error) {
      return { error: error.message };
    }
  }

  @GrpcMethod('RouteService', 'FindOneRoute')
  async findOneRoute(data: { id: string }) {
    try {
      const route = await this.routesService.findOneById(data.id);
      return { route };
    } catch (error) {
      return { error: error.message };
    }
  }

  @GrpcMethod('RouteService', 'UpdateRoute')
  async updateRoute(data: UpdateRouteDto & { id: string }) {
    try {
      const updatedRoute = await this.routesService.updateById(data.id, data);
      return { route: updatedRoute, message: 'Route updated successfully!' };
    } catch (error) {
      return { error: error.message };
    }
  }

  @GrpcMethod('RouteService', 'DeleteRoute')
  async deleteRoute(data: { id: string }) {
    try {
      await this.routesService.removeById(data.id);
      return { message: 'Route deleted successfully!' };
    } catch (error) {
      return { error: error.message };
    }
  }
}
