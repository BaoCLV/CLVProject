import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RoutesService } from './route.service';
import { CreateRouteDto, UpdateRouteDto } from 'src/dto/route.dto';
import { Route } from 'src/entities/route.entity';

@Resolver(() => Route)
export class RouteResolver {
  constructor(private readonly routesService: RoutesService) {}

  @Query(() => [Route])
  async routes(
    @Args('query', { type: () => String, nullable: true }) query?: string,
    @Args('limit', { type: () => Number, nullable: true }) limit?: number,
    @Args('offset', { type: () => Number, nullable: true }) offset?: number,
  ): Promise<Route[]> {
    return this.routesService.findAll({ query, limit, offset });
  }

  @Query(() => Route)
  async route(@Args('name', { type: () => String }) name: string): Promise<Route> {
    return this.routesService.findOneByName(name);
  }

  @Mutation(() => Route)
  async createRoute(@Args('data') data: CreateRouteDto): Promise<Route> {
    return this.routesService.create(data);
  }

  @Mutation(() => Route)
  async updateRoute(
    @Args('name') name: string,
    @Args('data') data: UpdateRouteDto,
  ): Promise<Route> {
    return this.routesService.updateByName(name, data);
  }

  @Mutation(() => Boolean)
  async deleteRoute(@Args('name', { type: () => String }) name: string): Promise<boolean> {
    await this.routesService.removeByName(name);
    return true;
  }
}
