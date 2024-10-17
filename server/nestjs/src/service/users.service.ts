import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ActivationDto, ChangePasswordDto, ForgotPasswordDto, LoginDto, RegisterDto, RequestChangePasswordDto, ResetPasswordDto, UpdateUserDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterResponse, LoginResponse, GetUserByEmailResponse, UserListResponse } from '../types/user.types';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenSender } from '../utils/sendToken';
import { GrpcMethod, ClientGrpc, Client } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';
import { join } from 'path';
import { Transport } from '@nestjs/microservices';


interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  address: string;
}

interface RoleResponse {
  role: {
    id: string;
    name: string;
    permissions?: any[];
  };
}

interface RoleServiceClient {
  GetRoleByName(data: { name: string }): Observable<RoleResponse>;
}

@Injectable()
export class UsersService implements OnModuleInit {

  // gRPC client for RoleService
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'role',
      protoPath: join('./src/protos/roles.proto'), // Path to role proto file
      url: 'localhost:5003', // Role service gRPC endpoint
    },
  })
  private roleClient: ClientGrpc;

  private roleService: RoleServiceClient;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly kafkaProducerService: KafkaProducerService,
  ) { }

  onModuleInit() {
    this.roleService = this.roleClient.getService<RoleServiceClient>('RoleService');
  }

  @GrpcMethod('UserService', 'GetAllUser')
  async getAllUser({ query,
    limit,
    offset
  }: { query?: string; limit?: number; offset?: number }): Promise<UserListResponse> {
    const usersQuery = this.userRepository.createQueryBuilder('user');
    // Apply query filtering if provided
    if (query) {
      usersQuery.where(
        'user.name LIKE :query OR user.email LIKE :query OR user.phone_number LIKE :query',
        {
          query: `%${query}%`,
        },
      );
    }

    // Apply offset if provided
    if (offset) {
      usersQuery.skip(offset);
    }

    // Apply limit if provided
    if (limit) {
      usersQuery.take(limit);
    }

    usersQuery.orderBy('user.id', 'DESC');

    const users = await usersQuery.getMany()

    if (!users.length) {
      return { users: [], error: { message: 'No user found' } };
    }
    return { users };
  }

  @GrpcMethod('UserService', 'Register')
  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    const { name, email, password, phone_number, address } = registerDto;

    // Check if a user with the same email or phone number exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    const existingPhone = await this.userRepository.findOne({ where: { phone_number } });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    if (existingPhone) {
      throw new BadRequestException('User with this phone number already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user object
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      phone_number,
      address,
    });

    // Fetch the "User" role from the RoleService via gRPC (expecting role IDs as strings)
    const roleResponse = await lastValueFrom(this.roleService.GetRoleByName({ name: 'user' }));
    // const roleResponseId = roleResponse.role.id
    if (!roleResponse || !roleResponse.role.id?.length) {

      throw new BadRequestException('Role "user" not found');
    }

    const roleId = roleResponse.role.id;  // Expecting the role ID as a string

    // Assign the roleId to the user
    user.roleId = roleId;

    // Save the new user with the assigned roleId
    const savedUser = await this.userRepository.save(user);

    // Create an activation token for the new user
    const activationToken = await this.createActivationToken(savedUser);

    // Produce a Kafka event for user registration
    await this.kafkaProducerService.sendUserRegisteredEvent({
      email: savedUser.email,
      name: savedUser.name,
      activation_token: activationToken.Token,
      activation_code: activationToken.ActivationCode,
    });

    console.log(activationToken.ActivationCode)
    return {
      activation_token: activationToken.Token,
    };
  }

  // Activate a user with activation token
  async activateUser(activationDto: ActivationDto, response: Response) {
    const { ActivationToken, ActivationCode } = activationDto;

    const newUser: { user: UserData; ActivationCode: string } = this.jwtService.verify(ActivationToken, {
      secret: this.configService.get<string>('ACTIVATION_SECRET'),
    } as JwtVerifyOptions) as { user: UserData; ActivationCode: string };

    if (newUser.ActivationCode !== ActivationCode) {
      throw new BadRequestException('Invalid activation code');
    }

    const { name, email, password, phone_number, address } = newUser.user;
    const user = this.userRepository.create({
      name,
      email,
      password,
      phone_number,
      address,
    });

    const savedUser = await this.userRepository.save(user);
    return { savedUser, response };
  }

  // Create activation token
  async createActivationToken(user: UserData) {
    const ActivationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const Token = this.jwtService.sign(
      {
        user,
        ActivationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '10m',
      },
    );
    return {
      Token,
      ActivationCode
    };
  }

  // Login method
  @GrpcMethod('UserService', 'Login')
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await this.comparePassword(password, user.password))) {
      const tokenSender = new TokenSender(this.configService, this.jwtService, this.userRepository);
      return tokenSender.sendToken(user);
    } else {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: {
          message: 'Invalid email or password',
        },
      };
    }
  }

  // Password comparison utility
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Get logged-in user info
  @GrpcMethod('UserService', 'GetLoggedInUser')
  async getLoggedInUser(req: any) {
    const user = req.user;
    const refreshToken = req.refreshtoken;
    const accessToken = req.accesstoken;
    return { user, refreshToken, accessToken };
  }

  // Fetch a user by email
  async getUserByEmail(email: string): Promise<GetUserByEmailResponse> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return { user, error: { message: `user with ${email} not found` } };
    }
    return { user };
  }

  async getUserById(id: string): Promise<GetUserByEmailResponse> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return { user, error: { message: `user with ${id} not found` } };
    }
    return { user }
  }


  @GrpcMethod('UserService', 'Logout')
  async Logout(req: any) {
    req.user = null;
    req.refreshtoken = null;
    req.accesstoken = null;
    return { message: 'Logged out successfully!' };
  }

  // Generate forgot password link
  async generateForgotPasswordLink(user: User) {
    const forgotPasswordToken = this.jwtService.sign(
      {
        userId: user.id,
      },
      {
        secret: this.configService.get<string>('FORGOT_PASSWORD_SECRET'),
        expiresIn: '5m'
      },
    );
    return forgotPasswordToken;
  }

  //Gernerate change password link
  async generateChangePasswordLink(user: User) {
    const changePasswordToken = this.jwtService.sign(
      {
        userId: user.id,
      },
      {
        secret: this.configService.get<string>('CHANGE_PASSWORD_SECRET'),
        expiresIn: '5m'
      },
    );
    return changePasswordToken;
  }

  //Forgot password
  @GrpcMethod('UserService', 'forgotPassword')
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException("User is not found!");
    }

    const forgotPasswordToken = await this.generateForgotPasswordLink(user);
    const resetPasswordUrl = this.configService.get<string>('CLIENT_SIDE_URI') +
      `/reset-password?verify=${forgotPasswordToken}`;

    await this.kafkaProducerService.sendUserForgotPasswordEvent({
      email: user.email,
      name: user.name,
      forgotPasswordToken: forgotPasswordToken,
    });
    return { forgotPasswordToken, message: `Your forgot password request was successful!` };
  }

  // Reset password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, forgotPasswordToken } = resetPasswordDto;
    let decoded;
    try {
      decoded = this.jwtService.verify(forgotPasswordToken, {
        secret: this.configService.get<string>('FORGOT_PASSWORD_SECRET'),
      });
    } catch (error) {
      throw new BadRequestException('Invalid or expired token!');
    }

    if (!decoded || !decoded.userId) {
      throw new BadRequestException('Invalid token payload!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.update(
      { id: decoded.userId },
      { password: hashedPassword },
    );

    const user = await this.userRepository.findOne({ where: { id: decoded.userId } });
    if (!user) {
      throw new Error('User not found');
    }

    return { user, message: 'Password has been successfully reset.' };
  }

  // Request change password
  @GrpcMethod('UserService', 'requestChangePassword')
  async requestChangePassword(requestChangePasswordDto: RequestChangePasswordDto, req: any) {
    const { oldPassword } = requestChangePasswordDto;
    const user = await this.userRepository.findOne({ where: { id: req.id } });
    if (!user) {
      throw new BadRequestException("User is not found!");
    }
    if (await this.comparePassword(oldPassword, user.password)) {
      const changePasswordToken = await this.generateForgotPasswordLink(user);
      const changePasswordUrl = this.configService.get<string>('CLIENT_SIDE_URI') +
        `/change-password?verify=${changePasswordToken}`;

      await this.kafkaProducerService.sendUserRequsetChangePasswordEvent({
        email: user.email,
        name: user.name,
        changePasswordToken: changePasswordToken,
      });
      return { changePasswordToken, message: `Your change password request was successful!` };
    } else {
      throw new BadRequestException('Old password does not match!');
    }
  }

  // Change password
  @GrpcMethod('UserService', 'changePassword')
  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { newPassword, changePasswordToken } = changePasswordDto;
    let decoded;

    try {
      decoded = this.jwtService.verify(changePasswordToken, {
        secret: this.configService.get<string>('CHANGE_PASSWORD_SECRET'),
      });
    } catch (error) {
      throw new BadRequestException('Invalid or expired token!');
    }

    if (!decoded || !decoded.userId) {
      throw new BadRequestException('Invalid token payload!');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(
      { id: decoded.userId },
      { password: hashedPassword },
    );

    const user = await this.userRepository.findOne({ where: { id: decoded.userId } });
    if (!user) {
      throw new Error('User not found');
    }

    return { user, message: 'Password has been successfully changed.' };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Find the user by ID
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException(`User with ID ${id} not found`);
    }

    // Update user properties
    Object.assign(user, updateUserDto);

    // If roleId is provided, assign the role to the user
    if (updateUserDto.roleId) {
      user.roleId = updateUserDto.roleId;
    }

    // Save the updated user
    return await this.userRepository.save(user);
  }

  // Create a user
  async createUser(data: RegisterDto, roleId: string): Promise<User> {
    const newUser = this.userRepository.create(data);

    // Assign the roleId to the new user
    newUser.roleId = roleId;

    return await this.userRepository.save(newUser);
  }



  // Count the total number of users
  async countUsers(): Promise<number> {
    return this.userRepository.count();
  }

  async countUsersForMonth(year: number, month: number): Promise<number> {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59); // Last day of the month

    return this.userRepository.count({
      where: {
        createdAt: Between(startOfMonth, endOfMonth),
      },
    });
  }


  // Remove a user by name
  async deleteById(id: string): Promise<void> {
    const userResponse = await this.getUserById(id);
    const user = userResponse.user;
    if (user) {
      await this.userRepository.remove(user);
    } else {
      throw new Error(`User with id ${id} not found`);
    }
  }

    //get all users without query
    async findAllUsers(): Promise<UserListResponse> {
      const users = await this.userRepository.createQueryBuilder('user').getMany();
      return { users };
    }
};
