// src/routes/routes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from 'src/entities/route.entity';
import { CreateRouteDto, UpdateRouteDto } from 'src/dto/route.dto';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {}

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

    if (query) {
      qb.where('LOWER(route.name) LIKE LOWER(:query)', { query: `%${query}%` });
    }

    if (offset) {
      qb.skip(offset);
    }

    if (limit) {
      qb.take(limit);
    }

    return qb.getMany();
  }

  async findOneByName(name: string): Promise<Route> {
    const route = await this.routeRepository.findOne({ where: { name } });
    if (!route) {
      throw new NotFoundException(`Route with name "${name}" not found`);
    }
    return route;
  }

  async updateByName(name: string, data: UpdateRouteDto): Promise<Route> {
    const route = await this.findOneByName(name);
    Object.assign(route, data); // Merge updates into the existing route
    return this.routeRepository.save(route);
  }

  async removeByName(name: string): Promise<void> {
    const route = await this.findOneByName(name);
    await this.routeRepository.remove(route);
  }
}
