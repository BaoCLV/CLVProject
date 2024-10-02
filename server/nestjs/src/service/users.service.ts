import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ActivationDto, ChangePasswordDto, ForgotPasswordDto, LoginDto, RegisterDto, RequestChangePasswordDto, ResetPasswordDto, UpdateUserDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterResponse, LoginResponse, GetUserByEmailResponse, UserListResponse } from '../types/user.types';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenSender } from '../utils/sendToken';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';

interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  address: string;
}

interface RoleService {
  getRoleById(data: { userId: string }): Observable<{ role: string }>;
}

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly kafkaProducerService: KafkaProducerService,
    // private readonly emailService: EmailService,
  ) { }

  @GrpcMethod('UserService', 'GetAllUser')
  async getAllUser({ query,
    limit,
    offset
  }: { query?: string; limit?: number; offset?: number }): Promise<UserListResponse> {
    const usersQuery = this.userRepository.createQueryBuilder('user');
    // Apply query filtering if provided
    if (query) {
      usersQuery.where(
        'user.name LIKE :query OR user.email LIKE :query OR user.address LIKE :query OR user.phone_number LIKE :query',
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



    // Assign role via gRPC
    // const roleResponse = await this.roleService.getRoleById({ userId: user.name }).toPromise();
    // user.role = roleResponse.role || 'user'; // Default to 'user' if no role is provided
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = ({
      name,
      email,
      password: hashedPassword,
      phone_number,
      address,
    });

    const activationToken = await this.createActivationToken(user);

    await this.kafkaProducerService.sendUserRegisteredEvent({
      email: user.email,
      name: user.name,
      activation_token: activationToken.Token, // Send the token
      activation_code: activationToken.ActivationCode,
    });
    // const activationCode = activationToken.ActivationCode;
    const activation_token = activationToken.Token;

    return {
      activation_token,
    };
  }
  //activate user
  async activateUser(activationDto: ActivationDto, response: Response) {
    const { ActivationToken, ActivationCode } = activationDto;

    const newUser: { user: UserData; ActivationCode: string } =
      this.jwtService.verify(ActivationToken, {
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
    console.log(ActivationCode)
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
  @GrpcMethod('UserService', 'Login')
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await this.comparePassword(password, user.password))
    ) {
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

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  @GrpcMethod('UserService', 'GetLoggedInUser')
  async getLoggedInUser(req: any) {
    const user = req.user;
    const refreshToken = req.refreshtoken;
    const accessToken = req.accesstoken;
    return { user, refreshToken, accessToken };
  }

  async getUserByEmail(email: string): Promise<GetUserByEmailResponse> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return { user, error: { message: `user with ${email} not found` } };
    }
    return { user }
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

  //Gernerate forgot password link
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
      throw new BadRequestException("User is not found!")
    }

    const forgotPasswordToken = await this.generateForgotPasswordLink(user)
    const resetPasswordUrl =
      this.configService.get<string>('CLIENT_SIDE_URI') +
      `/reset-password?verify=${forgotPasswordToken}`;

    await this.kafkaProducerService.sendUserForgotPasswordEvent({
      email: user.email,
      name: user.name,
      forgotPasswordToken: forgotPasswordToken,
    });
    return { forgotPasswordToken, message: `Your forgot password request succesfully!` };
  }

  //reset password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, forgotPasswordToken } = resetPasswordDto;

    // Verify the JWT token, which checks the expiration and validity
    let decoded;
    try {
      decoded = this.jwtService.verify(forgotPasswordToken, {
        secret: this.configService.get<string>('FORGOT_PASSWORD_SECRET'),
      });
    } catch (error) {
      throw new BadRequestException('Invalid or expired token!');
    }

    // Proceed with password reset only if token is valid
    if (!decoded || !decoded.userId) {
      throw new BadRequestException('Invalid token payload!');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    await this.userRepository.update(
      { id: decoded.userId },
      { password: hashedPassword },
    );

    // Fetch the updated user
    const user = await this.userRepository.findOne({ where: { id: decoded.userId } });

    if (!user) {
      throw new Error('User not found');
    }

    return { user, message: 'Password has been successfully reset.' };
  }

  //Request Change Password
  @GrpcMethod('UserService', 'requestChangePassword')
  async requestChangePassword(requestChangePasswordDto: RequestChangePasswordDto, req: any) {
    const { oldPassword } = requestChangePasswordDto;

    const user = await this.userRepository.findOne({ where: { id: req.id } });
    if (!user) {
      throw new BadRequestException("User is not found!")
    }
    if (await this.comparePassword(oldPassword, user.password)
    ) {
      const changePasswordToken = await this.generateChangePasswordLink(user)
      const changePasswordUrl =
        this.configService.get<string>('CLIENT_SIDE_URI') +
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

  @GrpcMethod('UserService', 'changePassword')
  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { newPassword, changePasswordToken } = changePasswordDto;

    // Verify the JWT token, which checks the expiration and validity
    let decoded;

    try {
      decoded = this.jwtService.verify(changePasswordToken, {
        secret: this.configService.get<string>('CHANGE_PASSWORD_SECRET'),
      });
    } catch (error) {
      throw new BadRequestException('Invalid or expired token!');
    }

    // Proceed with password reset only if token is valid
    if (!decoded || !decoded.userId) {
      throw new BadRequestException('Invalid token payload!');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);


    // Update the user's password in the database
    await this.userRepository.update(
      { id: decoded.userId },
      { password: hashedPassword },
    );

    // Fetch the updated user
    const user = await this.userRepository.findOne({ where: { id: decoded.userId } });

    if (!user) {
      throw new Error('User not found');
    }
    const updatedPassword = user.password

    return { user, updatedPassword, message: 'Password has been successfully changed.' };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Find the user by ID
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException(`User with ID ${id} not found`);
    }

    // Merge updated data into the existing user entity
    Object.assign(user, updateUserDto);

    // Save the updated user entity to the database
    return await this.userRepository.save(user);
  }

  // //Email change
  // async updateEmail(changeEmailDto: ChangeEmailDto, res: Response): Promise<RegisterResponse> {
  //   const { oldEmail, newEmail } = changeEmailDto;

  //   const user = await this.userRepository.findOne({ where: { email: oldEmail } });

  //   if (!user) {
  //     throw new BadRequestException(`User with email ${oldEmail} not found.`);
  //   }

  //   const existingUserWithNewEmail = await this.userRepository.findOne({ where: { email: newEmail } });

  //   if (existingUserWithNewEmail) {
  //     throw new BadRequestException(`The new email ${newEmail} is already in use by another user.`);
  //   }

  //   const activationToken = await this.createEmailActivationToken({ email: oldEmail });

  //   await this.kafkaProducerService.sendUserEmailChangeevent({
  //     oldEmail: user.email,
  //     newEmail: newEmail,
  //     activation_token: activationToken.Token,
  //     activation_code: activationToken.ActivationCode,  
  //   });

  //   return {
  //     activation_token: activationToken.Token,
  //   };
  // }

  // This remains unchanged as it already generates a token for the old email.
  async createEmailActivationToken(user: { email: string }) {
    const ActivationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Generate a JWT token with the user's old email and activation code
    const Token = this.jwtService.sign(
      {
        user,
        ActivationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '10m',  // The token will expire in 10 minutes
      },
    );

    return {
      Token,
      ActivationCode,
    };
  }

  // create a user by admin
  async createUser(data: RegisterDto): Promise<User> {
    const newUser = this.userRepository.create(data);
    return this.userRepository.save(newUser);
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
};