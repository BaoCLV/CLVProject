import { Resolver, Context, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { RegisterResponse, LoginResponse, ActivationResponse, LogOutResponse } from '../types/user.types';
import { RegisterDto, LoginDto, ActivationDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Please fill the all fields');
    }

    const { activation_token } = await this.usersService.register(
      registerDto,
      context.res,
    );

    return { activation_token };
  }

  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args('activationDto') activationDto: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<ActivationResponse> {
    return await this.usersService.activateUser(activationDto, context.res);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    return await this.usersService.login({ email, password });
  }

  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async getLoggedInUser(@Context() context: {req: Request}) {
    return await this.usersService.getLoggedInUser(context.req)
  }

  @Query(() => LogOutResponse)
  @UseGuards(AuthGuard)
  async LogOutUser(@Context() context: {req: Request}) {
    return await this.usersService.Logout(context.req)
  }
}