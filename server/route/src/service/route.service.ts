// src/routes/routes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from '../entities/route.entity';
import { CreateRouteDto, UpdateRouteDto } from '../dto/route.dto';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {}

  // Create a new route
  async create(data: CreateRouteDto): Promise<Route> {
    const newRoute = this.routeRepository.create(data);
    return this.routeRepository.save(newRoute);
  }

  async findAll({
    query,
    limit,
    offset,
  }: { query?: string; limit?: number; offset?: number }): Promise<Route[]> {
    const qb = this.routeRepository.createQueryBuilder('route');
  
    // Apply query filtering if provided
    if (query) {
      qb.where(
        'route.name LIKE :query OR route.start_location LIKE :query OR route.end_location LIKE :query',
        {
          query: `%${query}%`,
        },
      );
    }
  
    // Apply offset if provided
    if (offset) {
      qb.skip(offset);
    }
  
    // Apply limit if provided
    if (limit) {
      qb.take(limit);
    }
  
    qb.orderBy('route.id', 'DESC');
  
    return qb.getMany();
  }
  

  // Find a route by name
  async findOneByName(name: string): Promise<Route> {
    const route = await this.routeRepository.findOne({ where: { name } });
    if (!route) {
      throw new NotFoundException(`Route with name "${name}" not found`);
    }
    return route;
  }

  // Update a route by name
  async updateByName(name: string, data: UpdateRouteDto): Promise<Route> {
    const route = await this.findOneByName(name);
    Object.assign(route, data); // Merge updates into the existing route
    return this.routeRepository.save(route);
  }

  // Remove a route by name
  async removeByName(name: string): Promise<void> {
    const route = await this.findOneByName(name);
    await this.routeRepository.remove(route);
  }
}
