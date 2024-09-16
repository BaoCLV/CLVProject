import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway.controller';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';

// Mock implementation of ClientProxy
const mockClientProxy = {
  send: jest.fn(),
};

describe('GatewayController', () => {
  let controller: GatewayController;
  let userServiceClient: ClientProxy;
  let routeServiceClient: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
      providers: [
        { provide: 'USER_SERVICE', useValue: mockClientProxy },
        { provide: 'ROUTE_SERVICE', useValue: mockClientProxy },
      ],
    }).compile();

    controller = module.get<GatewayController>(GatewayController);
    userServiceClient = module.get<ClientProxy>('USER_SERVICE');
    routeServiceClient = module.get<ClientProxy>('ROUTE_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for Register User
  it('should register a user', (done) => {
    const registerData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone_number: 1234567890,
      address: '123 Street Name',
    };

    mockClientProxy.send.mockReturnValue(of({ activation_token: '12345' }));

    controller.registerUser(registerData).subscribe((response) => {
      expect(response).toEqual({ activation_token: '12345' });
      expect(userServiceClient.send).toHaveBeenCalledWith(
        { cmd: 'Register' },
        registerData,
      );
      done();
    });
  });

  // Test for Login User
  it('should login a user', (done) => {
    const loginData = { email: 'john@example.com', password: 'password123' };

    mockClientProxy.send.mockReturnValue(
      of({
        user: { id: '1', name: 'John Doe' },
        accessToken: 'token123',
        refreshToken: 'refreshToken123',
      }),
    );

    controller.loginUser(loginData).subscribe((response) => {
      expect(response).toEqual({
        user: { id: '1', name: 'John Doe' },
        accessToken: 'token123',
        refreshToken: 'refreshToken123',
      });
      expect(userServiceClient.send).toHaveBeenCalledWith(
        { cmd: 'Login' },
        loginData,
      );
      done();
    });
  });

  // Test for Create Route
  it('should create a route', (done) => {
    const routeData = {
      name: 'Route 1',
      start_location: 'Point A',
      end_location: 'Point B',
      distance: 100.5,
    };

    mockClientProxy.send.mockReturnValue(
      of({ id: 'route123', message: 'Route created successfully' }),
    );

    controller.createRoute(routeData).subscribe((response) => {
      expect(response).toEqual({
        id: 'route123',
        message: 'Route created successfully',
      });
      expect(routeServiceClient.send).toHaveBeenCalledWith(
        { cmd: 'CreateRoute' },
        routeData,
      );
      done();
    });
  });

  // Test for Get All Routes
  it('should get all routes', (done) => {
    mockClientProxy.send.mockReturnValue(
      of({
        routes: [
          { id: '1', name: 'Route 1', start_location: 'A', end_location: 'B', distance: 10 },
        ],
      }),
    );

    controller.findAllRoutes().subscribe((response) => {
      expect(response).toEqual({
        routes: [
          { id: '1', name: 'Route 1', start_location: 'A', end_location: 'B', distance: 10 },
        ],
      });
      expect(routeServiceClient.send).toHaveBeenCalledWith({ cmd: 'FindAllRoutes' }, {});
      done();
    });
  });
});
