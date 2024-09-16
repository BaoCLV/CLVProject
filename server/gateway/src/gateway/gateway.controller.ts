// src/gateway/gateway.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs';

// Import the generated gRPC types
import { 
  RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, ActivationRequest, 
  ActivationResponse, EmptyRequest, UserListResponse, LogoutResponse, GetLoggedInUserResponse 
} from '../protos/user';

import { 
  CreateRouteRequest, CreateRouteResponse, FindAllRoutesRequest, FindAllRoutesResponse, 
  FindOneRouteRequest, FindOneRouteResponse, UpdateRouteRequest, UpdateRouteResponse, 
  DeleteRouteRequest, DeleteRouteResponse 
} from '../protos/route';

// Define interfaces for gRPC services based on your proto files
interface UserService {
  register(data: RegisterRequest): Observable<RegisterResponse>;
  login(data: LoginRequest): Observable<LoginResponse>;
  activateUser(data: ActivationRequest): Observable<ActivationResponse>;
  getUsers(data: EmptyRequest): Observable<UserListResponse>;
  logout(data: EmptyRequest): Observable<LogoutResponse>;
  getLoggedInUser(data: EmptyRequest): Observable<GetLoggedInUserResponse>;
}

interface RouteService {
  createRoute(data: CreateRouteRequest): Observable<CreateRouteResponse>;
  findAllRoutes(data: FindAllRoutesRequest): Observable<FindAllRoutesResponse>;
  findOneRoute(data: FindOneRouteRequest): Observable<FindOneRouteResponse>;
  updateRoute(data: UpdateRouteRequest): Observable<UpdateRouteResponse>;
  deleteRoute(data: DeleteRouteRequest): Observable<DeleteRouteResponse>;
}

@Controller('gateway')
export class GatewayController {
  private userService: UserService;
  private routeService: RouteService;

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientGrpc,
    @Inject('ROUTE_SERVICE') private readonly routeClient: ClientGrpc,
  ) {}

  onModuleInit() {
    // Initialize gRPC service instances
    this.userService = this.authClient.getService<UserService>('UserService');
    this.routeService = this.routeClient.getService<RouteService>('RouteService');
  }

  // UserService Methods

  @Post('user/register')
  async registerUser(@Body() data: RegisterRequest) {
    // Calls Register RPC of UserService
    return await lastValueFrom(this.userService.register(data));
  }

  @Post('user/login')
  async loginUser(@Body() data: LoginRequest) {
    // Calls Login RPC of UserService
    return await lastValueFrom(this.userService.login(data));
  }

  @Post('user/activate')
  async activateUser(@Body() data: ActivationRequest) {
    // Calls ActivateUser RPC of UserService
    return await lastValueFrom(this.userService.activateUser(data));
  }

  @Get('user/logout')
  async logoutUser() {
    // Calls Logout RPC of UserService
    return await lastValueFrom(this.userService.logout({}));
  }

  @Get('user')
  async getUsers() {
    // Calls GetUsers RPC of UserService
    return await lastValueFrom(this.userService.getUsers({}));
  }

  @Get('user/logged-in')
  async getLoggedInUser() {
    // Calls GetLoggedInUser RPC of UserService
    return await lastValueFrom(this.userService.getLoggedInUser({}));
  }

  // RouteService Methods
  // @Get('user/:email')
  // getUserByEmail(@Param('email') email: string): Observable<any> {
  //   return this.authClient.send({ cmd: 'getUserByEmail' }, { email });
  // }


  // Methods for RouteService

  @Post('route')
  async createRoute(@Body() data: CreateRouteRequest) {
    console.log(data)
    return await lastValueFrom(this.routeService.createRoute(data));
  }

  @Get('route')
  async findAllRoutes() {
    // Calls FindAllRoutes RPC of RouteService
    return await lastValueFrom(this.routeService.findAllRoutes({}));
  }

  @Get('route/:id')
  async findOneRoute(@Param('id') id: string) {
    // Calls FindOneRoute RPC of RouteService
    return await lastValueFrom(this.routeService.findOneRoute({ id }));
  }

  @Put('route/:id')
  async updateRoute(@Param('id') id: string, @Body() data: UpdateRouteRequest) {
    // Calls UpdateRoute RPC of RouteService
    return await lastValueFrom(this.routeService.updateRoute({ ...data, id }));
  }

  @Delete('route/:id')
  async deleteRoute(@Param('id') id: string) {
    // Calls DeleteRoute RPC of RouteService
    return await lastValueFrom(this.routeService.deleteRoute({ id }));
  }
}


