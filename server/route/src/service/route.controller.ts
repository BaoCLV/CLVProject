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
    try {
      const newRoute = await this.routesService.create(data);
      return { id: newRoute.id, message: 'Route created successfully!' };
    } catch (error) {
      return { error: error.message };
    }
  }

  // Updated method to call findAll without parameters
  // @GrpcMethod('RouteService', 'FindAllRoutes')
  // async findAllRoutes() {
  //   try {
  //     const routes = await this.routesService.findAll();
  //     return { routes };
  //   } catch (error) {
  //     return { error: error.message };
  //   }
  // }

  @GrpcMethod('RouteService', 'FindOneRoute')
  async findOneRoute(data: { name: string }) {
    try {
      const route = await this.routesService.findOneByName(data.name);
      return { route };
    } catch (error) {
      return { error: error.message };
    }
  }

  @GrpcMethod('RouteService', 'UpdateRoute')
  async updateRoute(data: UpdateRouteDto & { name: string }) {
    try {
      const updatedRoute = await this.routesService.updateByName(data.name, data);
      return { route: updatedRoute, message: 'Route updated successfully!' };
    } catch (error) {
      return { error: error.message };
    }
  }

  @GrpcMethod('RouteService', 'DeleteRoute')
  async deleteRoute(data: { name: string }) {
    try {
      await this.routesService.removeByName(data.name);
      return { message: 'Route deleted successfully!' };
    } catch (error) {
      return { error: error.message };
    }
  }
}
