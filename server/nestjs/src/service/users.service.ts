import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

interface RoleServiceClient {
  getRolesByNames(data: { roleNames: string[] }): Observable<{ roles: string[] }>;
}

@Injectable()
export class UsersService implements OnModuleInit {

  // gRPC client for RoleService
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'role',
      protoPath: join('./src/protos/roles.proto'), // Path to role proto file
      url: 'localhost:5001', // Role service gRPC endpoint
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
  async getAllUser(): Promise<UserListResponse> {
    const users = await this.userRepository.createQueryBuilder('user').getMany();
    if (!users.length) {
      return { users: [], error: { message: 'No user found' } };
    }
    return { users };
  }

  @GrpcMethod('UserService', 'Register')
  async register(registerDto: RegisterDto, res: Response): Promise<RegisterResponse> {
    const { name, email, password, phone_number, address } = registerDto;
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
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      phone_number,
      address,
    });

    // Create an activation token for the new user
    const activationToken = await this.createActivationToken(user);

    // Produce a Kafka event for user registration
    await this.kafkaProducerService.sendUserRegisteredEvent({
      email: user.email,
      name: user.name,
      activation_token: activationToken.Token, // Send the token
      activation_code: activationToken.ActivationCode,
    });

    const activation_token = activationToken.Token;

    return {
      activation_token,
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

  // User logout
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

  // Handle forgot password logic
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

  // Update user details
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  // Count the total number of users
  async countUsers(): Promise<number> {
    return this.userRepository.count();
  }
}
