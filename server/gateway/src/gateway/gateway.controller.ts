import { Controller, Get, Post, Body, Inject, Param, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('gateway')
export class GatewayController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authApiClient: ClientProxy,
    @Inject('ROUTE_SERVICE') private readonly routeServiceClient: ClientProxy,
  ) {}

  // Methods for UserService (AUTH_SERVICE)

  // Register a new user
  @Post('auth/register')
  registerUser(@Body() data: any): Observable<any> {
    return this.authApiClient.send({ cmd: 'register' }, data);
  }

  // Login user
  @Post('auth/login')
  loginUser(@Body() data: any): Observable<any> {
    return this.authApiClient.send({ cmd: 'login' }, data);
  }

  // Activate a user
  @Post('auth/activate')
  activateUser(@Body() data: any): Observable<any> {
    return this.authApiClient.send({ cmd: 'activateUser' }, data);
  }

  // Get all users
  @Get('auth/users')
  getAllUsers(): Observable<any> {
    return this.authApiClient.send({ cmd: 'getUsers' }, {});
  }

  // Logout user
  @Post('auth/logout')
  logoutUser(): Observable<any> {
    return this.authApiClient.send({ cmd: 'logout' }, {});
  }

  // Get logged in user details
  @Get('auth/loggedin-user')
  getLoggedInUser(): Observable<any> {
    return this.authApiClient.send({ cmd: 'getLoggedInUser' }, {});
  }

  @Get('user/:email')
  getUserByEmail(@Param('email') email: string): Observable<any> {
    return this.authApiClient.send({ cmd: 'getUserByEmail' }, { email });
  }


  // Methods for RouteService (SERVICE_TWO)

  // Create a new route
  @Post('route')
  createRoute(@Body() data: any): Observable<any> {
    return this.routeServiceClient.send({ cmd: 'createRoute' }, data);
  }

  // Get all routes
  @Get('routes')
  getAllRoutes(): Observable<any> {
    return this.routeServiceClient.send({ cmd: 'findAllRoutes' }, {});
  }

  // Get a single route by ID
  @Get('route/:id')
  getOneRoute(@Param('id') id: string): Observable<any> {
    return this.routeServiceClient.send({ cmd: 'findOneRoute' }, { id });
  }

  // Update a route by ID
  @Patch('route/:id')
  updateRoute(@Param('id') id: string, @Body() data: any): Observable<any> {
    return this.routeServiceClient.send({ cmd: 'updateRoute' }, { id, ...data });
  }

  // Delete a route by ID
  @Delete('route/:id')
  deleteRoute(@Param('id') id: string): Observable<any> {
    return this.routeServiceClient.send({ cmd: 'deleteRoute' }, { id });
  }
}
