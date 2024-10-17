import { Resolver, Context, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { RegisterResponse, LoginResponse, ActivationResponse, LogOutResponse, ForgotPasswordResponse, ResetPasswordResponse, GetUserByEmailResponse, UserListResponse, ChangePasswordResponse, RequestChangePasswordResponse, UpdateUserResponse } from '../types/user.types';
import { RegisterDto, LoginDto, ActivationDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, RequestChangePasswordDto, UpdateUserDto } from '../dto/user.dto';
import {  User } from '../entities/user.entity';
import { BadRequestException, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { PermissionsGuard, RequirePermissions, ROLE_KEY } from 'src/guards/permissions.guard';
import { Avatar } from 'src/entities/avatar.entity';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Mutation(() => Avatar)
  async uploadAvatar(
    @Args('userId') userId: string,
    @Args('imageDataBase64') imageDataBase64: string,
  ): Promise<Avatar> {
    return this.usersService.uploadAvatar(userId, imageDataBase64);
  }
  
  @Query(() => Avatar, { nullable: true })
  async getAvatar(@Args('userId') userId: string): Promise<Avatar> {
    return this.usersService.getAvatar(userId);
  }

  @Query(() => Number)
  async totalUsers(): Promise<Number> {
    return this.usersService.countUsers();

  }
  @Query(() => Number)
  async totalUsersForMonth(
    @Args('year', { type: () => Int }) year: number,
    @Args('month', { type: () => Int }) month: number,
  ): Promise<number> {
    return this.usersService.countUsersForMonth(year, month);
  }
  @Query(() => UserListResponse)
  @UseGuards(AuthGuard)//PermissionsGuard
  @RequirePermissions('admin')
  @SetMetadata(ROLE_KEY, ['create', 'read', 'update', 'delete'])
  async getAllUsers(
    @Args('query', { type: () => String, nullable: true }) query?: string,
    @Args('limit', { type: () => Number, nullable: true }) limit?: number,
    @Args('offset', { type: () => Number, nullable: true }) offset?: number,
  ): Promise<UserListResponse> {
    return this.usersService.getAllUser({ query, limit, offset });
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password || !registerDto.address) {
      throw new BadRequestException('Please fill all fields');
    }

    const { activation_token } = await this.usersService.register(
      registerDto,
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
  async getLoggedInUser(@Context() context: { req: Request }) {
    return await this.usersService.getLoggedInUser(context.req);
  }

  @Query(() => GetUserByEmailResponse)
  @UseGuards(AuthGuard)//PermissionsGuard
  @RequirePermissions('admin')
  @SetMetadata(ROLE_KEY, ['read', 'write', 'delete', 'update'])
  async getUserByEmail(
    @Args('email', { type: () => String }) email: string
  ): Promise<GetUserByEmailResponse> {
    return await this.usersService.getUserByEmail(email);
  }

  @Query(() => GetUserByEmailResponse)
  @UseGuards(AuthGuard)//PermissionsGuard
  @RequirePermissions('admin')
  @SetMetadata(ROLE_KEY, ['read', 'write', 'delete', 'update'])
  async getUserById(
    @Args('id', { type: () => String }) id: string
  ): Promise<GetUserByEmailResponse> {
    return await this.usersService.getUserById(id);
  }

  @Query(() => LogOutResponse)
  @UseGuards(AuthGuard)
  async LogOutUser(@Context() context: { req: Request }) {
    return await this.usersService.Logout(context.req);
  }

  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(
    @Args('forgotPasswordDto') forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
    return await this.usersService.forgotPassword(forgotPasswordDto);
  }

  @Mutation(() => ResetPasswordResponse)
  async resetPassword(
    @Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    return await this.usersService.resetPassword(resetPasswordDto);
  }

  @Mutation(() => UpdateUserResponse)
  async updateUser(
    @Args('id') id: string,
    @Args('updateUserDto') updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    const updatedUser = await this.usersService.updateUser(id, updateUserDto);

    return {
      message: 'User profile updated successfully',
      user: updatedUser,
    };
  }

  @Mutation(() => RequestChangePasswordResponse)
  @UseGuards(AuthGuard)//PermissionsGuard
  @RequirePermissions('admin', 'user')
  @SetMetadata(ROLE_KEY, ['read', 'update'])
  async RequestChangePassword(
    @Args('requestChangePasswordDto') requestChangePasswordDto: RequestChangePasswordDto,
    @Context() context: any,
  ): Promise<ChangePasswordResponse> {
    const user = context.req.user;
    return await this.usersService.requestChangePassword(requestChangePasswordDto, user);
  }

  @Mutation(() => ChangePasswordResponse)
  async changePassword(
    @Args('changePasswordDto') changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponse> {
    return await this.usersService.changePassword(changePasswordDto);
  }

  // Create a new user by admin
  @Mutation(() => User)
  async createUser(
    @Args('data') data: RegisterDto,    
  ): Promise<User> {
    return this.usersService.createUser(data);
  }

  // Mutation to delete a user by id
  @Mutation(() => Boolean)
  async deleteUser(@Args('id', { type: () => String }) id: string): Promise<boolean> {
    await this.usersService.deleteById(id);
    return true;
  }

  // Query to get all users without pages
  @Query(() => UserListResponse)
  async findAllUser(): Promise<UserListResponse> {
    const result = await this.usersService.findAllUsers();
    return result; // Return the UserListResponse object
  }
}

