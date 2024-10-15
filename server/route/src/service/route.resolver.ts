import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RoutesService } from './route.service';
import { CreateRouteDto, UpdateRouteDto } from '../dto/route.dto';
import { Route } from '../entities/route.entity';

@Resolver(() => Route)
export class RouteResolver {
  constructor(private readonly routesService: RoutesService) {}

  // Query to get all routes
  @Query(() => [Route])
  async routes(
    @Args('query', { type: () => String, nullable: true }) query?: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ): Promise<Route[]> {
    return this.routesService.findAll({ query, limit, offset });
  }

  // Query to get a route by id
  @Query(() => Route)
  async route(@Args('id', { type: () => String }) id: string): Promise<Route> {
    return this.routesService.findOneById(id);
  }

  // Mutation to create a new route
  @Mutation(() => Route)
  async createRoute(@Args('data') data: CreateRouteDto): Promise<Route> {
    return this.routesService.create(data);
  }

  // Mutation to update an existing route
  @Mutation(() => Route)
  async updateRoute(
    @Args('id', { type: () => String }) id: string,
    @Args('data') data: UpdateRouteDto,
  ): Promise<Route> {
    return this.routesService.updateById(id, data);
  }

  // Mutation to delete a route
  @Mutation(() => Boolean)
  async deleteRoute(@Args('id', { type: () => String }) id: string): Promise<boolean> {
    await this.routesService.removeById(id);
    return true;
  }

  // Query to get the total number of routes
  @Query(() => Int)
  async totalRoutes(): Promise<number> {
    return this.routesService.countRoutes();
  }

  // Query to get the total number of routes for a specific month
  @Query(() => Int)
  async totalRoutesForMonth(
    @Args('year', { type: () => Int }) year: number,
    @Args('month', { type: () => Int }) month: number,
  ): Promise<number> {
    return this.routesService.countRoutesForMonth(year, month);
  }
}
