import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRouteDto, UpdateRouteDto } from 'src/dto/route.dto';
import { RouteDto } from 'src/dto/route.dto';

@Injectable()
export class RoutesService {
  private routes: RouteDto[] = [];
  private idCounter = 1;

  create(createRouteDto: CreateRouteDto): RouteDto {
    const newRoute: RouteDto = {
      id: this.idCounter++,
      ...createRouteDto,
    };
    this.routes.push(newRoute);
    return newRoute;
  }

  findAll(query?: string, limit?: number, offset?: number): RouteDto[] {
    // Apply search filtering
    let filteredRoutes = this.routes;
    if (query) {
      filteredRoutes = filteredRoutes.filter(route =>
        route.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply pagination
    const start = offset || 0;
    const end = limit ? start + limit : undefined;
    return filteredRoutes.slice(start, end);
  }

  findOne(id: number): RouteDto {
    const route = this.routes.find(route => route.id === id);
    if (!route) {
      throw new NotFoundException(`Route with id ${id} not found`);
    }
    return route;
  }

  update(id: number, updateRouteDto: UpdateRouteDto): RouteDto {
    const route = this.findOne(id);
    const updatedRoute = { ...route, ...updateRouteDto };
    this.routes = this.routes.map(r => (r.id === id ? updatedRoute : r));
    return updatedRoute;
  }

  remove(id: number): void {
    const route = this.findOne(id);
    this.routes = this.routes.filter(r => r.id !== id);
  }
}
