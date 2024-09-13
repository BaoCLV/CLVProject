import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ActivationDto, ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterResponse, LoginResponse, GetUserByEmailResponse } from '../types/user.types';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
// import { EmailService } from '../email/email.service';
import { TokenSender } from '../utils/sendToken';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { error } from 'console';

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
  activateUser(activationDto: ActivationDto, res: Response): import("../types/user.types").ActivationResponse | PromiseLike<import("../types/user.types").ActivationResponse> {
    throw new Error('Method not implemented.');
  }
  private roleService: RoleService;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    // private readonly emailService: EmailService,
  ) { }

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

    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name,
      email,
      password,
      phone_number,
      address,
    });

    // Assign role via gRPC
    // const roleResponse = await this.roleService.getRoleById({ userId: user.name }).toPromise();
    // user.role = roleResponse.role || 'user'; // Default to 'user' if no role is provided

    await this.userRepository.save(user);

    const activationToken = await this.createActivationToken(user);

    // const activationCode = activationToken.ActivationCode;
    const activation_token = activationToken.Token;
    console.log(user)
    // await this.emailService.sendMail({
    //   email,
    //   subject: 'Activate your account!',
    //   template: 'activation-mail',
    //   name,
    //   ActivationCode: activationCode,
    // });

    return {
      activation_token,
    };
  }

  // Create activation token
  async createActivationToken(user: UserData) {
    const ActivationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const Token = this.jwtService.sign(
      {
        user,
        // ActivationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '10m',
      },
    );
    return {
      Token,
      // ActivationCode 
    };
  }
  @GrpcMethod('UserService', 'Login')
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user &&
      // (await bcrypt.compare(password, user.password))
      password == user.password
    ) {
      const tokenSender = new TokenSender(this.configService, this.jwtService, this.userRepository);
      console.log(user)
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
  @GrpcMethod('UserService', 'GetLoggedInUser')
  async getLoggedInUser(req: any) {
    const user = req.user;
    const refreshToken = req.refreshtoken;
    const accessToken = req.accesstoken;
    return { user, refreshToken, accessToken };
  }

  // @GrpcMethod('UserService', 'GetUserByEmail')
  // async getUserByEmail(req: { email: string }) {
  //   const email = req.email;

  //   const userFound = await this.userRepository.findOne({ where: { email } });
  //   if (!userFound) {
  //     return { userFound, error:{message:"user not found"} };
  //   }
  //   return { userFound };

  // }

  async getUserByEmail(email: string): Promise<GetUserByEmailResponse> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return { user, error: { message: `user with ${email} not found` } };
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
  @GrpcMethod('UserService', 'GetUsers')
  async getUsers() {
    return this.userRepository.find({});
  }

  //Gernerate forgot password link
  async generateForgotPasswordLink(user: User) {
    const forgotPasswordToken = this.jwtService.sign(
      {
        user,
      },
      {
        secret: this.configService.get<string>('FORGOT_PASSWORD_SECRET'),
        expiresIn: '5m'
      },
    );
    return forgotPasswordToken;
  }

  //Forgot password
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

    // await this.emailService.sendMail({
    //   email,
    //   subject: 'Reset your Password!',
    //   template: './forgot-password',
    //   name: user.name,
    //   ActivationCode: resetPasswordUrl,
    // });
    //should change to email activation
    return { message: resetPasswordUrl };
  }

  //reset password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, activationToken } = resetPasswordDto;

    const decoded = await this.jwtService.decode(activationToken);

    if (!decoded || decoded?.exp * 1000 < Date.now()) {
      throw new BadRequestException('Invalid token!');
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    await this.userRepository.update(
      { id: decoded.user.id },
      { password: password }
    );

    // Fetch the updated user
    const user = await this.userRepository.findOne({ where: { id: decoded.user.id } });

    if (!user) {
      throw new Error('User not found');
    }

    return { user };
  }
}
