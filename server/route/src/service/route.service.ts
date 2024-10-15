import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Route } from '../entities/route.entity';
import { CreateRouteDto, UpdateRouteDto } from '../dto/route.dto';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {}

  // Create route with price and status
  async create(data: CreateRouteDto): Promise<Route> {
    const newRoute = this.routeRepository.create({
      ...data,
      status: data.status || 'pending',  // Default to 'pending' if not provided
    });
    return this.routeRepository.save(newRoute);
  }

  // Find all routes with optional search and pagination
  async findAll({
    query,
    limit,
    offset,
  }: {
    query?: string;
    limit?: number;
    offset?: number;
  }): Promise<Route[]> {
    const qb = this.routeRepository.createQueryBuilder('route');
  
    const isValidUUID = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
  
    if (query && isValidUUID(query)) {
      qb.where('route.id = :id', { id: query });
    } else if (query) {
      qb.where(
        '(route.startLocation LIKE :query OR route.endLocation LIKE :query)',
        { query: `%${query}%` },
      );
    }

    if (offset) {
      qb.skip(offset);
    }
  
    if (limit) {
      qb.take(limit);
    }
  
    qb.orderBy('route.createdAt', 'DESC');  // Order by creation date
  
    return qb.getMany();
  }

  // Find a route by ID
  async findOneById(id: string): Promise<Route> {
    const route = await this.routeRepository.findOne({ where: { id } });
    if (!route) {
      throw new NotFoundException(`Route with id "${id}" not found`);
    }
    return route;
  }

  // Update a route
  async updateById(id: string, data: UpdateRouteDto): Promise<Route> {
    const route = await this.findOneById(id);
    Object.assign(route, data);  // Merge updates into the existing route
    return this.routeRepository.save(route);
  }

  // Delete a route
  async removeById(id: string): Promise<void> {
    const route = await this.findOneById(id);
    await this.routeRepository.remove(route);
  }

  // Count total routes
  async countRoutes(): Promise<number> {
    return this.routeRepository.count();
  }

  // Count total routes for a specific month
  async countRoutesForMonth(year: number, month: number): Promise<number> {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);  // Last day of the month
  
    return this.routeRepository.count({
      where: {
        createdAt: Between(startOfMonth, endOfMonth),
      },
    });
  }
}
