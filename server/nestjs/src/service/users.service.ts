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
import { Avatar } from 'src/entities/avatar.entity';


interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  address: string;
  roleId: string;
}

interface RoleResponse {
  role: {
    id: string;
    name: string;
    permissions?: any[];
  };
}

interface RoleServiceClient {
  GetRoleByName(data: { name: string }): Observable<{ role: { id: string } }>;
}

@Injectable()
export class UsersService implements OnModuleInit {

  // gRPC client for RoleService
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'role',
      protoPath: join('./src/protos/roles.proto'),
      url: '0.0.0.0:5003',
    },
  })
  private roleClient: ClientGrpc;
  private roleService: RoleServiceClient;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,

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

    const hashedPassword = await bcrypt.hash(password, 10);


    // Fetch the "User" role from the RoleService via gRPC (expecting role IDs as strings)
    const roleResponse = await lastValueFrom(this.roleService.GetRoleByName({ name: 'user' }));
    // const roleResponseId = roleResponse.role.id
    if (!roleResponse || !roleResponse.role.id?.length) {

      throw new BadRequestException('Role "user" not found');
    }
    const roleId = roleResponse.role.id;
    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
      address,
      roleId
    };

    // Assign the roleId to the user
    user.roleId = roleId;

    // Save the new user with the assigned roleId when log in with GG
    if (user.phone_number === "") {
      await this.userRepository.save(user);
    }

    // Create an activation token for the new user
    const activationToken = await this.createActivationToken(user);

    // Produce a Kafka event for user registration
    await this.kafkaProducerService.sendUserRegisteredEvent({
      email: user.email,
      name: user.name,
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

    const { name, email, password, phone_number, address, roleId } = newUser.user;
    const user = this.userRepository.create({
      name,
      email,
      password,
      phone_number,
      address,
      roleId
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
      return { error: { message: `user with ${email} not found` } };
    }
    return { user };
  }

  async updateTokenForGGUser(email: string): Promise<Boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return false;
    }
    const tokenSender = new TokenSender(this.configService, this.jwtService, this.userRepository);
    await tokenSender.sendToken(user)
    return true;
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
      return { message: `Your change password request was successful!` };
    } else {
      throw new BadRequestException('Old password does not match!');
    }
  }

  // Change password
  @GrpcMethod('UserService', 'changePassword')
  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { newPassword, oldPassword, userID } = changePasswordDto;
    const user = await this.userRepository.findOne({ where: { id: userID } });
    if (!user) {
      throw new BadRequestException("User is not found!");
    }
    if (await this.comparePassword(oldPassword, user.password)) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userRepository.update(
        { id: userID },
        { password: hashedPassword },
      );
      return { user, message: 'Password has been successfully changed.' };
    } else {
      throw new BadRequestException('Old password does not match!');
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Find the user by ID
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserDto);

    if (updateUserDto.roleId !== undefined && updateUserDto.roleId !== null) {
      user.roleId = updateUserDto.roleId;
    }

    // Save the updated user
    return await this.userRepository.save(user);
  }

  async createUser(data: RegisterDto): Promise<User> {
    const roleResponse = await lastValueFrom(this.roleService.GetRoleByName({ name: 'user' }));

    if (!roleResponse || !roleResponse.role) {
      throw new BadRequestException('Role "user" not found');
    }

    const roleId = roleResponse.role.id;

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = this.userRepository.create({
      ...data,
      password: hashedPassword,
      roleId: roleId,
    });
    // Save the new user to the database
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

  //get all users without query
  async findAllUsers(): Promise<UserListResponse> {
    const users = await this.userRepository.createQueryBuilder('user').getMany();
    return { users };
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
  async uploadAvatar(userId: string, imageDataBase64: string): Promise<Avatar> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if the user already has an avatar
    let avatar = await this.avatarRepository.findOne({ where: { userId: user.id } });

    if (avatar) {
      // Update the existing avatar using the setter
      avatar.imageDataBase64 = imageDataBase64;
    } else {
      // Create a new avatar
      avatar = this.avatarRepository.create({
        userId: user.id,
        imageDataBase64,  // Use setter to convert base64 to Buffer
      });
    }

    // Save (insert or update) the avatar
    return this.avatarRepository.save(avatar);
  }


  async getAvatar(userId: string): Promise<Avatar> {
    const avatar = await this.avatarRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });


    return avatar;
  }
};
