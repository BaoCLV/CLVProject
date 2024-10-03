// src/routes/route.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RoutesService } from './route.service'; // Make sure the import points to the correct service file
import { CreateRouteDto, UpdateRouteDto } from '../dto/route.dto';
import { Route } from '../entities/route.entity';

@Resolver(() => Route)
export class RouteResolver {
  constructor(private readonly routesService: RoutesService) {}

  // Query to get all routes, optionally paginated
  @Query(() => [Route])
  async routes(
    @Args('query', { type: () => String, nullable: true }) query?: string,
    @Args('limit', { type: () => Number, nullable: true }) limit?: number,
    @Args('offset', { type: () => Number, nullable: true }) offset?: number,
  ): Promise<Route[]> {
    return this.routesService.findAll({ query, limit, offset });
  }

  // Query to get a specific route by id
  @Query(() => Route)
  async route(@Args('id', { type: () => String }) id: string): Promise<Route> {
    return this.routesService.findOneById(id);
  }

  // Mutation to create a new route
  @Mutation(() => Route)
  async createRoute(@Args('data') data: CreateRouteDto): Promise<Route> {
    return this.routesService.create(data);
  }

  // Mutation to update an existing route by name
  @Mutation(() => Route)
  async updateRoute(
    @Args('id', { type: () => String }) id: string,
    @Args('data') data: UpdateRouteDto,
  ): Promise<Route> {
    return this.routesService.updateById(id, data);
  }

  // Mutation to delete a route by name
  @Mutation(() => Boolean)
  async deleteRoute(@Args('id', { type: () => String }) id: string): Promise<boolean> {
    await this.routesService.removeById(id);
    return true;
  }

  // Query to get the total number of routes
  @Query(() => Number)
  async totalRoutes(): Promise<number> {
    return this.routesService.countRoutes(); // Use the service to count routes
  }
}
