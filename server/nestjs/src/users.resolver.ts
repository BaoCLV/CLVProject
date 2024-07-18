import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { RegisterResponse, LoginResponse } from './dto/response.dto';
import { RegisterDto, LoginDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.usersService.getUser();
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
  ): Promise<RegisterResponse> {
    return this.usersService.register(registerDto);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginDto') loginDto: LoginDto,
  ): Promise<LoginResponse> {
    return this.usersService.login(loginDto);
  }
}
