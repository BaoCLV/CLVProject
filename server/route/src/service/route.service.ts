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
    console.log(newRoute)
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
        'route.name LIKE :query OR route.startLocation LIKE :query OR route.endLocation LIKE :query',
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
  

  // Find a route by id
  async findOneById(id: string): Promise<Route> {
    const route = await this.routeRepository.findOne({ where: { id } });
    if (!route) {
      throw new NotFoundException(`Route with id "${id}" not found`);
    }
    return route;
  }

  // Update a route by name
  async updateById(id: string, data: UpdateRouteDto): Promise<Route> {
    const route = await this.findOneById(id);
    Object.assign(route, data); // Merge updates into the existing route
    return this.routeRepository.save(route);
  }

  // Remove a route by name
  async removeById(id: string): Promise<void> {
    const route = await this.findOneById(id);
    await this.routeRepository.remove(route);
  }
}
